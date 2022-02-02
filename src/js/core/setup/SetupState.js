import { observable, action, makeAutoObservable } from "mobx"


export default class SetupState {

  @observable _initialized = false;
  @observable _scanningForDevices = false;
  @observable _scanningForDevicesError = null;
  @observable _discoveredDevices = new Map();
  @observable _selectedDevice = null;
  @observable _scanningForAPs = false;
  @observable _discoveredAccessPoints = [];
  @observable _connectingToAp = false;
  @observable _accessPoint = null;
  @observable _deviceState = null;

  constructor() {
    makeAutoObservable(this);
  }

  get initialized() {
    return this._initialized;
  }

  set initialized(value) {
    this._initialized = value;
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
}
