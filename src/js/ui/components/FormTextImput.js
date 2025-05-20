import * as React from "react";
import { TextInput } from "react-native";
import styles from '../styles';


export default class FormTextInput extends React.Component {
  render() {
    const { style, ...otherProps } = this.props;
    return (
      <TextInput
        {...styles.theme.form.textInput.props}
        selectionColor={styles.theme.form.textInput.props.selectionColor}
        style={[styles.theme.form.textInput.style, style]}
        {...otherProps}
      />
    );
  }
}