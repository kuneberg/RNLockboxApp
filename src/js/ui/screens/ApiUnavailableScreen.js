import * as React from 'react';
import { View, Text } from 'react-native';
import Styles from '../styles';
import { observer } from 'mobx-react';
import SquareButton from "../components/SquareButton";
import SafeAreaView
  from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import core from "../../core";



const style = {
  safeArea: {
    style: {
      flex: 1
    }
  },
  view: {
    style: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  text: {
    style: {
      color: Styles.inactiveColor,
      fontSize: 20
    }
  },
  connectButton: {
    style: {
      backgroundColor: Styles.primaryColor,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 80
    }
  }

}

@observer
export default class ApiUnavailableScreen extends React.Component {

  onConnectPress() {
    core.signOut()
  }

  render() {
    return (
        <SafeAreaView style={style.safeArea.style}>
          <View style={style.view.style}>
            <Text style={style.text.style}>Connection lost</Text>
            <SquareButton
                title="Connect"
                style={style.connectButton.style}
                onPress={() => this.onConnectPress()}
            />
          </View>
        </SafeAreaView>
    );
  }
}

