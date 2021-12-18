import * as React from 'react';
import { View, Text, Image, Dimensions, ImageBackground, ScrollView } from 'react-native';
import Styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import core from '../../core';
import { ServerURL } from '../../core/ApiClient';
import moment from 'moment'
import Tag from './Tag';

const style = {
    view: {
        style: {
            paddingRight: 0,
            paddingLeft: 0,
            paddingTop: 20,
            marginBottom: 20,
            shadowColor: "#3c3d3c",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            elevation: 7,
        }
    },
    caption: {
        style: {
            marginRight: 22,
            // marginLeft: 22,
            // fontSize: 16,
            fontWeight: "600",
            color: Styles.textColor
        }
    },
    date: {
        row: {
            style: {
                marginRight: 22,
                marginLeft: 22,
                flexDirection: 'row',
                marginTop: 5,
                marginBottom: 5,
            }
        },
        icon: {
            style: {
                marginRight: 6,
            },
            size: 12,
            color: Styles.primaryColor
        },
        text: {
            style: {
                fontSize: 12,
                color: Styles.inactiveColor
            }
        }
    },
    scroll: {
        style: {}
    },
    scrollSubview: {
        style: {
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'nowrap'
        }
    },
    image: {
        style: {
            height: 200,
            width: 300,
            borderRadius: 10
        }
    },
    imageFrame: {
        style: {
            height: 200,
            width: 300,
            marginRight: 5,
            marginLeft: 5,
            borderRadius: 10,
            shadowOffset: {
                width: 0,
                height: 0
            },
            shadowOpacity: 0.55,
            shadowRadius: 5
        }
    },
    tags: {
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
    description: {
        style: {
            paddingLeft: 20,
            paddingRight: 20,
            color: Styles.textColor
        }
    }
}

export default class MemoriesListItem extends React.Component {

    constructor(props) {
        super(props);
        const windowWidth = Dimensions.get('window').width;
        this.state = {
            activeIndex: 0,
            windowWidth
        }
    }

    onPress(item) {
        console.log('item press')
        if (this.props.onPress) {
            this.props.onPress(item);
        }
    }

    play(id, item) {
        console.log('play: ' + id + ' ' + JSON.stringify(item))
        core.navigate('Video', { id, item })
    }

    renderImageItem(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createThumbSource(item)
        // console.log('KEY: ' + item.id)
        return <View key={`thumb-${memoryItem.id}-${item.fileId}`} style={style.imageFrame.style}>
            <Image style={style.image.style} source={source} />
        </View>
    }

    renderVideoItem(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createThumbSource(item)
        // console.log('KEY: ' + item.id)
        return <View key={`thumb-${memoryItem.id}-${item.fileId}`} style={[style.imageFrame.style, { flex: 1, justifyContent: 'center', backgroundColor: 'gray' }]}>
            <Image style={style.image.style} source={source} />
        </View>
    }

    renderUnknownItem(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createThumbSource(item)
        return <View key={`thumb-${memoryItem.id}-${item.fileId}`} style={style.imageFrame.style}>
            <Image style={style.image.style} source={source} />
        </View>
    }

    renderItems(memoryItem) {
        let childs = [];
        let items = memoryItem.items ? memoryItem.items : []
        items.forEach((item, index) => {
            let ci = { item, index };
            let thumbnail = null;
            if (item.type == 'PICTURE') {
                thumbnail = this.renderImageItem(ci, 190, memoryItem)
            } else if (item.type == 'VIDEO') {
                thumbnail = this.renderVideoItem(ci, 190, memoryItem);
            } else {
                thumbnail = this.renderUnknownItem(ci, 190, memoryItem);
            }

            childs.push(
                    <TouchableOpacity key={`thumb-${memoryItem.id}-${item.fileId}`} onPress={() => this.onPress(memoryItem)}>
                        {thumbnail}
                    </TouchableOpacity>
                )
        })
        return childs;
    }

    renderTags(item, tags) {
        let itemTags = item.tags ? item.tags : []
        return itemTags
            .map(tagId => tags[tagId])
            .filter(tag => tag != null)
            .map(tag => (<Tag key={tag.id} name={tag.name} color={tag.color}></Tag>))

    }

    render() {
        let accId = this.props.accId
        let item = this.props.item;
        let tags = this.props.tags;


        let isMine = accId == item.ownerId

        return <View style={style.view.style}>
            <TouchableOpacity onPress={() => this.onPress(item)}>
                <View style={style.date.row.style}>
                    {!isMine && <Icon style={style.date.icon.style} name={'share-alt'} size={style.date.icon.size} color={style.date.icon.color} />}
                    <Text style={style.caption.style}>{item.caption}</Text>
                </View>
                <View style={style.date.row.style}>
                    <Icon style={style.date.icon.style} name={'calendar'} size={style.date.icon.size} color={style.date.icon.color} />
                    <Text style={style.date.text.style}>{moment(item.eventDate).format('MMM DD YYYY HH:mm')}</Text>
                </View>
                <View style={style.tags.style}>
                    {this.renderTags(item, tags)}
                </View>
                <ScrollView style={style.scroll.style} horizontal={true} scrollEnabled={true}>
                    <View style={style.scrollSubview.style}>
                        {this.renderItems(item)}
                    </View>
                </ScrollView>

                <Text numberOfLines={4} ellipsizeMode='tail' style={style.description.style}>
                    {item.description}
                </Text>
            </TouchableOpacity>
        </View>
    }
}
