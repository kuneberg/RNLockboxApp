import * as React from "react";
import {Text, View} from "react-native";
import Styles from "../styles";
import SquareButton from "../components/SquareButton";
import Ionicon from 'react-native-vector-icons/Ionicons';
import core from '../../core'

const style = {
  modal: {
    height: "50%",
    width: '100%',
    padding: 20,
    backgroundColor: "rgba(55, 60, 64, 0.8)",
    alignItems: "stretch",
    justifyContent: "space-between",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowColor: '#000000',
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Styles.borderColor
  },
  text: {
    color: Styles.errorBgColor,
    fontWeight: "600",
    fontSize: 22,
    textAlign: "center"
  }
}

export default class ErrorScreen extends React.Component {

  onOkPress() {
    core.goBack()
  }

  render() {
    let errorMsg = this.props.route.params.errorMsg
    return (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <View opacity={0.8} style={style.modal}>
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <View style={{alignItems: "center"}}>
                <Ionicon name={"alert-circle-outline"}
                         size={48}
                         color={Styles.errorBgColor}/>
              </View>
              <Text style={style.text}>{errorMsg}</Text>
            </View>
            <SquareButton
                title="OK"
                onPress={() => this.onOkPress()}
                style={{backgroundColor: Styles.errorBgColor}}
            />
          </View>
        </View>
    );
  }
}
