import { observer } from 'mobx-react';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";
import core from '../../core';
import ClearButton from '../components/ClearButton';
import ErrorView from '../components/ErrorView';
import FormTextInput from '../components/FormTextImput';
import SquareButton from '../components/SquareButton';
import Styles from '../styles';


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
        justifyContent: 'flex-end',
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
      text: {
        style: {
          fontSize: 30,
          fontWeight: "600",
          color: Styles.textColor
        }
  
      }
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
export default class SignInScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        };
    }

    componentDidMount() {
    }

    onSignIn() {
        core.signIn(this.state.email, this.state.password);
    }

    onSignUp() {
        core.navigate("SignUp");
    }

    render() {

        return (
            <SafeAreaView style={style.safeArea.style}>
              <KeyboardAvoidingView style={style.keyboard.style} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                  <View style={style.view.style}>
                    {core.state.authErrorMsg && <ErrorView message={core.state.authErrorMsg} />}
                    <FormTextInput
                      style={style.password.style}
                      value={this.state.email}
                      placeholder={"Email"}
                      autoCapitalize='none' autoComplete='off'
                      onChangeText={(v) => this.setState({ ...this.state, email: v })} />
                    <FormTextInput
                      style={style.password.style}
                      value={this.state.password}
                      placeholder={"Password"}
                      autoCapitalize='none' autoComplete='off'
                      onChangeText={(v) => this.setState({ ...this.state, password: v })} />
                    <SquareButton
                      title="Log In"
                      onPress={() => this.onSignIn()}
                      color={Styles.theme.button.color}
                    />
                    <ClearButton
                            title="Sign Up"
                            onPress={() => this.onSignUp()}/>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          )
    }
}
