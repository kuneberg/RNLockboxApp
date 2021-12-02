import * as React from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import AccountListItem from '../components/AccountListItem';
import LoadingView from '../components/LoadingView';
import ClearTextButton from "../components/ClearTextButton";

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
export default class TagShareScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tag: {},
      sharedWith: new Set()
    };
  }

  componentDidMount() {
    core.loadAccounts();
    let { tag } = this.props.route.params;
    this.setState({...this.state, tag: tag, sharedWith: new Set(tag.sharedWith)})

    this.props.navigation.setOptions({
      headerRight: () => <ClearTextButton onPress={() => this.onSavePress()} title="Save" />,
      headerBackTitle: 'Cancel',
    })
  }

  async onSavePress() {
    this.state.tag.sharedWith = [...this.state.sharedWith]
    await core.saveTag(this.state.tag)
  }

  onAccountSelected(account, isSelected) {
    let sharedWith = this.state.sharedWith
    if (isSelected) {
      sharedWith.add(account.id)
    } else {
      sharedWith.delete(account.id)
    }

    this.setState({
      ...this.state,
      sharedWith
    })
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

  renderAccount(account, index) {
    let first = index == 0
    let isSelected = this.state.sharedWith.has(account.id);
    return (
        <AccountListItem account={account} first={first} selected={isSelected} onPress={(a) => {this.onAccountSelected(a, !isSelected)}}/>
    )
  }

  render() {
    let accounts = core.state.accounts;

    if (!accounts) {
      return (<LoadingView></LoadingView>)
    }

    return (
        <SafeAreaView style={style.safeArea.style}>
          <FlatList
              data={accounts}
              renderItem={({ item, index }) => this.renderAccount(item, index)}
              ListHeaderComponent={() => this.renderHeader()}
              ListEmptyComponent={() => this.renderEmpty()}
              keyExtractor={item => item.email}
          />
        </SafeAreaView>
    );
  }
}
