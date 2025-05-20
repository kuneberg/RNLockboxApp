import { Buffer } from 'buffer';
import * as React from 'react';
import ApiClient from './ApiClient';
import State from "./State";

import { toJS } from 'mobx';
import moment from 'moment';
import Zeroconf from 'react-native-zeroconf';
import ApiUnavailableError from "./ApiUnavailableError";

// const
// /Users/maks/Library/Android/sdk
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
                    name: 'Cloud version (Beta)',
                    address: '192.168.68.71',
                    info: {
                           supportsLock: false
                        }
                },
                {
                    name: 'Cloud version (AWS)',
                    address: 'api.memoresse.com',
                    port: 443,
                    protocol: 'https',
                    info: {
                           supportsLock: false
                        }
                },
                // {
                //     name: 'Maks\'s Lockbox',
                //     address: '192.168.1.7'
                // },
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
        this.navigationRef.current?.navigate(name, params)
    }

    navigateReset(name, params) {
        this.navigationRef.current?.reset({
            index: 1,
            routes: [
                {
                    name, params
                }
            ]
        })
    }

    goBack() {
        this.navigationRef.current?.goBack();
    }

    async setHost(host) {
        console.log('host: ' + host.address)
        this.state.lockboxHost = host.address;
        this.state.supportsLock = host.info.supportsLock
        this.api.setHost(host.address, host.protocol, host.port);
    }

    async signIn(email, password) {
        try {
            let result = await this.api.login(email, password);
            let succeeded = result.success;
            this.state.authenticated = succeeded;
            console.log('authenticated ' + succeeded);
            if (succeeded) {
                this.state.accId = result.data.id;
                this.navigateReset('Home');
            } else {
                this.state.accId = null;
                this.state.authErrorMsg = result.message;
            }

        } catch (e) {
            if ( e instanceof ApiUnavailableError ) {
                this.navigateReset('ApiUnavailable');
            } else {
                console.log(e);
            }
        }
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
        try {
            let result = await this.api.signup(email, password)
            this.state.authenticated = result.success
            this.state.authErrorMsg = result.message
            this.state.accId = result.success ? result.data.id : null
            this.navigateReset('Home')
        } catch (e) {
            this.navigateReset('ApiUnavailable')
        }

    }

    async signOut() {
        this.state.authenticated = false
        this.state.memories = null
        this.state.memory = null
        this.state.editingMemory = null
        this.state.tags = null
        this.state.authErrorMsg = null
        this.state.accId = null
        this.navigateReset('Discover')
    }

    async changePassword(oldPassword, newPassword) {
        try {
            let result = await this.api.changePassword(oldPassword, newPassword);
            this.state.authErrorMsg = result.message;
        } catch (e) {
            this.navigate('ApiUnavailable');
        }
    }

    async reset() {
        try {
            let result = await this.api.reset();
            this.state.authErrorMsg = result.message;
        } catch (e) {
            this.navigate('ApiUnavailable');
        }
    }

    async loadMemories() {
        try {
            await this._loadMemories();
        } catch (e) {
            this.navigate('ApiUnavailable');
        }
    }

    async _loadMemories() {
        this.state.memories = null;
        this.state.memories = await this.api.loadMemories();
    }

    async loadTags() {
        try {
            await this._loadTags();
        } catch (e) {
            this.navigate('ApiUnavailable');
        }
    }

    async _loadTags() {
        this.state.tags = await this.api.loadTags();
        console.log('Tags loaded')
        console.log(this.state.tags)
    }

    async loadTagsIfNeeded() {
        try {
            if (this.state.tags == null) {
                await this._loadTags();
            }
        } catch (e) {
            this.navigate('ApiUnavailable');
        }
    }

    async saveTag(tag) {
        try {
            await this._saveTag(tag);
            await this._loadTags();
            this.goBack();
        } catch (e) {
            this.navigate('ApiUnavailable');
        }
    }

    async _saveTag(tag) {
        await this.api.saveTag(tag);
    }

    async deleteTag(tag) {
        try {
            await this._deleteTag(tag);
            await this._loadTags();
            this.goBack();
        } catch (e) {
            this.navigate('ApiUnavailable');
        }
    }

    async _deleteTag(tag) {
        await this.api.deleteTag(tag.id);
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
        try {
            return await this._loadMemory(id);
        } catch (e) {
            this.navigateReset('ApiUnavailable')
        }
    }

    async _loadMemory(id) {
        this.state.memory = await this.api.loadMemory(id);
        console.log('load memory id: ' + id + ' ' + JSON.stringify(this.state.memory, null, 2))
        return this.state.memory
    }

    async deleteMemory() {
        try {
            let id = this.state.editingMemory.id;
            if (id) {
                await this._deleteMemory(id);
                await this._loadMemories();
                this.navigateReset('Home');
            }
        } catch (e) {
            this.navigateReset('ApiUnavailable');
        }
    }

    async _deleteMemory(id) {
        await this.api.deleteMemory(id)
    }

    async startMemoryEdit(id) {
        try {
            console.log('start memory editor id: ' + id)
            this.state.editingMemory = null
            this.state.editingMemory = await this._loadMemory(id)
        } catch (e) {
            this.navigateReset('ApiUnavailable')
        }

    }

    startMemoryAdd() {
        console.log('start memory add')
        this.state.editingMemory = { items: [], tags: [], eventDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSZ') }
    }

    async saveMemory() {
        try {
            let memory = this.state.editingMemory;
            console.log('save items count: ' + memory.items.length)
            let response = await this.api.saveMemory(memory)
            if (!response.success) {
                console.log('error: ' + response.message)
                return
            }
            let addedMemory = response.data
            await this._loadMemories()
            await this._loadMemory(addedMemory.id)
            this.goBack();
        } catch (e) {
            this.navigateReset('ApiUnavailable');
        }
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

    async addMediaItems(mediaItems) {
        this.state.mediaItemUploadInProgress = true;
        for (const mediaItem of mediaItems) {
            await this.addMediaItem(mediaItem);
        }
        this.state.mediaItemUploadInProgress = false;
    }

    async addMediaItem(mediaItem) {
        let item = {type: "LOADING"};
        this.state.editingMemory.items = [item, ...this.state.editingMemory.items];
        item = this.state.editingMemory.items[0];

        try {
            if (mediaItem.mediaType.startsWith("video")) {
                if (mediaItem.videoPath.startsWith('file://')) {
                    mediaItem.videoPath = mediaItem.videoPath.substring(7)
                }

                await this.addVideo(mediaItem.videoPath, item);
            } else if (mediaItem.mediaType.startsWith('image')) {
                await this.addImage(mediaItem.imageData, item);
            } else {
                throw new Error("Unsupported media type")
            }
        } catch (e) {
            if ( e instanceof ApiUnavailableError ) {
                this.navigateReset('ApiUnavailable');
            } else {
                console.log(e);
            }
        }
    }

    async addImage(imageBase64, item) {
        let data = await this.uploadImage(imageBase64)
        item.progress = 1;
        item.type = data.type
        item.fileId = data.id
        item.coordinates = null
    }

    async addVideo(path, item) {
        const ChunkSize = 4096*32
        let uploadId = await this.uploadVideo(path, ChunkSize, (progress)=>{
            item.progress = progress
        })
        let fileId = await this.waitVideoReady(uploadId)

        item.type = 'VIDEO'
        item.fileId = fileId
        item.coordinates = null
    }

    async uploadImage(base64) {
        let fileData = Buffer.from(base64, 'base64')
        let response = await this.api.uploadFile('PICTURE', fileData)
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

        console.log(`path: ${path} chunks: ${chunks}`)
        let response = await this.api.createUpload(chunks)
        if (response == null) {
            return
        }

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
            count--
        }
        console.log('waiting finished: fileId: ' + fileId)
        return fileId
    }

    initDiscovery() {
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

                console.log('Host info:')
                console.log(info)
                this.state.lockboxHosts = [
                    ...prevHosts,
                    {
                        name: info.data.name,
                        address,
                        protocol: 'http',
                        port: 8084,
                        info: info.data
                    },
                ]
                break
            } catch (e) {
                console.log(e)
            }
        }
    }

    async loadDeviceInfo() {
        try {
            let info = await this.api.getInfo();
            this.state.deviceInfo = info.data;
        } catch (e) {
            this.navigateReset('ApiUnavailable')
        }
    }

    async loadAccounts() {
        try {
            this.state.accounts = await this.api.loadAccounts();
        } catch (e) {
            this.navigateReset('ApiUnavailable')
        }
    }

    async initLockState() {
        this.state.lockInProgress = true
        let newLockState = await this.api.getLockState()
        this.state.lockOpened = !newLockState.locked
        this.state.lockInProgress = false
    }

    async toggleLock() {
        this.state.lockInProgress = true
        let currentLockState = await this.api.getLockState()
        if (currentLockState.locked) {
            await this.api.openLock()
        } else {
            await this.api.closeLock()
        }

        let newLockState = await this.api.getLockState()
        this.state.lockOpened = !newLockState.locked
        this.state.lockInProgress = false
    }

    goError(errorMsg) {
        this.navigate("Error", { errorMsg: errorMsg })
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
