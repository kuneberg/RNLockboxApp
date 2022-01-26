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

const SERVICE_UUID = "a0b40001-926d-4d61-98df-8c5c62ee53b3";
const STATE_CHARACTERISTIC_UUID = "a0b40002-926d-4d61-98df-8c5c62ee53b3";
const DATA_CHARACTERISTIC_UUID = "a0b40003-926d-4d61-98df-8c5c62ee53b3";
const COMMAND_CHARACTERISTIC_UUID = "a0b40004-926d-4d61-98df-8c5c62ee53b3";

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
    await BleManager.scan([SERVICE_UUID], 60, true);
    this.state.scanningForDevices = true;
    console.log("Scanning for devices started");
  }

  async stopScan() {
    await BleManager.stopScan();
  }

  async connectAndScanForAPs(device) {
    if (this.state.scanningForDevices) {
      await this.stopScan()
    }
    this.state.selectedDevice = device;
    this.state.scanningForAPs = true;
    await this.connect();
    await this.retrieveServices();
    await this.startNotifications();
    await this.sendScanCommand();
  }

  async connect() {
    let deviceId = this.state.selectedDevice.id;
    console.log("Connecting to device:", deviceId);
    await BleManager.connect(deviceId);
    console.log("Connected to device:", deviceId);
    await BleManager.requestMTU(deviceId, 201);
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
    console.log(`Starting notifications ... device id: ${deviceId}, service uuid: ${SERVICE_UUID}, characteristic uuid: ${STATE_CHARACTERISTIC_UUID}`);
    await BleManager.startNotification(deviceId,
        SERVICE_UUID,
        STATE_CHARACTERISTIC_UUID);
    console.log("Started notifications", deviceId);
  }

  async sendScanCommand() {
    let deviceId = this.state.selectedDevice.id;
    let command = JSON.stringify({command: "COMMAND_SCAN"});
    let data = stringToBytes(command);
    console.log("Sending scan command ...", command);
    let response  = await BleManager.write(deviceId,
        SERVICE_UUID,
        COMMAND_CHARACTERISTIC_UUID,
        data, data.length);

    console.log("Sent scan command");
  }

  async fetchAccessPoints() {
    let deviceId = this.state.selectedDevice.id;
    let data = await BleManager.read(
        deviceId,
        SERVICE_UUID,
        DATA_CHARACTERISTIC_UUID);

    console.log(bytesToString(data));

    let accessPoints = JSON.parse(bytesToString(data));
    this.state.discoveredAccessPoints = accessPoints;
    this.state.scanningForAPs = false;
    console.log(accessPoints);
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
    let state = JSON.parse(bytesToString(value));
    console.log("State changed:", state);

    if (state.state === 'STATE_SCANNED') {
      await this.fetchAccessPoints();
    }
  }
}
