import axios from 'axios'
import moment from 'moment'

import TestData from "./TestData";
import ApiUnavailableError from "./ApiUnavailableError";

// const Host = '192.168.1.4'
const Host = '192.168.1.3'
// const Host = '192.168.1.7'

// const Host = 'api.uploadmymemories.com'

const Port = 8084

// export const Host = 'ec2-18-232-171-38.compute-1.amazonaws.com'
// const Host = 'api.uploadmymemories.com'
// const Port = 8084

export const ServerURL = `http://${Host}:${Port}`

export default class ApiClient {

    constructor() {
        this.baseURL = ServerURL
        this.api = axios.create({
            baseURL: ServerURL,
            // timeout: 1000,
            // headers: {'X-Custom-Header': 'foobar'}
        })
        this.authToken = null
    }

    setHost(host) {
        this.baseURL = `http://${host}:${Port}`
        this.api = axios.create({
            baseURL: this.baseURL,
            // timeout: 1000,
            // headers: {'X-Custom-Header': 'foobar'}
        })
        this.authToken = null
    }

    async getInfo(host) {
        host = host ? `http://${host}:${Port}` : this.baseURL
        this.log(`getInfo for host: ${host}`)

        let response = await axios.get(`${host}/info/public`)
        let { data } = response
        // this.log('signup: ' + JSON.stringify(data, null, 2))
        if (!data.success) {
            this.log(`getInfo failed: ${data.message}`)
            return data
        }
        // this.log('token: ' + this.authToken)
        return data
    }

    async signup(email, password) {
        this.log('signup ' + email + ' / ' + password)
        let response = await this.api.post('/auth/register', {
            email: email,
            password: password,
        })
        let { data } = response
        // this.log('signup: ' + JSON.stringify(data, null, 2))
        if (!data.success) {
            this.log('signup failed: ' + data.message)
            return data
        }
        this.authToken = data.data.token
        // this.log('token: ' + this.authToken)
        return data
    }

    async login(email, password) {
        try {
            this.log('login ' + email + ' / ' + password)
            let response = await this.api.post('/auth/login', {
                email: email,
                password: password,
            })
            let { data } = response
            // this.log('signup: ' + JSON.stringify(data, null, 2))
            if (!data.success) {
                this.log('login failed: ' + data.message)
                return data
            }
            this.authToken = data.data.token
            this.log('token: ' + this.authToken)
            return data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async logout() {
        this.log('logout')
        return true
    }

    async cahngePassword(oldPassword, newPassword) {
        const headers = {
            'Authorization': this.authToken,
        }

        let response = await this.api.post('/auth/password', {oldPassword, newPassword}, { headers })
        let { data } = response
        this.log('save memory: ' + JSON.stringify(data, null, 2))
        if (!data.success) {
            this.log('something wrong: ' + data.message)
        }
        return data
    }

    async resetLockbox() {
        const headers = {
            'Authorization': this.authToken,
        }

        let response = await this.api.post('/auth/reset', {approve: true}, { headers })
        let { data } = response
        this.log('save memory: ' + JSON.stringify(data, null, 2))
        if (!data.success) {
            this.log('something wrong: ' + data.message)
        }
        return data
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async loadMemories() {
        const headers = {
            'Authorization': this.authToken,
        }
        let response = await this.api.get('/memory', { headers })
        let { data } = response
        this.log('get memories: ' + JSON.stringify(data, null, 2))
        if (!data.success) {
            this.log('something wrong: ' + data.message)
            return null
        }
        return data.data
    }

    async saveMemory(memory) {
        const headers = {
            'Authorization': this.authToken,
        }
        memory.createdAt = moment().toISOString()
        memory.updatedAt = moment().toISOString()

        let response = await this.api.post('/memory', memory, { headers })
        let { data } = response
        this.log('save memory: ' + JSON.stringify(data, null, 2))
        if (!data.success) {
            this.log('something wrong: ' + data.message)
        }
        return data
    }

    async deleteMemory(id) {
        const headers = {
            'Authorization': this.authToken,
        }
        let response = await this.api.delete('/memory/' + id, { headers })
        if (response.success) {
            this.log(`delete memory: ${id} ok`)
        } else {
            this.log('delete memory: ' + JSON.stringify(response, null, 2))
            this.log(`delete memory: ${id} failed: ${response.message}`)
        }
    }



    async loadMemory(id) {
        const headers = {
            'Authorization': this.authToken,
        }
        let response = await this.api.get(`/memory/${id}`, { headers })
        let { data } = response
        this.log('get memories: ' + JSON.stringify(data, null, 2))
        if (!data.success) {
            this.log('something wrong: ' + data.message)
            return null
        }
        return data.data
    }

    createReactImageSource(fileId) {
        let url = `${this.baseURL}/files/${fileId}.jpg`
        let source = {
            uri: url,
            headers: {
                'Authorization': this.authToken,
            }
        }
        return source;
    }

    createReactVideoSource(fileId) {
        let url = `${this.baseURL}/files/${fileId}.mp4`
        let source = {
            uri: url,
            headers: {
                'Authorization': this.authToken,
                'Connection': 'keep-alive'
            }
        }
        return source;
    }

    createThumbSource(fileId) {
        let url = `${this.baseURL}/files/${fileId}/thumbnail.jpg`
        let source = {
            uri: url,
            headers: {
                'Authorization': this.authToken,
            }
        }
        return source;
    }

    async loadTags() {
        const headers = {
            'Authorization': this.authToken
        }
        try {
            let response = await this.api.get(`/tags`, { headers })
            let { data } = response
            return data.data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async saveTag(tag) {
        const headers = {
            'Authorization': this.authToken
        }
        let response = await this.api.post(`/tags`, tag, { headers })
        let { data } = response
        return data.data
    }

    async deleteTag(id) {
        const headers = {
            'Authorization': this.authToken,
        }
        let response = await this.api.delete(`/tags/${id}`, { headers })
        if (response.success) {
            this.log(`delete tag: ${id} ok`)
        } else {
            this.log('delete tag: ' + JSON.stringify(response, null, 2))
            this.log(`delete tag: ${id} failed: ${response.message}`)
        }
    }

    async loadAccounts() {
        const headers = {
            'Authorization': this.authToken
        }
        let response = await this.api.get(`/accounts`, { headers })
        let { data } = response
        console.log(data)
        return data.data
    }

    log(message) {
        console.log('API: ' + message)
    }

    // async loadItemData(id, item) {
    //     let { type, fileId } = item
    //     this.log(`load file ${id}/${type}/${fileId}`)
    //     const headers = {
    //         'Authorization': this.authToken,
    //         'accept': 'application/octet-stream',
    //     }
    //     let response = await this.api.get(`/memory/${id}/files/${type}/${fileId}`, { headers })
    //     console.log('RESPONSE: ' + JSON.stringify(response, null, 2))
    //     let { data } = response
    //     console.log('  data length: ' + data.length)
    //     return data
    // }

    //Authorization: Bearer: eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1ZWVhMTk4YTM2MzI1ODdmNjlmY2MyNTkiLCJleHAiOjE1OTM5NTkyNjR9.zdJ76yQI7PNckPcKSzM4mETIXj4EAxO4lcF2CryXddo1ZU8fad-Pyn2tMxA0R9k5svocgn8zrauTXi6E3zjwCw
    async uploadFile(type, fileData) {
        this.log('[uploadFile]: type: ' + type)
        const headers = {
            'Authorization': this.authToken,
            'content-type': 'application/octet-stream',
        }
        let response = await this.api.post(`/files/${type}`, fileData, { headers })
        //let { data } = response
        this.log('[uploadFile]: ' + JSON.stringify(response.data, null, 2))
        return response.data
    }

    async createUpload(chunks) {
        this.log('[createUpload]: chunks: ' + chunks)
        const headers = {
            'Authorization': this.authToken,
        }
        // this.log('create upload...')
        let body = {
            fileType: 'VIDEO',
            totalChunks: chunks,
        }
        let response = await this.api.post(`/files/upload`, body, {headers})
        let {data} = response
        // this.log('create upload data: ' + JSON.stringify(data, null, 2))
        if(!data.success) {
            this.log('[createUpload]: ' + data.message)
            return null
        }
        this.log('[createUpload]: return data: ' + JSON.stringify(data, null, 2))
        return data
    }

    // /memory/{id}/files/{type}/upload/{uploadId}
    async checkUploadStatus(uploadId) {
        this.log('[checkUploadStatus]: uploadId: ' + uploadId)
        const headers = {
            'Authorization': this.authToken,
        }
        // this.log('create upload...')
        let url = `/files/upload/${uploadId}`
        // this.log('[checkUploadStatus]: ' + url)
        let response = await this.api.get(url, {headers})
        let {data} = response
        // this.log('create upload data: ' + JSON.stringify(data, null, 2))
        if(!data.success) {
            this.log('[checkUploadStatus]: error: ' + data.message)
            return null
        }
        this.log('[checkUploadStatus]: status: ' + JSON.stringify(data.data, null, 2))
        return data.data
    }


    // /memory/{id}/files/{type}/upload/{uploadId}/{index}
    async uploadChunk(uploadId, index, chunk) {
        this.log('[uploadChunk]: chunk: ' + index)
        const headers = {
            'Authorization': this.authToken,
            'content-type': 'application/octet-stream',
        }
        let url = `/files/upload/${uploadId}/${index}`
        let response = await this.api.post(url, chunk, { headers })
        let { data } = response
        // this.log('chunk upload: ' + JSON.stringify(data, null, 2))
        if(!data.success) {
            this.log('[uploadChunk]: ' + data.message)
            return null
        }
        return data.data
    }

    log(message) {
        console.log('API: ' + message)
    }
}
