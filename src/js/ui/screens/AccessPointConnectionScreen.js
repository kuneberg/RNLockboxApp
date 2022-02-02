import {observer} from "mobx-react";
import * as React from "react";
import {SafeAreaView, Text, View} from "react-native";
import Styles from "../styles";
import LoadingView from "../components/LoadingView";
import FormTextInput from "../components/FormTextImput";
import styles from "../styles";
import SquareButton from "../components/SquareButton";
import setup from "../../core/setup";

const style = {
  safeArea: {
    style: {
      flex: 1
    }
  },
  view: {
    shadowColor: "rgb(26, 26, 25)",
    shadowOpacity: 0.1,
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
    this.setState({...this.state, accessPoint: accessPoint})
  }

  async connectAP() {
    await setup.connectAP(this.state.accessPoint.s, this.state.password);
  }


  render() {
    let accessPoint = this.state.accessPoint;

    if (!accessPoint) {
      return <LoadingView />
    }

    return (
        <SafeAreaView style={style.safeArea.style}>
          <View style={style.view.style}>
            <View style={style.accessPoint.row.style}>
              <Text style={style.accessPoint.text.style}>Access point: {accessPoint.s}</Text>
            </View>
            <FormTextInput
                style={style.password.style}
                value={this.state.password}
                placeholder={"Password"}
                onChangeText={(password) => this.setState({...this.state, password: password})} />
            <SquareButton
                title="Connect"
                onPress={() => this.connectAP()}
                color={styles.theme.button.color}
            />
          </View>
        </SafeAreaView>
    )
  }
}
