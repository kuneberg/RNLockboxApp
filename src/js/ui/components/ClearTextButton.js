import * as React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from '../styles';
import {Text} from 'react-native';

const style = {
    text: {
        style: {
            fontSize: 18,
            alignSelf: 'center',
            color: Styles.primaryColor
        }
    }
}
export default class ClearTextButton extends React.Component {

    render() {
        let title = this.props.title
        let onPress = this.props.onPress
        return (
            <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => onPress()}>
                <Text style={style.text.style}>{title}</Text>
            </TouchableOpacity>
        )
    }
}
