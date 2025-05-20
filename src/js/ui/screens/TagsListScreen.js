import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import core from '../../core';
import LoadingView from '../components/LoadingView';
import TagsListItem from '../components/TagsListItem';
import Styles from '../styles';
// import ActionButton from 'react-native-action-button';
import FloatingActionButton from '../components/FloatingActionButton';



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
                alignItems: 'center',
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
                marginLeft: 10,
                color: Styles.textColor
            }

        }
    }

}

@observer
export default class TagsListScreen extends React.Component {

    componentDidMount() {
        core.loadTags()
    }

    onAddPress() {
        core.navigate('TagEdit', {});
    }

    onSharePress(tag) {
        core.navigate('TagShare', {tag: tag});
    }

    onEditPress(tag) {
        core.navigate('TagEdit', {tag: tag});
    }

    renderHeader() {
        return (
            <View style={style.header.view.style}>
                <Text style={style.header.text.style}>{'Tags'}</Text>
            </View>
        )
    }

    renderTag(tag, index) {
        let accountId = core.state.accId;
        let first = index == 0;
        return (
            <TagsListItem
                tag={tag} first={first}
                onSharePress={(tag) => this.onSharePress(tag)}
                onEditPress={(tag) => this.onEditPress(tag)}
                accountId={accountId}
            />
        )
    }

    render() {
        let tags = core.state.tags
        if (tags == null) {
            return (<LoadingView></LoadingView>)
        }

        return (
            <SafeAreaView style={style.safeArea.style}>
                <FlatList
                    data={tags}
                    renderItem={({ item, index }) => this.renderTag(item, index)}
                    ListHeaderComponent={() => <TagsListHeader/>}
                    ListFooterComponent={() => <TagsListFooter/>}
                    keyExtractor={item => item.id}
                />
                <FloatingActionButton onPress={() => this.onAddPress()} icon="add-outline"/>
            </SafeAreaView>
        );
    }
}


function TagsListHeader() {
    return (
        <View style={style.header.view.style}>
            <Text style={style.header.text.style}>{'Tags'}</Text>
        </View>
    )
}

function TagsListFooter() {
    return <View style={{height: 200}}></View>
}

