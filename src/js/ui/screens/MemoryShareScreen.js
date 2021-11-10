import * as React from 'react';
import { View, Text, Button, FlatList, RefreshControl, SafeAreaView, SectionList } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import { HeaderBackButton } from '@react-navigation/native-stack';
import LoadingView from '../components/LoadingView';
import AccountListItem from '../components/AccountListItem';

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
export default class MemoryShareScreen extends React.Component {

    componentDidMount() {
        let { id } = this.props.route.params
        console.log(`SHARE ID: ${id}`)
        core.startMemoryEdit(id)
        core.loadAccounts()
        this.props.navigation.setOptions({
            headerRight: () => <Button onPress={() => this.onSavePress()} title="Save" />,
            headerBackTitle: 'Cancel',
        })
    }

    async onSavePress() {
        await core.saveMemory()
    }
    
    onAccountSelected(account, isSelected) {
        
        let sharedWith = core.state.editingMemory.sharedWith || []
        let selected = new Set(sharedWith)
        if (isSelected) {
            selected.add(account.id)
        } else {
            selected.delete(account.id)
        }

        core.state.editingMemory.sharedWith = [...selected]
        console.log(core.state.editingMemory.sharedWith)
    }

    renderHeader() {
        return (
            <View style={style.header.view.style}>
                <Text style={style.header.text.style}>{'Select accounts to share with'}</Text>
            </View>
        )
    }

    renderEmpty() {
        return (
            <View style={style.empty.view.style}>
                <Text style={style.empty.text.style}>{'No accounts to share...'}</Text>
            </View>
        )
    }

    renderAccount(account, index, isSelected) {
        // console.log('host: ' + JSON.stringify(host,null,2))
        let first = index == 0
        return (
            <AccountListItem account={account} first={first} selected={isSelected} onPress={(a) => {this.onAccountSelected(a, !isSelected)}}/>
        )
    }

    render() {
        let memory = core.state.editingMemory
        let accounts = core.state.accounts
        
        if (!accounts || !memory) {
            return (<LoadingView></LoadingView>)
        }

        let sharedWith = memory.sharedWith || []
        let selected = new Set(sharedWith)

        return (
            <SafeAreaView style={style.safeArea.style}>
                <FlatList
                    data={accounts}
                    renderItem={({ item, index }) => this.renderAccount(item, index, selected.has(item.id))}
                    ListHeaderComponent={() => this.renderHeader()}
                    ListEmptyComponent={() => this.renderEmpty()}
                    keyExtractor={item => item.email}
                />
            </SafeAreaView>
        );
    }
}