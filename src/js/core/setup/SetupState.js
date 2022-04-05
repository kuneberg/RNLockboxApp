import { observable, action, makeAutoObservable } from "mobx"


export default class SetupState {

  @observable _initialized = false;
  @observable _btEnabled = false;
  @observable _scanningForDevices = false;
  @observable _scanningForDevicesError = null;
  @observable _discoveredDevices = new Map();
  @observable _selectedDevice = null;
  @observable _scanningForAPs = false;
  @observable _discoveredAccessPoints = [];
  @observable _connectingToAp = false;
  @observable _connectingError = null;//'Connection Error. Please check access point name and password.';
  @observable _connectedToAp = false;
  @observable _deviceIp = null;
  @observable _accessPoint = null;
  @observable _deviceState = null;

  constructor() {
    makeAutoObservable(this);

    // for (let i = 0; i < 5; i++) {
    //   this._discoveredDevices.set(`${i}`,
    //   {
    //     id: `${i}`,
    //     name: `LockBox 000${i+1}`,
    //     rssi: 4
    //   });
    // }
    // this._discoveredDevices.set("1",
    //   {
    //     id: "1",
    //     name: "LockBox 0001",
    //     rssi: 4
    //   });
    // this._discoveredDevices.set("2",
    //   {
    //     id: "2",
    //     name: "LockBox 0002",
    //     rssi: 4
    //   });

    this._discoveredAccessPoints = [
      {
        s: "Kunegerg_5Ghz",
        q: 3
      },
      {
        s: "Kunegerg_2Ghz",
        q: 4
      },
      {
        s: "SaltBox",
        q: 2
      },
      {
        s: "Sunrise",
        q: 1
      },
      {
        s: "Sunrise_5G",
        q: 0
      }

    ]
  }

  get initialized() {
    return this._initialized;
  }

  set initialized(value) {
    this._initialized = value;
  }

  get btEnabled() {
    return this._btEnabled;
  }

  set btEnabled(value) {
    this._btEnabled = value;
  }

  get scanningForDevices() {
    return this._scanningForDevices;
  }

  set scanningForDevices(value) {
    this._scanningForDevices = value;
  }

  get scanningForDevicesError() {
    return this._scanningForDevicesError;
  }

  set scanningForDevicesError(value) {
    this._scanningForDevicesError = value;
  }

  get discoveredDevices() {
    return this._discoveredDevices;
  }

  set discoveredDevices(value) {
    this._discoveredDevices = value;
  }

  get discoveredDevicesArray() {
    return this.discoveredDevices.values()
  }

  get selectedDevice() {
    return this._selectedDevice;
  }

  set selectedDevice(value) {
    this._selectedDevice = value;
  }

  get scanningForAPs() {
    return this._scanningForAPs;
  }

  set scanningForAPs(value) {
    this._scanningForAPs = value;
  }

  get discoveredAccessPoints() {
    return this._discoveredAccessPoints;
  }

  set discoveredAccessPoints(value) {
    this._discoveredAccessPoints = value;
  }

  get connectingToAp() {
    return this._connectingToAp;
  }

  set connectingToAp(value) {
    this._connectingToAp = value;
  }

  get connectedToAp() {
    return this._connectedToAp;
  }

  set connectedToAp(value) {
    this._connectedToAp = value;
  }

  get connectingError() {
    return this._connectingError;
  }

  set connectingError(value) {
    this._connectingError = value;
  }

  get deviceIp() {
    return this._deviceIp;
  }

  set deviceIp(value) {
    this._deviceIp = value;
  }
}
