import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from '../styles';


const style = {
    container: {
        style: {
            height: 14,
            marginRight: 7,
            alignItems: "center",
            flexDirection: 'row',
            justifyContent: 'flex-start',
        }
    },
    text: {
        style: {
            alignSelf: 'center',
            fontSize: 12,
            color: '#fff'
        }
    },
    badge: {
        style: {
            height: 10,
            width: 10,
            borderRadius: 10 / 2,
            marginRight: 3,
        }
    }
}

export default class Tag extends React.Component {
    render() {
        const { name, color } = this.props;
        return (
            <View style={[style.container.style]}>
                <View style={[style.badge.style, { backgroundColor: color }]}></View>
                <Text style={style.text.style}>{name}</Text>
            </View>
        );
    }
}
