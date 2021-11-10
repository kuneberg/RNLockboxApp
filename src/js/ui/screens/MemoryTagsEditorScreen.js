import * as React from 'react';
import { Text, SafeAreaView, TouchableOpacity, FlatList, Button } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import { HeaderBackButton } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingView from '../components/LoadingView';
import TagsListItem from '../components/TagsListItem';



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
                justifyContent:'space-between',
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
export default class MemoryTagsEditorScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            tags: []
        }
    }

    componentDidMount() {
        this.setState({
            tags: core.state?.editingMemory?.tags || []
        })
        this.props.navigation.setOptions({
            headerRight: () => this.renderHeaderRight(),
            headerBackTitle: 'Back',
        })
    }

    renderHeaderRight() {
        return <Button onPress={() => this.onOkPress()} title="OK" />
    }


    get memoryTags() {
        return this.state.tags
        
    }

    onOkPress() {
        let tags = this.state.tags
        core.state.editingMemory.tags = tags
        core.goBack()
    }

    isChecked(tag) {
        if (this.memoryTags == null) {
            return false
        }
        return this.memoryTags.indexOf(tag.id) >= 0
    }

    onTagPress(tag) {
        let tags = this.state.tags
        console.log(`selected tag: ${tag} from ${tags}`)

        let index = tags.indexOf(tag.id)
        if (index >= 0) {
            tags.splice(index, 1)
        } else {
            tags.push(tag.id)
        }

        this.setState({
            tags
        })
    }

    renderTag(tag, index) {
        let first = index == 0
        let checked = this.isChecked(tag)

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

        // return (
        //     <TagsListItem tag={tag} first={first} checked={checked} onPress={() => this.onTagPress(tag)}/>
        // )
    }

    render() {
        let memory = core.state.editingMemory
        console.log('render')
        console.log(memory.tags)
        let tags = core.state.tags
        if (tags == null) {
            return (<LoadingView></LoadingView>)
        }

        return (
            <SafeAreaView style={style.safeArea.style}>
                <FlatList
                    data={tags}
                    renderItem={({ item, index }) => this.renderTag(item, index)}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        );
    }
}