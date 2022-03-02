import { observer } from "mobx-react";
import * as React from "react";
import { SafeAreaView, Text, View, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import Styles from "../styles";
import LoadingView from "../components/LoadingView";
import ErrorView from '../components/ErrorView';
import FormTextInput from "../components/FormTextImput";
import styles from "../styles";
import SquareButton from "../components/SquareButton";
import setup from "../../core/setup";
import core from "../../core";

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
export default class AccessPointConnectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessPoint: null,
      password: null
    };
  }

  async componentDidMount() {
    let accessPoint = this.props.route.params.accessPoint;
    setup.state.connectedToAp = false
    // accessPoint = {
    //   s: 'Kunegerg'
    // }
    this.setState({ ...this.state, name: accessPoint.s, accessPoint })
  }

  async connectAP() {
    await setup.connectAP(this.state.name, this.state.password);
  }

  async goToDiscovery() {
    await core.navigateReset('Discover')
  }


  render() {
    let accessPoint = this.state.accessPoint
    let connecting = setup.state.connectingToAp
    let connected = setup.state.connectedToAp

    if (connecting) {
      return <LoadingView text={'Connecting...'}/>
    }



    let name = this.state.name
    let password = this.state.password

    if (connected) {
      return (
        <SafeAreaView style={style.safeArea.style}>
          <KeyboardAvoidingView style={style.keyboard.style} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
              <View style={style.view.style}>
                <View style={style.header.view.style}>
                  <Text style={style.header.text.style}>{`Lockbox successfully connected to ${name}`}</Text>
                </View>
                <SquareButton
                  title="Complete"
                  onPress={() => this.goToDiscovery()}
                  color={styles.theme.button.color}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )
    }

    return (
      <SafeAreaView style={style.safeArea.style}>
        <KeyboardAvoidingView style={style.keyboard.style} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
            <View style={style.view.style}>
              <View style={style.header.view.style}>
                <Text style={style.header.text.style}>{'Set WiFi Settings'}</Text>
              </View>
              {setup.state.connectingError && <ErrorView message={setup.state.connectingError}/>}
              <FormTextInput
                style={style.password.style}
                value={name}
                placeholder={"Access Point Name"}
                onChangeText={(v) => this.setState({ ...this.state, name: v })} />
              <FormTextInput
                style={style.password.style}
                value={password}
                placeholder={"Password"}
                onChangeText={(v) => this.setState({ ...this.state, password: v })} />
              <SquareButton
                title="Connect"
                onPress={() => this.connectAP()}
                color={styles.theme.button.color}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
