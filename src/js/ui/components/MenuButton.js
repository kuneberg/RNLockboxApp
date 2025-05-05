import * as React from "react";
import { Pressable, Text } from "react-native";
import Styles from "../styles";


const style = {
    view: {
        style: {
            padding: 10,
            backgroundColor: 'rgba(255,255,255,0.02)',       
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.1)',

        },
        first: {
            style: {
                borderTopWidth: 1,
                borderTopColor: 'rgba(255,255,255,0.1)',
            }
        },
        pressed: {
            style: {
                backgroundColor: 'rgba(255,255,255,0.1)',
            }
        }
    },
    text: {
        style: {
            color: Styles.primaryColor
        }
    }
}

export default function MenuButton({title, onPress, first}) {
    let viewStyle = first ? {...style.view.style, ...style.view.first.style} : style.view.style
    let pressedStyle = {...viewStyle, ...style.view.pressed.style}
    return (<Pressable style={({pressed}) => {
        return pressed? pressedStyle : viewStyle
    }} onPress={() => onPress()}>
        <Text style={style.text.style}>{title}</Text>
    </Pressable>)
}
  