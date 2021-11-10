import { observable, action, makeAutoObservable } from "mobx"



export default class State {
    @observable ts = null
    @observable _initialized = false
    @observable _authenticated = false
    @observable _accId = null
    
    @observable _authErrorMsg = null
    
    @observable _counter = 1
    
    @observable _memories = null
    
    @observable _memory = null
    
    @observable _editingMemory = null
    
    @observable _tags = null
    
    @observable _lockboxHosts = [
        // {
        //     name: 'Alex\'s Lockbox',
        //     address: '192.168.1.3'
        // },
        {
            name: 'Maks\'s Lockbox',
            address: '192.168.1.22'
        }
    ]
    
    @observable _discoveryStarted = false
    
    // @observable lockboxHosts = []
    @observable _lockboxHost = null
    
    @observable _deviceInfo = null
    
    @observable _accounts = null
    

    constructor() {
        makeAutoObservable(this)
    }


    get initialized() {
        return this._initialized
    }
    set initialized(value) {
        this._initialized = value
    }

    get authenticated() {
        return this._authenticated
    }
    set authenticated(authenticated) {
        this._authenticated = authenticated
    }

    get accId() {
        return this._accId
    }
    set accId(value) {
        this._accId = value
    }

    get authErrorMsg() {
        return this._authErrorMsg
    }
    set authErrorMsg(value) {
        this._authErrorMsg = value
    }

    get counter() {
        return this._counter
    }
    set counter(value) {
        this._counter = value
    }

    get memories() {
        return this._memories
    }
    set memories(value) {
        this._memories = value
    }

    get memory() {
        return this._memory
    }
    set memory(value) {
        this._memory = value
    }

    get editingMemory() {
        return this._editingMemory
    }
    set editingMemory(value) {
        this._editingMemory = value
    }

    get tags() {
        return this._tags
    }
    set tags(value) {
        this._tags = value
    }

    get lockboxHosts() {
        return this._lockboxHosts
    }
    set lockboxHosts(value) {
        this._lockboxHosts = value
    }

    get discoveryStarted() {
        return this._discoveryStarted
    }
    set discoveryStarted(value) {
        this._discoveryStarted = value
    }

    get lockboxHost() {
        return this._lockboxHost
    }
    set lockboxHost(value) {
        this._lockboxHost = value
    }

    get deviceInfo() {
        return this._deviceInfo
    }
    set deviceInfo(value) {
        this._deviceInfo = value
    }

    get accounts() {
        return this._accounts
    }
    set accounts(value) {
        this._accounts = value
    }

    getMemory(id) {
        let memories = this.memories.filter(memory => memory.id === id)
        return memories ? memories[0] : null
    }

    @action
    setEditingMemory(memory) {
        this.editingMemory = memory
    }
}