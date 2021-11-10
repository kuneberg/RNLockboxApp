import * as React from 'react';
import { View, Text, Button, Image, Dimensions, SafeAreaView, FlatList } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import MemoryEditor from '../components/MemoryEditor';
import LoadingView from '../components/LoadingView';
import { HeaderBackButton } from '@react-navigation/native-stack';
import ClearTextButton from '../components/ClearTextButton';

const style = {
    safeArea: {
        style: { flex: 1 }
    },
}

@observer
export default class MemoryEditorScreen extends React.Component {

    componentDidMount() {
        let { id, add } = this.props.route.params
        console.log(`EDIT ID: ${id} add: ${add}`)
        if (add) {
            core.startMemoryAdd()
        } else {
            core.startMemoryEdit(id)
        }
        this.props.navigation.setOptions({
            headerRight: () => this.renderHeaderRight(),
            headerBackTitle: 'Cancel',
        })
    }

    async onAddPress() {
        await core.saveMemory()
    }

    renderHeaderRight() {
        return <ClearTextButton onPress={() => this.onAddPress()} title="Save" />
    }

    async addPhoto(imageBase64) {
        let item = {type: "LOADING"}
        core.state.editingMemory.items = [item, ...core.state.editingMemory.items]
        item = core.state.editingMemory.items[0]        
        try {
            let data = await core.uploadImage(imageBase64)
            item.type = data.type
            item.fileId = data.id
            item.coordinates = null
        } catch (error) {
            console.log('error: ' + error)
        }
    }

    async addVideo(path) {
        let item = {type: "LOADING"}
        core.state.editingMemory.items = [item, ...core.state.editingMemory.items]
        item = core.state.editingMemory.items[0]

        try {
            const ChunkSize = 4096*32
            let uploadId = await core.uploadVideo(path, ChunkSize, (progress)=>{
                item.progress = progress
            })
            let fileId = await core.waitVideoReady(uploadId)

            item.type = 'VIDEO'
            item.fileId = fileId
            item.coordinates = null
        } catch (error) {
            console.log('error: ' + error)
        }
    }

    onEditTagsPress() {
        core.navigate('MemoryTagsEditor', {  });
    }

    onEditDatePress() {
        core.navigate('MemoryDateEditor', {  });
    }

    async onDeletePress() {
        await core.deleteMemory()
    }

    render() {
        if (core.state.editingMemory == null || core.state.tags == null) {
            return <LoadingView></LoadingView>
        }
        let tags = core.getTagsMap()
        return (
            <SafeAreaView style={style.safeArea.style}>
                <MemoryEditor item={core.state.editingMemory} 
                            tags={tags} 
                            onEditTagsPress={() => this.onEditTagsPress()} 
                            onEditDatePress={() => this.onEditDatePress()} 
                            onAddPhoto={(imageBase64) => this.addPhoto(imageBase64)} 
                            onAddVideo={async (path) => await this.addVideo(path)}
                            onDelete={() => this.onDeletePress()}
                            />
            </SafeAreaView>
        )
    }
}