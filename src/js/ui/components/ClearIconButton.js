import * as React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Styles from '../styles';
import { Pressable } from 'react-native';

export default class ClearIconButton extends React.Component {


    render() {
        let icon = this.props.icon
        let onPress = this.props.onPress
        return (
            <Pressable
                style={{ padding: 5 }}
                onPress={() => onPress()}>
                <Ionicon name={icon} size={24} color={Styles.primaryColor} />
            </Pressable>
        )
    }

}