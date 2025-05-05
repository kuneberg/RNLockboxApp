import * as React from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from '../styles';

export default class SquareButton extends React.Component {
  render() {
    const { title, onPress, style } = this.props;
    return (
      <TouchableOpacity style={[styles.theme.button.container, style]} onPress={onPress}>
        <Text style={styles.theme.button.text}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
