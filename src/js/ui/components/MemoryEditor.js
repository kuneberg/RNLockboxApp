import * as React from 'react';
import { View, Text, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import Styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageCropPicker from 'react-native-image-crop-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment'
import FormTextInput from './FormTextImput';
import IconButton from './IconButton';
import { observer } from 'mobx-react';
import core from '../../core';

import * as Progress from 'react-native-progress';

import Tag from './Tag';

import SquareButton from './SquareButton';


const style = {
    scroll: {
    },
    scrollSubview: {
        // height: 200,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'nowrap'
    },
    tags: {
        header: {
            row: {
                style: {

                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                    paddingBottom: 10
                }
            },
            text: {
                style: {
                    color: Styles.textColor,
                    fontSize: 18
                }
            }
        },
        style: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            marginLeft: 22,
            marginRight: 22
        }
    },

    editTagsButton: {
        view: {
            style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'rgb(115, 115, 118)',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                padding: 10,
                marginTop: 20
            }
        },
        text: {
            style: {
                color: Styles.primaryColor,
                fontSize: 24,
            }

        }
    },

    deleteButton: {
        style: {
            backgroundColor: "#ff3333",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 80
        }
    }
}

@observer
export default class MemoryEditor extends React.Component {

    state = {
        uploading: false,
        progress: 0,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    async onRemovePress(index) {
        let items = this.props.item.items.filter((v, i) => i != index)
        this.props.item.items = items
    }

    onPress(item) {
        if (this.props.onPress) {
            this.props.onPress(item);
        }
    }

    async onAddPhotoPress() {
        console.log(`opening image picker`)
        let image = await ImageCropPicker.openPicker({
            mediaType: 'photo',
            width: 1000,
            height: 1000,
            multiple: false,
            includeBase64: true,
            forceJpg: true
        })
        let base64 = image.data
        await this.props.onAddPhoto(base64)
    }

    async onAddVideoPress() {
        let video = await ImageCropPicker.openPicker({ mediaType: 'video' })
        console.log('video: ' + JSON.stringify(video, null, 2))
        let videoPath = video.path
        if (videoPath.startsWith('file://')) {
            videoPath = videoPath.substring(7)
        }
        await this.props.onAddVideo(videoPath)
    }

    onDeletePress() {
        this.props.onDelete()
    }

    play(id, item) {
        core.navigate('Video', { id, item })
    }

    renderLoadingItemThumb(carouselItem, itemHeight, memoryItem) {
        return <View style={{
            borderColor: 'rgb(115, 115, 118)',
            borderWidth: 1,
            borderRadius: 12,
            margin: 10,
            height: 190,
            width: 200,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
        }}>
            <ActivityIndicator size="large" />
            <Progress.Bar progress={memoryItem.progress} width={100} />
        </View>
    }


    renderImageItemThumb(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createReactImageSource(item)
        console.log('image source: ' + JSON.stringify(source, null, 2))
        return <ImageBackground key={item.fileId} style={{
            ...Styles.theme.memoryEditor.image,
            height: itemHeight,
            width: itemHeight,
            resizeMode: 'stretch',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            margin: 10,
            padding: 5
        }} imageStyle={{ borderRadius: 12, resizeMode: 'stretch', }} source={source}>
            <IconButton
                style={{
                    borderRadius: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                }}
                iconName={"remove"}
                onPress={() => this.onRemovePress(carouselItem.index)} />
        </ImageBackground>
    }

    renderVideoItemThumb(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createThumbSource(item)
        console.log('video source: ' + JSON.stringify(source, null, 2))
        return <ImageBackground key={item.fileId} style={{
            ...Styles.theme.memoryEditor.image,
            height: itemHeight,
            width: itemHeight,
            resizeMode: 'stretch',
            // flexDirection: 'row',
            // justifyContent: 'flex-end',
            margin: 10,
            padding: 5,
            backgroundColor: 'gray'
        }} imageStyle={{ borderRadius: 12, resizeMode: 'stretch', }} source={source}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Icon style={{ alignSelf: 'center' }} name={'video-camera'} size={64} color={'#aaa'}
                    onPress={() => this.play(memoryItem.id, item)}
                />
                <IconButton
                    style={{
                        position: 'absolute', right: 0, top: 0,
                        borderRadius: 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)'
                    }}
                    iconName={"remove"}
                    onPress={() => this.onRemovePress(carouselItem.index)}
                />
            </View>
        </ImageBackground>
    }

    renderOtherItemThumb(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createReactSource(item)
        // console.log('image source: ' + JSON.stringify(source, null, 2))
        return <ImageBackground key={item.fileId} style={{
            ...Styles.theme.memoryEditor.image,
            height: itemHeight,
            width: itemHeight,
            resizeMode: 'stretch',
            flexDirection: 'row',
            // justifyContent: 'flex-end',
            margin: 10,
            padding: 5
        }} imageStyle={{ borderRadius: 12, resizeMode: 'stretch', }} source={source}>
            <IconButton
                style={{
                    position: 'absolute', right: 0, top: 0,
                    borderRadius: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                }}
                iconName={"remove"}
                onPress={() => this.onRemovePress(carouselItem.index)} />
        </ImageBackground>
    }

    renderAddButton() {
        return <TouchableOpacity key='add-image' onPress={() => this.onAddPhotoPress()}>
            <View style={{
                borderColor: 'rgb(115, 115, 118)',
                borderWidth: 1,
                borderRadius: 12,
                margin: 10,
                height: 190,
                width: 100,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center'
            }}>
                <Icon name={'camera'} size={36} color={'rgb(115, 115, 118)'} />
            </View>
        </TouchableOpacity>
    }

    renderAddVideoButton() {
        return <TouchableOpacity key='add-video' onPress={() => this.onAddVideoPress()}>
            <View style={{
                borderColor: 'rgb(115, 115, 118)',
                borderWidth: 1,
                borderRadius: 12,
                margin: 10,
                height: 190,
                width: 100,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center'
            }}>
                <Icon name={'video-camera'} size={36} color={'rgb(115, 115, 118)'} />
            </View>
        </TouchableOpacity>
    }

    renderItems(memoryItem) {
        let childs = []
        childs.push(this.renderAddButton())
        childs.push(this.renderAddVideoButton())
        // console.log('render memory items: ' + JSON.stringify(memoryItem.items, null, 2))
        let items = memoryItem.items ? memoryItem.items : []
        items.forEach((item, index) => {
            let ci = { item, index }
            if (item.type == 'LOADING') {
                childs.push(this.renderLoadingItemThumb(ci, 190, memoryItem))
            } if (item.type == 'PICTURE') {
                childs.push(this.renderImageItemThumb(ci, 190, memoryItem))
            } else if (item.type == 'VIDEO') {
                childs.push(this.renderVideoItemThumb(ci, 190, memoryItem))
            } else {
                childs.push(this.renderOtherItemThumb(ci, 190, memoryItem))
            }
        })

        return childs
    }

    renderTags(item, tags) {
        let itemTags = item.tags;
        if (itemTags == null) {
            itemTags = []
        }
        return itemTags
            .map(tagId => tags[tagId])
            .filter(tag => tag != null)
            .map(tag => (<Tag name={tag.name} color={tag.color}></Tag>))
    }

    onEditTagsPress() {
        this.props.onEditTagsPress()
    }

    onEditDatePress() {
        this.props.onEditDatePress()
    }

    renderProgress() {
        if (!this.state.uploading) {
            return null
        }
        return <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Progress.Bar progress={this.state.progress} width={200} />
        </View>
    }

    render() {
        let item = this.props.item
        let tags = this.props.tags
        console.log(item)
        let eventDate = moment(item.eventDate)
        return <ScrollView>
            <View style={Styles.theme.memoryEditor.view}>
                <FormTextInput
                    {...Styles.theme.memoryEditor.input.props}
                    style={Styles.theme.memoryEditor.input.style}
                    placeholder={"Caption"}
                    value={item.caption}
                    onChangeText={(caption) => item.caption = caption} />
                <FormTextInput
                    {...Styles.theme.memoryEditor.input.props}
                    style={{ ...Styles.theme.memoryEditor.input.style, height: 100 }}
                    value={item.description}
                    multiline={true}
                    placeholder={"Description"}
                    onChangeText={(description) => item.description = description} />
                <View style={style.tags.header.row.style}>
                    <Text style={style.tags.header.text.style}>Date: {eventDate.format('MMM DD YYYY hh:mm')}</Text>
                    <TouchableOpacity style={{ padding: 5 }} onPress={() => this.onEditDatePress()}>
                        <Icon name={"edit"} size={24} color={Styles.primaryColor} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={style.scroll} horizontal={true} scrollEnabled={true}>
                    <View style={style.scrollSubview}>
                        {this.renderItems(item)}
                    </View>
                </ScrollView>
                <View style={style.tags.header.row.style}>
                    <Text style={style.tags.header.text.style}>Tags:</Text>
                    <TouchableOpacity style={{ padding: 5 }} onPress={() => this.onEditTagsPress()}>
                        <Icon name={"edit"} size={24} color={Styles.primaryColor} />
                    </TouchableOpacity>
                </View>
                <View style={style.tags.style}>
                    {this.renderTags(item, tags)}
                </View>

                {item.id && <SquareButton title="Delete Memory" style={style.deleteButton.style} onPress={() => this.onDeletePress()}></SquareButton>}
                {this.renderProgress()}
            </View>
        </ScrollView>
    }
}
