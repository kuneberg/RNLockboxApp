import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Styles from '../styles';

const style = StyleSheet.create({
    floatingButton: {
        backgroundColor: Styles.primaryColor, // Replace with your primary color
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 20,
        right: 20,
        elevation: 5, // For Android shadow
        shadowColor: "#000", // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});

export default class FloatingActionButton extends React.Component {

    render() {
        let icon = this.props.icon
        let onPress = this.props.onPress

        return (
            <TouchableOpacity style={style.floatingButton} onPress={() => onPress()}>
                <Ionicon name={icon} size={24} color={Styles.textColor} />
            </TouchableOpacity>
        )
    }
}
