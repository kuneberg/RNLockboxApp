import * as React from "react";
import { View, Text } from "react-native";
import Styles from '../styles';


const style = {
    view: {
        style: {
            backgroundColor: Styles.errrorBgColor,
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
        }
    },
    text: {
        style: {
            color: Styles.errrorColor,
            fontSize: 16
        }
    }
}

export default class ErrorView extends React.Component {
  render() {
    return (
      <View style={style.view.style}>
          <Text style={style.text.style}>{this.props.message}</Text>
      </View>
    );
  }
}
