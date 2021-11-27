import * as React from 'react';
import {SafeAreaView} from 'react-native';
import core from '../../core';
import Video from 'react-native-video';
import LoadingView from "../components/LoadingView";
import {observer} from "mobx-react";

const style = {
  safeArea: {
    style: { flex: 1 }
  },
}
@observer
export default class VideoScreen extends React.Component {

  constructor() {
    super();
    this.state = {}
  }

  async componentDidMount() {
    let {item} = this.props.route.params;
    let source = core.createReactSource(item);
    this.setState({ source });

    console.log('source: ' + JSON.stringify(source, null, 2))
  }

  render() {
    if (!this.state.source) {
      return <LoadingView />
    }

    return <SafeAreaView style={style.safeArea.style}>
      <Video
          source={this.state.source}
          resizeMode={"contain"}
          controls={true}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          ref={(ref) => {
            this.player = ref
          }}
          onBuffer={(a,b)=>console.log('on buffer: ' + JSON.stringify(a) + ' ' + + JSON.stringify(b))}
          onError={(a,b)=>console.log('on error: ' + JSON.stringify(a) + ' ' + + JSON.stringify(b))}
      />
    </SafeAreaView>
  }
}
