import * as React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from '../styles';

export default class ClearIconButton extends React.Component {


    render() {
        let icon = this.props.icon
        let onPress = this.props.onPress
        return (
            <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => onPress()}>
                <Ionicon name={icon} size={24} color={Styles.primaryColor} />
            </TouchableOpacity>
        )
    }

}