import * as React from 'react';
import State from "./State";
import TestData from './TestData';
import ApiClient from './ApiClient';
import { Buffer } from 'buffer';

// var bonjour = require('bonjour')()
import Zeroconf from 'react-native-zeroconf'
import moment from 'moment';
import { toJS } from 'mobx';


// const

var RNFS = require('react-native-fs');

// let zeroconf = null

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

class FileReader {

    path = null
    blockSize = 0
    size = null
    pos = 0;

    constructor(path, blockSize) {
        this.path = path
        this.blockSize = blockSize
    }

    get chunks() {
        return Math.floor((this.size - 1) / this.blockSize + 1)
    }

    async open() {
        if (this.size == null) {
            let stat = await RNFS.stat(this.path)
            //console.log('FILESTAT: ' + JSON.stringify(stat))
            this.size = stat.size
        }
    }

    async read() {
        if (this.size != null && this.pos >= this.size) {
            return null // eof
        }
        let data = await RNFS.read(this.path, this.blockSize, this.pos, 'base64')
        // console.log('read file position: ' + this.pos)
        this.pos += this.blockSize
        return data
    }

}

export default class Core {

    constructor() {
        this._state = new State();
        this._navigationRef = React.createRef();
        this.api = new ApiClient();
        this.zeroconf = new Zeroconf()

        this.zeroconf.on('start', () => console.log('[discovery]: started.'))
        this.zeroconf.on('found', (s) => console.log('[discovery] found: ' + s))
        this.zeroconf.on('error', (e) => console.log('[discovery] error: ' + e))

        function findIPv4Addresses(addresses) {
            return addresses.filter(a => {
                return a.split('.').length == 4
            })
        }

        this.zeroconf.on('resolved', (s) => {
            console.log('[discovery] resolved: ' + JSON.stringify(s, null, 2))
            let { addresses, port } = s
            let ip4Address = findIPv4Addresses(addresses)

            this.updateLockboxHosts(ip4Address)
        })

        this.zeroconf.on('remove', (s) => {
            console.log('[discovery] removed: ' + s)
            this._state.lockboxHosts = [
                {
                    name: 'Alex\'s Lockbox',
                    address: '192.168.1.3'
                },
                {
                    name: 'Maks\'s Lockbox',
                    address: '192.168.1.7'
                },
            ];
        })
    }

    get state() {
        return this._state;
    }

    get navigationRef() {
        return this._navigationRef;
    }

    navigate(name, params) {
        this.navigationRef.current?.navigate(name, params);
    }

    goBack() {
        this.navigationRef.current?.goBack();
    }

    async setHost(host) {
        this.state.lockboxHost = host;
        this.api.setHost(host);
    }

    async signIn(email, password) {
        let result = await this.api.login(email, password)
        console.log('authenticated ' + result.success)
        this.state.authenticated = result.success
        this.state.authErrorMsg = result.message
        this.state.accId = result.success ? result.data.id : null
    }

    async signUp(email, password) {
        if (email == null || email == '') {
            this.state.authenticated = false
            this.state.authErrorMsg = 'Email is required'
            return
        }
        if (email == null || email == '') {
            this.state.authenticated = false
            this.state.authErrorMsg = 'Password is required'
            return
        }
        let result = await this.api.signup(email, password)
        this.state.authenticated = result.success
        this.state.authErrorMsg = result.message
        this.state.accId = result.success ? result.data.id : null
    }

    async signOut() {
        this.state.authenticated = false
        this.state.memories = null
        this.state.memory = null
        this.state.editingMemory = null
        this.state.tags = null
        this.state.authErrorMsg = null
        this.state.accId = null
    }

    async cahngePassword(oldPassword, newPassword) {
        let result = await this.api.cahngePassword(oldPassword, newPassword)
        this.state.authErrorMsg = result.message
    }

    async resetLockbox() {
        let result = await this.api.resetLockbox()
        this.state.authErrorMsg = result.message
    }

    async loadMemories() {
        this.state.memories = null;
        await this.timeout(1000)
        this.state.memories = await this.api.loadMemories();
    }

    async loadTags() {
        this.state.tags = await this.api.loadTags();
    }

    async loadTagsIfNeeded() {
        if (this.state.tags == null) {
            this.state.tags = await this.api.loadTags();
        }
    }

    async saveTag(tag) {
        console.log(`save tag: ${tag} - START`)
        tag = await this.api.saveTag(tag)
        console.log(tag)
        await this.loadTags()
        this.goBack()
        console.log(`save tag: ${tag} - END`)
    }

    async deleteTag(tag) {
        console.log(`delete tag: ${tag} - START`)
        tag = await this.api.deleteTag(tag.id)
        console.log(tag)
        await this.loadTags()
        this.goBack()
        console.log(`delete tag: ${tag} - END`)
    }

    getTagsMap() {
        let tags = this.state.tags || []
        let tagsMap = {}

        tags.forEach((tag) => {
            tagsMap[tag.id] = tag
        })

        return tagsMap
    }

    async loadMemory(id) {
        this.state.memory = await this.api.loadMemory(id);
        console.log('load memory id: ' + id + ' ' + JSON.stringify(this.state.memory, null, 2))
        return this.state.memory
    }

    async deleteMemory() {
        let id = this.state.editingMemory.id
        if (id) {
            this.api.deleteMemory(id)
            await this.loadMemories()
            this.navigate('MemoriesList')
        }
    }

    async startMemoryEdit(id) {
        console.log('start memory editor id: ' + id)
        this.state.editingMemory = null
        this.state.editingMemory = await this.api.loadMemory(id);
        //console.log('editing item: ' + JSON.stringify(this.state.memory, null, 2))
    }

    startMemoryAdd() {
        console.log('start memory add')
        this.state.editingMemory = { items: [], tags: [], eventDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSZ') }
        // console.log('editing item: ' + JSON.stringify(this.state.memory, null, 2))
    }

    async saveMemory() {
        let memory = this.state.editingMemory;

        console.log('save items count: ' + memory.items.length)
        //console.log('save items' + JSON.stringify(memory.items, null, 2))

        let existedItems = memory.items.filter(item => !item.base64)
        let newItems = memory.items.filter(item => item.base64)
        console.log(existedItems)

        let toSave = { ...memory, items: existedItems }
        let response = await this.api.saveMemory(toSave)
        if (!response.success) {
            console.log('error: ' + response.message)
            return
        }
        let addedMemory = response.data
        console.log(addedMemory)
        let id = response.data.id
        for (item of newItems) {
            let data = Buffer.from(item.base64, 'base64')
            let response = await this.api.addMemoryItem(id, 'PICTURE', data)
            console.log('added item: ' + JSON.stringify(response, null, 2))
            let addedItem = response.data
            addedMemory.items.push(addedItem)
        }
        await this.loadMemories()
        await this.loadMemory(addedMemory.id)
        this.goBack();
        // this.navigate('Memory', {id: addedMemory.id});
    }

    createReactImageSource(fileItem) {
        return fileItem.base64 ? { uri: ('data:image/jpeg;base64,' + fileItem.base64) } : this.api.createReactImageSource(fileItem.fileId);
    }

    createReactVideoSource(fileItem) {
        return this.api.createReactVideoSource(fileItem.fileId)
    }

    createThumbSource(fileItem) {
        return this.api.createThumbSource(fileItem.fileId)
    }

    createReactSource(fileItem) {
        if (fileItem.type == 'PICTURE') {
            return this.createReactImageSource(fileItem)
        }
        if (fileItem.type == 'VIDEO') {
            return this.createReactVideoSource(fileItem)
        }
        return null
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async uploadImage(base64) {
        let filedata = Buffer.from(base64, 'base64')
        let response = await this.api.uploadFile('PICTURE', filedata)
        if (response.success) {
            console.log('core: [uploadImage]: ' + JSON.stringify(response.data, null, 2))
            return response.data
        } else {
            console.log('core: [uploadImage]: ' + response.message)
            return null
        }
    }

    async uploadVideo(path, chunkSize, callback) {
        console.log(`Upload File from ${path}`)
        let reader = new FileReader(path, chunkSize)
        await reader.open()
        let chunks = reader.chunks

        // console.log('props: ' + JSON.stringify(this.props.item, null, 2))
        //let id = this.props.item.id
        console.log(`path: ${path} chunks: ${chunks}`)
        let response = await core.api.createUpload(chunks)
        if (response == null) {
            return
        }
        // console.log('response: ' + JSON.stringify(response, null, 2))
        let { data } = response
        console.log('upload created ok: ' + JSON.stringify(data, null, 2))

        let uploadId = data.id

        let chunkNo = 0
        while (true) {
            let chunk = await reader.read()
            if (chunk == null) {
                break
            }
            let data = Buffer.from(chunk, 'base64')
            console.log(`chunk: ${chunkNo}/${chunks} data length: ${data.length}`)
            let res = await this.api.uploadChunk(uploadId, chunkNo, data)
            chunkNo += 1
            callback(chunkNo / chunks)
        }
        console.log('upload done')
        return uploadId
    }

    async waitVideoReady(uploadId) {
        let count = 10;
        let fileId = null
        while (count > 0) {
            let response = await this.api.checkUploadStatus(uploadId)
            let { status } = response
            console.log('upload status: ' + status)
            if (status == 'STORED') {
                console.log('status response: ' + JSON.stringify(response, null, 2))
                fileId = response.fileId
                break
            }
            await wait(1000)
            // console.log('')
            count--
        }
        console.log('waiting finished: fileId: ' + fileId)
        return fileId
    }

    initDiscovery() {
        // if (this.state.discoveryStarted == true) {
        //     return
        // }
        this.state.discoveryStarted = true
        this.zeroconf.scan(type = 'lockbox', protocol = 'tcp', domain = 'local.')

        this.state.discoveryStarted = false
    }

    async updateLockboxHosts(ip4Address) {
        for (address of ip4Address) {
            try {
                let info = await this.api.getInfo(address)

                if (info == null || info.success != true) {
                    continue
                }
                
                let prevHosts = toJS(this.state.lockboxHosts).filter(h => h.address != address)

                this.state.lockboxHosts = [
                    ...prevHosts,
                    {
                        name: info.data.name,
                        address
                    },
                ]
                break
            } catch (e) {
                console.log(e)
            }
        }
    }

    async loadDeviceInfo() {
        let info = await this.api.getInfo()
        this.state.deviceInfo = info.data
    }

    async loadAccounts() {
        let accounts = await this.api.loadAccounts()
        this.state.accounts = accounts
    }

    // discover() {
    //     if(zeroconf == null) {
    //         console.log('setup zeroconf')
    //         zeroconf = new Zeroconf()
    //         zeroconf.on('start', () => {
    //             console.log('zeroconf: scan started')
    //             this.state.lockboxHosts = []
    //         })
    //         zeroconf.on('found', (device) => {
    //             // console.log('zeroconf: service found: ' + JSON.stringify(device))
    //         })
    //         zeroconf.on('stop', () => {
    //             // this.setState({ isScanning: false })
    //             console.log('zeroconf: stopped')
    //         })
    //         zeroconf.on('resolved', (device) => {
    //             if(!device) {
    //                 console.log('zeroconf: device resolved without any data')
    //                 return
    //             }
    //             let ip = device.addresses[0];
    //             let port = device.port
    //             let info = device.txt
    //             // console.log('zeroconf: device resolved: ' + JSON.stringify(device, null, 2))
    //             console.log(`zeroconf: device resolved: ${ip}:${port} ${JSON.stringify(info)}`)
    //             if (ip) {
    //                 this.state.lockboxHosts = [...this.state.lockboxHosts.toJS(), ip];
    //             }
    //         })
    //         zeroconf.on('error', err => {
    //             // this.setState({ isScanning: false })
    //             console.log('zeroconf [error]: ' + JSON.stringify(err))
    //         })
    //     }
    //     // zeroconf.stop()
    //     // zeroconf.removeDeviceListeners()
    //     // zeroconf.addDeviceListeners()

    //     zeroconf.scan(type = 'lockbox', protocol = 'tcp', domain = 'local.')
    // }

}
