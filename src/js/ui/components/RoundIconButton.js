import * as React from "react";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from '../styles';


const style = {
  container: {
    style: {
      width: 40,
      height: 40,
      borderRadius: 40 / 2,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Styles.primaryColor,
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0.55,
      shadowRadius: 8
    }
  },
  icon: {
    size: 24,
    style: {
      marginLeft: 2,
      marginTop: 2,
      padding: 0
    },
    color: '#fff'
  },
  text: {
    style: {
      alignSelf: 'center',
      fontSize: 50,
      color: '#fff'
    }
  }
}

export default class RoundIconButton extends React.Component {
  render() {
    const { icon, onPress } = this.props;
    return (
      <TouchableOpacity style={[style.container.style]} onPress={onPress}>
        {/* <Text style={style.text.style}>+</Text> */}
        <Icon style={style.icon.style} name={icon} size={style.icon.size} color={style.icon.color} />
      </TouchableOpacity>
    );
  }
}
