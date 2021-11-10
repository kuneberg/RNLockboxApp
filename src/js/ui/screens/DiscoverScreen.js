import * as React from 'react';
import { View, Text, Button, FlatList, RefreshControl, SafeAreaView, SectionList } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import MemoriesListItem from '../components/MemoriesListItem';
import RoundIconButton from '../components/RoundIconButton';
import moment from 'moment'
import HostListItem from '../components/HostListItem';

const style = {
    safeArea: {
        style: {
            flex: 1
        }
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
    empty: {
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
                fontSize: 14,
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
export default class DiscoverScreen extends React.Component {

    componentDidMount() {
        core.initDiscovery()
    }

    // onDiscoverPress() {
    //     core.discover()
    // }

    onHostSelected(host) {
        core.setHost(host.address)
        core.navigate("SignIn");
    }

    renderHeader() {
        return (
            <View style={style.header.view.style}>
                <Text style={style.header.text.style}>{'Select device'}</Text>
            </View>
        )
    }

    renderEmpty() {
        return (
            <View style={style.empty.view.style}>
                <Text style={style.empty.text.style}>{'Searching for Lockboxes...'}</Text>
            </View>
        )
    }

    renderHost(host, index) {
        // console.log('host: ' + JSON.stringify(host,null,2))
        let first = index == 0
        return (
            <HostListItem host={host} first={first} onPress={(host) => {this.onHostSelected(host)}}/>
        )
    }

    onRefresh() {
        core.initDiscovery()
    }

    render() {
        let lockboxHosts = core.state.lockboxHosts
        if (!lockboxHosts) {
            return (<LoadingView></LoadingView>)
        }

        return (
            <SafeAreaView style={style.safeArea.style}>
                <FlatList
                    data={lockboxHosts}
                    renderItem={({ item, index }) => this.renderHost(item, index)}
                    ListHeaderComponent={() => this.renderHeader()}
                    ListEmptyComponent={() => this.renderEmpty()}
                    keyExtractor={item => item.address}
                    refreshControl={<RefreshControl
                        colors={style.refresh.colors}
                        title="Loading..."
                        tintColor={style.refresh.tintColor}
                        titleColor={style.refresh.titleColor}
                        refreshing={core.state.discoveryStarted}
                        onRefresh={() => this.onRefresh()} 
                    />}
                />
            </SafeAreaView>
        );
    }
}