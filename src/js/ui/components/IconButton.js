import * as React from "react";
import { Pressable } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

export default class IconButton extends React.Component {
    render() {
        const { iconName, onPress, style } = this.props;
        return <Pressable style={[styles.theme.iconButton.container, style]} onPress={onPress}>
            <Icon name={iconName} size={styles.theme.iconButton.icon.size} color={"#fff"} />
        </Pressable>
    }
}
