import * as React from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'
import Tag from './Tag';
import core from '../../core';


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
            marginLeft: 22,
            fontSize: 16,
            fontWeight: "500",
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
            marginRight: 22,
            marginBottom: 20,
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

export default class MemoryView extends React.Component {

    constructor(props) {
        super(props);
    }

    onPress(item) {
        console.log('item press')
        if (this.props.onPress) {
            this.props.onPress(item);
        }
    }

    viewImage(item) {
        core.navigate('Image', { item })
    }

    viewVideo(item) {
        core.navigate('Video', { item })
    }

    renderImageItem(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createThumbSource(item)
        return <TouchableOpacity onPress={()=>this.viewImage(item)}><View key={item.fileId} style={style.imageFrame.style}>
            <Image style={style.image.style} source={source} />
        </View>
      </TouchableOpacity>
    }

    renderVideoItem(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createThumbSource(item)
        return <TouchableOpacity onPress={()=>this.viewVideo(item)}><View key={item.fileId} style={style.imageFrame.style}>
            <Image style={style.image.style} source={source} />
        </View>
      </TouchableOpacity>
    }

    renderUnknownItem(carouselItem, itemHeight, memoryItem) {
        let item = carouselItem.item;
        let source = core.createReactImageSource(item)
        return <View key={item.fileId} style={style.imageFrame.style}>
            <Image style={style.image.style} source={source} />
        </View>
    }

    renderItems(memoryItem) {
        let childs = [];
        let items = memoryItem.items ? memoryItem.items : []
        items.forEach((item, index) => {
            let ci = { item, index };
            if (item.type == 'PICTURE') {
                childs.push(this.renderImageItem(ci, 190, memoryItem))
            } else if (item.type == 'VIDEO') {
                childs.push(this.renderVideoItem(ci, 190, memoryItem))
            } else {
                childs.push(this.renderUnknownItem(ci, 190, memoryItem))
            }
        })

        return childs;
    }

    renderTags(item, tags) {
        if (item.tags == null) {
            return []
        }
        return item.tags
            .map(tagId => tags[tagId])
            .filter(tag => tag != null)
            .map(tag => (<Tag name={tag.name} color={tag.color}></Tag>))

    }

    render() {
        let item = this.props.item;
        let tags = this.props.tags;
        return <ScrollView>
            <View style={style.view.style}>
                <Text style={style.caption.style}>{item.caption}</Text>
                <View style={style.date.row.style}>
                    <Icon style={style.date.icon.style} name={'calendar'} size={style.date.icon.size} color={style.date.icon.color} />
                    <Text style={style.date.text.style}>{moment(item.eventDate).format('MMM DD YYYY hh:mm')}</Text>
                </View>
                <View style={style.tags.style}>
                    {this.renderTags(item, tags)}
                </View>
                <ScrollView style={style.scroll.style} horizontal={true} scrollEnabled={true}>
                    <View style={style.scrollSubview.style}>
                        {this.renderItems(item)}
                    </View>
                </ScrollView>

                <Text style={style.description.style}>
                    {item.description}
                </Text>

            </View>
        </ScrollView>
    }

    /*
watchman watch-del-all &&
rm -rf $TMPDIR/react-native-packager-cache-* &&
rm -rf $TMPDIR/metro-bundler-cache-* &&
rm -rf node_modules/
&& npm cache clean --force &&
npm install &&
npm start -- --reset-cache

    */
}
