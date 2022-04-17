import * as React from 'react';
import { SafeAreaView, Text, View, Platform, KeyboardAvoidingView, ScrollView, Pressable } from "react-native";
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import FormTextInput from '../components/FormTextImput';
import SquareButton from '../components/SquareButton';
import ErrorView from '../components/ErrorView';
import ClearTextButton from "../components/ClearTextButton";
import ClearButton from '../components/ClearButton';
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
      alignItems: 'center'
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
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      size: 128,
      color: '#fff'
    }
  },





  header: {
    view: {
      style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 30,
      }
    },

  },
  accessPoint: {
    row: {
      style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10
      }
    },
    text: {
      style: {
        color: Styles.textColor,
        fontSize: 18
      }
    }
  },
  password: {
    style: {
      color: Styles.textColor
    },
    props: {
      placeholderTextColor: "#c3c3c3"
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
  }

  onLockPressed() {
    console.log('lock pressed')
    core.toggleLock()
  }

  render() {
    let opened = core.state.lockOpened
    let icon = opened ? 'unlock' : 'lock'
    return (
      <SafeAreaView style={style.safeArea.style}>
        <KeyboardAvoidingView style={style.keyboard.style} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
            <View style={style.view.style}>
              <Text style={style.text.style}>Press to toggle lock</Text>
              <Pressable style={style.button.style} onPress={() => this.onLockPressed()}>
                <Icon name={icon} size={style.button.icon.size} color={style.button.icon.color} />
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
