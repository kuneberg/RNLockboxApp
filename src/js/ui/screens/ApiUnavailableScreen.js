import * as React from 'react';
import {View, Text, ScrollView} from 'react-native';
import { observer } from 'mobx-react';
import SquareButton from "../components/SquareButton";
import SafeAreaView
  from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import core from "../../core";
import styles from "../styles";



const style = {
  safeArea: {
    style: {
      flex: 1
    }
  },
  text: {
    style: {
      color: styles.textColor,
      marginBottom: 10
    }
  },
  connectButton: {
    style: {
      marginTop: 40,
      backgroundColor: styles.primaryColor
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
          <ScrollView>
            <View style={{padding: 20}}>
              <Text style={style.text.style}>Lockbox connection lost!</Text>
              <Text style={style.text.style}>Tap the Connect button</Text>
              <SquareButton
                  title="Connect"
                  style={style.connectButton.style}
                  onPress={() => this.onConnectPress()}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
    );
  }
}

