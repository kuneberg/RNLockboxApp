import * as React from "react";
import { Pressable, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from "../styles";


const style = {
  view: {
    style: {
      flexDirection: 'row',
      alignItems: 'center',
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
      marginLeft: 10,
      color: Styles.textColor
    }
  },
  icon: {
    size: 20,
    style: {
    }
  },
}
export default function AccessPointListItem({ accessPoint, onPress, first }) {
  let viewStyle = first ? { ...style.view.style, ...style.view.first.style } : style.view.style
  let pressedStyle = { ...viewStyle, ...style.view.pressed.style }
  let icon = 'square'
  return (<Pressable
      style={({ pressed }) => {
        return pressed ? pressedStyle : viewStyle
      }}
      onPress={() => onPress && onPress(accessPoint)}
  >
    <Icon style={style.icon.style} name={icon} size={style.icon.size} color={"#fff"} />
    <Text style={style.text.style}>{accessPoint.ssid}</Text>
    <Text style={style.text.style}>{accessPoint.address}</Text>
  </Pressable>)
}
