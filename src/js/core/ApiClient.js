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
            baseURL: ServerURL
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

        try {
            let response = await axios.get(`${host}/info/public`)
            let { data } = response
            if (!data.success) {
                this.log(`getInfo failed: ${data.message}`)
                return data
            }
            return data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async signup(email, password) {
        try {
            this.log('signup ' + email + ' / ' + password)
            let response = await this.api.post('/auth/register', {
                email: email,
                password: password,
            })
            let { data } = response
            if (!data.success) {
                this.log('signup failed: ' + data.message)
                return data
            }
            this.authToken = data.data.token
            return data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async login(email, password) {
        try {
            this.log('login ' + email + ' / ' + password)
            let response = await this.api.post('/auth/login', {
                email: email,
                password: password,
            })
            let { data } = response
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

    async changePassword(oldPassword, newPassword) {
        const headers = {
            'Authorization': this.authToken,
        }
        try {
            let response = await this.api.post('/auth/password', {oldPassword, newPassword}, { headers })
            let { data } = response
            this.log('save memory: ' + JSON.stringify(data, null, 2))
            if (!data.success) {
                this.log('something wrong: ' + data.message)
            }
            return data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async reset() {
        const headers = {
            'Authorization': this.authToken,
        }
        try {
            let response = await this.api.post('/auth/reset', {approve: true}, { headers })
            let { data } = response
            this.log('save memory: ' + JSON.stringify(data, null, 2))
            if (!data.success) {
                this.log('something wrong: ' + data.message)
            }
            return data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async loadMemories() {
        const headers = {
            'Authorization': this.authToken,
        }
        try {
            let response = await this.api.get('/memory', { headers })
            let { data } = response
            this.log('get memories: ' + JSON.stringify(data, null, 2))
            if (!data.success) {
                this.log('something wrong: ' + data.message)
                return null
            }
            return data.data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async saveMemory(memory) {
        const headers = {
            'Authorization': this.authToken,
        }
        memory.createdAt = moment().toISOString()
        memory.updatedAt = moment().toISOString()

        try {
            let response = await this.api.post('/memory', memory, { headers })
            let { data } = response
            this.log('save memory: ' + JSON.stringify(data, null, 2))
            if (!data.success) {
                this.log('something wrong: ' + data.message)
            }
            return data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async deleteMemory(id) {
        const headers = {
            'Authorization': this.authToken,
        }
        try {
            let response = await this.api.delete('/memory/' + id, { headers })
            if (response.success) {
                this.log(`delete memory: ${id} ok`)
            } else {
                this.log('delete memory: ' + JSON.stringify(response, null, 2))
                this.log(`delete memory: ${id} failed: ${response.message}`)
            }
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async loadMemory(id) {
        const headers = {
            'Authorization': this.authToken,
        }
        try {
            let response = await this.api.get(`/memory/${id}`, { headers })
            let { data } = response
            this.log('get memories: ' + JSON.stringify(data, null, 2))
            if (!data.success) {
                this.log('something wrong: ' + data.message)
                return null
            }
            return data.data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
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
            console.log(data)
            return data.data || []
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
        try {
            let response = await this.api.post(`/tags`, tag, { headers })
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

    async deleteTag(id) {
        const headers = {
            'Authorization': this.authToken,
        }
        try {
            let response = await this.api.delete(`/tags/${id}`, { headers })
            if (response.success) {
                this.log(`delete tag: ${id} ok`)
            } else {
                this.log('delete tag: ' + JSON.stringify(response, null, 2))
                this.log(`delete tag: ${id} failed: ${response.message}`)
            }
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async loadAccounts() {
        const headers = {
            'Authorization': this.authToken
        }
        try {
            let response = await this.api.get(`/accounts`, { headers })
            let { data } = response
            console.log(data)
            return data.data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    log(message) {
        console.log('API: ' + message)
    }

    async uploadFile(type, fileData) {
        this.log('[uploadFile]: type: ' + type)
        const headers = {
            'Authorization': this.authToken,
            'content-type': 'application/octet-stream',
        }
        try {
            let response = await this.api.post(`/files/${type}`, fileData, { headers })
            this.log('[uploadFile]: ' + JSON.stringify(response.data, null, 2))
            return response.data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async createUpload(chunks) {
        this.log('[createUpload]: chunks: ' + chunks)
        const headers = {
            'Authorization': this.authToken,
        }
        let body = {
            fileType: 'VIDEO',
            totalChunks: chunks,
        }
        try {
            let response = await this.api.post(`/files/upload`, body, {headers})
            let {data} = response
            if(!data.success) {
                this.log('[createUpload]: ' + data.message)
                return null
            }
            this.log('[createUpload]: return data: ' + JSON.stringify(data, null, 2))
            return data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async checkUploadStatus(uploadId) {
        this.log('[checkUploadStatus]: uploadId: ' + uploadId)
        const headers = {
            'Authorization': this.authToken,
        }
        let url = `/files/upload/${uploadId}`
        let response = await this.api.get(url, {headers})
        let {data} = response
        if(!data.success) {
            this.log('[checkUploadStatus]: error: ' + data.message)
            return null
        }
        this.log('[checkUploadStatus]: status: ' + JSON.stringify(data.data, null, 2))
        return data.data
    }

    async uploadChunk(uploadId, index, chunk) {
        this.log('[uploadChunk]: chunk: ' + index)
        const headers = {
            'Authorization': this.authToken,
            'content-type': 'application/octet-stream',
        }
        let url = `/files/upload/${uploadId}/${index}`
        try {
            let response = await this.api.post(url, chunk, { headers })
            let { data } = response
            if(!data.success) {
                this.log('[uploadChunk]: ' + data.message)
                return null
            }
            return data.data
        } catch (error) {
            if (!error.response) {
                throw new ApiUnavailableError(error);
            } else {
                console.log(error);
            }
        }
    }

    async closeLock() {
        const headers = {
            'Authorization': this.authToken
        }
        try {
            let response = await this.api.post(`/lock/lock`, {}, { headers })
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

    async openLock() {
        const headers = {
            'Authorization': this.authToken
        }
        try {
            let response = await this.api.post(`/lock/unlock`, {}, { headers })
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

    async getLockState() {
        const headers = {
            'Authorization': this.authToken
        }
        try {
            let response = await this.api.get(`/lock/state`, { headers })
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

    log(message) {
        console.log('API: ' + message)
    }
}
