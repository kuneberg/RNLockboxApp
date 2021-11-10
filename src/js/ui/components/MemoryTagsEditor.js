import * as React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingView from './LoadingView';



const style = {
    safeArea: {
        style: {
            flex: 1
        }
    },
    header: {
        view: {
            style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                paddingTop: 50,
                paddingBottom: 30,
            }
        },
        text: {
            style: {
                fontSize: 36,
                fontWeight: "600",
                color: Styles.textColor
            }

        }
    },
    tag: {
        view: {
            style: {
                flexDirection: 'row',
                padding: 10,
                paddingLeft: 20
            }
        },
        icon: {
            size: 24,
            style: {
            }
        },
        text: {
            style: {
                marginLeft: 20,
                fontSize: 20,
                color: Styles.textColor
            }

        }
    }

}

@observer
export default class MemoryTagsEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    get memoryTags() {
        let tags = core.state.editingMemory.tags
        if (tags == null) {
            tags = []
            core.state.editingMemory.tags = tags
        }
        return tags
    }

    isChecked(tag) {
        if (this.memoryTags == null) {
            return false
        }
        
        return this.memoryTags.indexOf(tag.id) >= 0
    }

    onTagPress(tag) {
        let memory = core.state.editingMemory
        let index = this.memoryTags.indexOf(tag.id)
        if (index >= 0) {
            console.log('remove')
            memory.tags.splice(index, 1)
        } else {
            console.log('add')
            memory.tags.push(tag.id)
        }
        core.state.editingMemory = memory
    }

    renderTag(tag) {
        let icon = 'square'
        if (this.isChecked(tag)) {
            icon = 'check-square'
        }
        return (
            <TouchableOpacity style={style.tag.view.style} onPress={() => this.onTagPress(tag)}>
                <Icon style={style.tag.icon.style} name={icon} size={style.tag.icon.size} color={tag.color} />
                <Text style={style.tag.text.style}>{tag.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        console.log('render')
        let tags = core.state.tags
        if (tags == null) {
            return (<LoadingView></LoadingView>)
        }

        return (
            <FlatList
                data={tags}
                renderItem={({ item }) => this.renderTag(item)}
                keyExtractor={item => item.id}
            />
        );
    }
}