import * as React from 'react';
import { SafeAreaView, Text, View, Platform, KeyboardAvoidingView, ScrollView, Pressable, ActivityIndicator } from "react-native";
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';


const style = {
  safeArea: {
    style: {
      flex: 1,
    }
  },
  keyboard: {
    style: {
      flex: 1
    }
  },
  view: {
    style: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 60,
      justifyContent: 'flex-end',
      alignItems: 'center',
      // backgroundColor: "#ffffff"
    }
  },
  text: {
    style: {
      fontSize: 30,
      fontWeight: "400",
      color: Styles.inactiveColor,
      marginBottom: 30
    }
  },
  button: {
    style: {
      backgroundColor: Styles.primaryColor,
      padding: 30,
      borderRadius: 94,
      minWidth: 198,
      minHeight: 198,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pressed: {
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0.8,
      shadowRadius: 15
    },
    icon: {
      size: 128,
      color: '#fff'
    }
  }
};

@observer
export default class LockControlScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    };
  }

  componentDidMount() {
    core.initLockState()
  }

  onLockPressed() {
    let inProgress = core.state.lockInProgress
    if (!inProgress) {
      console.log('lock pressed')
      core.toggleLock()
    }
  }

  render() {
    let inProgress = core.state.lockInProgress
    let opened = core.state.lockOpened
    let icon = opened ? 'unlock' : 'lock'
    return (
      <SafeAreaView style={style.safeArea.style}>
        <KeyboardAvoidingView style={style.keyboard.style} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
            <View style={style.view.style}>
              <Text style={style.text.style}>Press to toggle lock</Text>
              <Pressable style={[style.button.style, !opened && style.button.pressed]} onPress={() => this.onLockPressed()}>
                {!inProgress && <Icon name={icon} size={style.button.icon.size} color={style.button.icon.color} />}
                {inProgress && <ActivityIndicator size="large" color={'#ffffff'}/>}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
