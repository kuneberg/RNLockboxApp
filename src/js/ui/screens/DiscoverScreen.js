import * as React from 'react';
import { View, Text, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import HostListItem from '../components/HostListItem';
// import ActionButton from "react-native-action-button";
import ClearTextButton from '../components/ClearTextButton';
// import Tags from '../components/Tags';

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
                // flexDirection: 'row',
                justifyContent:'flex-start',
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

        },
        sub: {
            view: {
                style: {
                    flexDirection: 'row',
                    justifyContent:'flex-start',
                    alignItems: 'center'
                    // padding: 20,
                    // paddingTop: 50,
                    // paddingBottom: 30,
                }
            },
            text: {
                style: {
                    fontSize: 18,
                    // fontWeight: "600",
                    color: Styles.textColor
                }
    
            },
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
        console.log('host selected:')
        console.log(host)
        core.setHost(host)
        core.navigate("SignIn");
    }

    onDiscoverBluetoothDevicesPress() {
        core.navigate('BluetoothDevicesDiscovery');
    }

    renderHeader() {
        return (
            <View style={style.header.view.style}>
                <Text style={style.header.text.style}>{'Lockbox Discovery'}</Text>
                <View style={style.header.sub.view.style}>
                    <Text style={style.header.sub.text.style}>{'Select a Lockbox or'}</Text>
                    <ClearTextButton title="Add a New Lockbox" onPress={() => this.onDiscoverBluetoothDevicesPress()}></ClearTextButton>
                </View>
                {/* <Tags tags={tags} editable={false} onRemove={(tag) => console.log(`tag pressed: ${tag.name}`)}/> */}
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
                {/* <ActionButton
                    buttonColor={Styles.primaryColor}
                    onPress={() => this.onDiscoverBluetoothDevicesPress()}
                /> */}
            </SafeAreaView>
        );
    }
}
