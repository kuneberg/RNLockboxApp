import SetupState from "./SetupState";
import BleManager, { stopScan } from 'react-native-ble-manager'
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform
} from "react-native";
import { bytesToString, stringToBytes } from "convert-string";
import { toJS } from 'mobx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

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
      await BleManager.start({ showAlert: false });
      this._bleEmitter.addListener('BleManagerStopScan', () => this.handleStopScan());
      this._bleEmitter.addListener("BleManagerDiscoverPeripheral", (device) => this.handleDiscoveredDevice(device));
      this._bleEmitter.addListener("BleManagerDidUpdateValueForCharacteristic",
        ({ value, device, characteristic, service }) => this.handleCharacteristicUpdated(value, device, characteristic, service)
      );


      let btState = await BluetoothStateManager.getState();
      console.log(`Initial BT Adapter state is ${btState}`);
      this.state.btEnabled = btState == 'PoweredOn';

      BluetoothStateManager.onStateChange((newBtState) => { 
        console.log(`New BT Adapter state is ${newBtState}`);
        this.state.btEnabled = newBtState == 'PoweredOn' 
      }, true);


      this.state.initialized = true;
      console.log("Module initialized");
    } catch (e) {
      console.log("Module not initialized:", e);
    }
  }

  permissions() {
    if (Platform.OS !== 'android') {
      return [];
    }
    if (Platform.Version >= 31) {
      return [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT];
    }
    if (Platform.Version >= 29) {
      return [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    }
    if (Platform.Version >= 23) {
      return [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
    }

    return [];
  }
  async hasPermission(permission) {
      let hasPermission = await PermissionsAndroid.check(permission);
      console.log(`${permission} - ${hasPermission}`);
      return hasPermission;
  }

  async grantPermission(permission) {
    let granted = await PermissionsAndroid.request(permission);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log(`${permission} granted`);
      return true;
    } else {
      console.log(`${permission} denied`);
      return false;
    }
  }

  async startScan() {
    let permissions = this.permissions();
    for (let permission of permissions) {
      if (!await this.hasPermission(permission)) {
        if (!await this.grantPermission(permission)) {
          this.state.scanningForDevicesError = "Insufficient permissions";
          return;
        }
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

  async connectAP(ssid, password) {
    this.state.connectingToAp = true;
    await this.sendConnectApCommand(ssid, password);
  }

  async requestMtu() {
    if (Platform.OS === 'android') {
      let deviceId = this.state.selectedDevice.id;
      await BleManager.requestMTU(deviceId, 64);
      console.log("MTU:", 64);
    }
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
    let response = await BleManager.write(deviceId,
      SCANNER_SERVICE_UUID,
      SCANNER_REQUEST_CHARACTERISTIC_UUID,
      data, data.length);

    console.log("Sent scan command");
  }

  async sendConnectApCommand(ssid, password) {
    let deviceId = this.state.selectedDevice.id;
    let command = JSON.stringify({ s: ssid, p: password });
    let data = stringToBytes(command);
    console.log("Sending join command ...", command);
    let response = await BleManager.write(deviceId,
      CONNECTOR_SERVICE_UUID,
      CONNECTOR_REQUEST_CHARACTERISTIC_UUID,
      data, data.length);

    console.log("Sent join command");
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
    this.state.discoveredDevices = devices
    console.log(`Discovered devices: ${JSON.stringify(this.state.discoveredDevices.values())}`);
  }

  async handleCharacteristicUpdated(value, deviceId, characteristic, service) {
    console.log(`characteristic updated: ${characteristic}`)
    if (characteristic.toUpperCase() === SCANNER_RESPONSE_CHARACTERISTIC_UUID.toUpperCase()) {
      let data = bytesToString(value);
      let ap = JSON.parse(data);
      this.state.scanningForAPs = false;
      console.log("AP received:", ap);
      let aps = this.state.discoveredAccessPoints
      aps.push(ap)
      this.state.discoveredAccessPoints = aps
    }

    if (characteristic.toUpperCase() === CONNECTOR_RESPONSE_CHARACTERISTIC_UUID.toUpperCase()) {
      let data = bytesToString(value);
      let response = JSON.parse(data);
      this.state.connectingToAp = false;
      if (response.s) {
        this.state.deviceIp = response.i
        this.state.connectedToAp = true;
      } else {
        this.state.connectingError = 'Connection Error. Please check access point name and password.'
      }
      console.log("Response received:", response);
    }
  }
}
