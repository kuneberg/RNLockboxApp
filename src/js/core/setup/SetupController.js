import SetupState from "./SetupState";
import BleManager, {stopScan} from 'react-native-ble-manager'
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform
} from "react-native";
import {bytesToString, stringToBytes} from "convert-string";
import {toJS} from 'mobx';

const SCANNER_SERVICE_UUID = "a0b40001-926d-4d61-98df-8c5c62ee53b3";
const CONNECTOR_SERVICE_UUID = "a0b40001-927d-4d61-98df-8c5c62ee53b3";
const SCANNER_REQUEST_CHARACTERISTIC_UUID = "a0b40002-926d-4d61-98df-8c5c62ee53b3";
const CONNECTOR_REQUEST_CHARACTERISTIC_UUID = "a0b40002-927d-4d61-98df-8c5c62ee53b3";
const SCANNER_RESPONSE_CHARACTERISTIC_UUID = "a0b40003-926d-4d61-98df-8c5c62ee53b3";
const CONNECTOR_RESPONSE_CHARACTERISTIC_UUID = "a0b40003-927d-4d61-98df-8c5c62ee53b3";

export default class SetupController {
  _state = null;
  _bleManagerModule = null;
  _bleEmitter = null;

  constructor() {
    this._state = new SetupState();
    this._bleManagerModule = NativeModules.BleManager;
    this._bleEmitter = new NativeEventEmitter(this._bleManagerModule);
    this.initialize();
  }

  get state() {
    return this._state;
  }

  async initialize() {
    try {
      await BleManager.start({showAlert: false});
      this._bleEmitter.addListener('BleManagerStopScan', () => this.handleStopScan());
      this._bleEmitter.addListener("BleManagerDiscoverPeripheral", (device) => this.handleDiscoveredDevice(device));
      this._bleEmitter.addListener("BleManagerDidUpdateValueForCharacteristic",
          ({ value, device, characteristic, service }) => this.handleCharacteristicUpdated(value, device, characteristic, service)
      );
      this.state.initialized = true;
      console.log("Module initialized");
    } catch (e) {
      console.log("Module not initialized:", e);
    }
  }

  async hasPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      let hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      console.log("Has permission:", hasPermission);
      return hasPermission;
    }
    return true;
  }

  async grantPermission() {
    let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Permission granted");
      return true;
    } else {
      console.log("Permission denied");
      return false;
    }
  }

  async startScan() {
    if (!await this.hasPermission()) {
      if (!await this.grantPermission()) {
        this.state.scanningForDevicesError = "Insufficient permissions";
        return;
      }
    }

    await this.disconnect();

    this.state.discoveredDevices.clear();
    await BleManager.scan([SCANNER_SERVICE_UUID, CONNECTOR_SERVICE_UUID], 60, true);
    this.state.scanningForDevices = true;
    console.log("Scanning for devices started");
  }

  async stopScan() {
    await BleManager.stopScan();
  }

  async refreshAPs() {
    await this.connectAndScanForAPs(this.state.selectedDevice);
  }

  async connectAndScanForAPs(device) {
    if (this.state.scanningForDevices) {
      await this.stopScan()
    }

    this.state.discoveredAccessPoints.clear();
    this.state.selectedDevice = device;
    this.state.scanningForAPs = true;

    await this.connect();
    await this.retrieveServices();
    await this.startNotifications();
    await this.requestMtu()
    await this.sendScanCommand();
  }

  async requestMtu() {
    let deviceId = this.state.selectedDevice.id;
    await BleManager.requestMTU(deviceId, 61);
    console.log("MTU:", 64);
  }

  async connect() {
    let deviceId = this.state.selectedDevice.id;
    console.log("Connecting to device:", deviceId);
    await BleManager.connect(deviceId);
    console.log("Connected to device:", deviceId);
  }

  async disconnect() {
    let deviceId = this.state.selectedDevice?.id;
    if (deviceId) {
      await BleManager.disconnect(deviceId);
    }
  }

  async retrieveServices() {
    let deviceId = this.state.selectedDevice.id;
    console.log("Retrieving services:", deviceId);
    let services = await BleManager.retrieveServices(deviceId);
    console.log("Retrieved services", services);
  }

  async startNotifications() {
    let deviceId = this.state.selectedDevice.id;
    console.log(`Starting notifications ... device id: ${deviceId}, service uuid: ${SCANNER_SERVICE_UUID}, characteristic uuid: ${SCANNER_RESPONSE_CHARACTERISTIC_UUID}`);
    await BleManager.startNotification(deviceId,
        SCANNER_SERVICE_UUID,
        SCANNER_RESPONSE_CHARACTERISTIC_UUID);
    console.log(`Starting notifications ... device id: ${deviceId}, service uuid: ${CONNECTOR_SERVICE_UUID}, characteristic uuid: ${CONNECTOR_RESPONSE_CHARACTERISTIC_UUID}`);
    await BleManager.startNotification(deviceId,
        CONNECTOR_SERVICE_UUID,
        CONNECTOR_RESPONSE_CHARACTERISTIC_UUID);
    console.log("Started notifications", deviceId);
  }

  async sendScanCommand() {
    let deviceId = this.state.selectedDevice.id;
    let command = JSON.stringify({});
    let data = stringToBytes(command);
    console.log("Sending scan command ...", command);
    let response  = await BleManager.write(deviceId,
        SCANNER_SERVICE_UUID,
        SCANNER_REQUEST_CHARACTERISTIC_UUID,
        data, data.length);

    console.log("Sent scan command");
  }

  handleStopScan() {
    this.state.scanningForDevices = false;
    console.log("Scanning for devices stopped");
  }

  handleDiscoveredDevice(device) {
    let deviceId = device.id;
    let deviceName = "Unknown device";
    if (device.name) {
      deviceName = device.name;
    }
    let deviceRssi = device.rssi;

    let devices = this.state.discoveredDevices;

    devices.set(deviceId,
        {
          id: deviceId,
          name: deviceName,
          rssi: deviceRssi
        });

    console.log(`Discovered devices: ${this.state.discoveredDevices}`);
  }

  async handleCharacteristicUpdated(value, deviceId, characteristic, service) {
    let data = bytesToString(value);
    let ap = JSON.parse(data);
    this.state.scanningForAPs = false;
    console.log("AP received:", ap);

    this.state.discoveredAccessPoints.push(ap);
  }
}
