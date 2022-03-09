import * as React from "react";
import { View, Text } from "react-native";
import Styles from '../styles';


const style = {
    view: {
        style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    },
    text: {
        style: {
            color: Styles.inactiveColor,
            fontSize: 20
        }
    }
}

// export default class LoadingView extends React.Component {
//   render() {
//     return (
//       <View style={style.view.style}>
//           <Text style={style.text.style}>Loading...</Text>
//       </View>
//     );
//   }
// }


export default function LoadingView({ text }) {
  if (!text) {
    text = 'Loading...'
  }
  return (
    <View style={style.view.style}>
          <Text style={style.text.style}>{text}</Text>
      </View>
  )
}