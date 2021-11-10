import * as React from 'react';
import { View, Text, Button, FlatList, RefreshControl, SafeAreaView, SectionList } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import MemoriesListItem from '../components/MemoriesListItem';
import RoundIconButton from '../components/RoundIconButton';
import moment from 'moment'
import ActionButton from 'react-native-action-button';

const style = {
    safeArea: {
        style: { flex: 1 }
    },
    refresh: {
        tintColor: Styles.inactiveColor,
        titleColor: Styles.inactiveColor,
        colors: [
            Styles.inactiveColor
        ]
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
    section: {
        header: {
            style: {
                // fontSize: 20,
                fontWeight: "600",
                color: Styles.textColor
            }
        },
        view: {
            style: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flex: 1,
                // backgroundColor: Styles.bgColorTransparent,
                paddingTop: 10,
                paddingBottom: 10
            }
        },
        badge: {
            style: {
                backgroundColor: Styles.primaryColor,
                margin: 0,
                height: 30,
                width: 170,
                // borderRadius: 30/2,
                borderBottomRightRadius: 30 / 2,
                borderTopRightRadius: 30 / 2,
                paddingLeft: 10,
                paddingRight: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                    width: 4,
                    height: 0
                },
                shadowOpacity: 0.55,
                shadowRadius: 8
            }
        }
    }
}

@observer
export default class MemoriesListScreen extends React.Component {

    componentDidMount() {
        core.loadTags();
        core.loadMemories();
    }

    onAddPress() {
        core.navigate('MemoryEditor', { add: true });
    }

    async onClearPress() {
        console.log('clear')
        let memories = core.state.memories;
        for (memory of memories) {
            await core.api.deleteMemory(memory.id)
        }
        core.state.memories = []
    }

    onItemPress(item) {
        core.navigate('Memory', { id: item.id });
    }

    async onRefresh() {
        await core.loadTags()
        await core.loadMemories()
    }

    renderListItem(item, tagsMap) {
        let accId = core.state.accId
        return <MemoriesListItem item={item} tags={tagsMap} accId={accId} onPress={(item) => this.onItemPress(item)}></MemoriesListItem>
    }

    renderSectionHeader(data) {
        let section = data.section
        let title = section.title;
        return (
            <View style={style.section.view.style}>
                <View style={style.section.badge.style}>
                    <Text style={style.section.header.style}>{title}</Text>
                </View>
            </View>
        )
    }

    renderHeader() {
        return (
            <View style={style.header.view.style}>
                <Text style={style.header.text.style}>{'Memories'}</Text>
            </View>
        )
    }

    getSections() {
        let memories = core.state.memories;
        if (!memories) {
            return []
        }
        let reduced = memories.reduce((obj, memory) => {
            let d = moment(memory.eventDate)
            let year = d.year()
            let month = d.format('MMM')
            if (!obj[`${month} ${year}`]) {
                obj[`${month} ${year}`] = []
            }
            obj[`${month} ${year}`].push(memory)
            return obj
        }, {})

        let sections = []
        for (var key in reduced) {
            let section = {
                title: key,
                data: reduced[key]
            }
            sections.push(section)
        }
        return sections
    }

    render() {
        let tagsMap = core.getTagsMap()
        let sections = this.getSections()
        let refreshing = !sections

        console.log(`sections: + ${sections}`)
        return (
            <SafeAreaView style={style.safeArea.style}>
                <SectionList
                    refreshControl={<RefreshControl
                        colors={style.refresh.colors}
                        title="Loading..."
                        tintColor={style.refresh.tintColor}
                        titleColor={style.refresh.titleColor}
                        refreshing={refreshing}
                        onRefresh={() => this.onRefresh()}
                    />}
                    ListHeaderComponent={() => <MemoriesListHeader/>}
                    ListFooterComponent={() => <MemoriesListFooter/>}
                    sections={sections}
                    renderItem={({ item }) => this.renderListItem(item, tagsMap)}
                    keyExtractor={item => item.id}
                    renderSectionHeader={(data) => this.renderSectionHeader(data)}
                    stickySectionHeadersEnabled={true}
                >
                </SectionList>
                <ActionButton
                    buttonColor={Styles.primaryColor}
                    onPress={() => this.onAddPress()}
                />
            </SafeAreaView>
        );
    }
}

function MemoriesListHeader() {
    return (
        <View style={style.header.view.style}>
            <Text style={style.header.text.style}>{'Memories'}</Text>
        </View>
    )
}

function MemoriesListFooter() {
    return <View style={{height: 200}}></View>
}
