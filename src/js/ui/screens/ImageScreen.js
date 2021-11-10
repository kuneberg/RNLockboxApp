import * as React from 'react';
import { View, Text, Button, Image, Dimensions, SafeAreaView, FlatList } from 'react-native';
import core from '../../core';
import { observer } from 'mobx-react';
import {useHeaderHeight} from '@react-navigation/elements';
import ImageZoom from 'react-native-image-pan-zoom';
import LoadingView from '../components/LoadingView';

const style = {
  safeArea: {
    style: { flex: 1 }
  },
}
@observer
export default class ImageScreen extends React.Component {

  constructor() {
    super();
    this.state = {}
  }
  async componentDidMount() {
    let item = this.props.route.params.item
    let source = core.createReactImageSource(item)

    Image.getSizeWithHeaders(source.uri, source.headers, (width, height) => { this.setState({ width, height, source }) });

    this.props.navigation.setOptions({
      headerBackTitle: 'Back'
    })
  }

  render() {
    if (!this.state.source) {
      return <LoadingView />
    }

    let width = Dimensions.get('window').width
    let height = Dimensions.get('window').height

    return (
      <SafeAreaView style={style.safeArea.style}>
        <ImageView source={this.state.source}
          screenWidth={width}
          screenHeight={height}
          originalImageWidth={this.state.width}
          originalImageHeight={this.state.height}
        />
      </SafeAreaView>
    );
  }
}


function ImageView({ source, screenWidth, screenHeight, originalImageWidth, originalImageHeight }) {
  let headerHeight = useHeaderHeight()

  let availableHeight = screenHeight - headerHeight

  let cropWidth = screenWidth
  let cropHeight = availableHeight

  let imageWidth = screenWidth
  let imageHeight = availableHeight

  if (originalImageWidth > originalImageHeight) {
    let scale = cropWidth / originalImageWidth
    imageHeight = originalImageHeight * scale
  } else {
    let scale = cropHeight / originalImageHeight
    imageWidth = originalImageWidth * scale
  }

  return <ImageZoom cropWidth={cropWidth}
    cropHeight={cropHeight}
    imageWidth={imageWidth}
    imageHeight={imageHeight}>
    <Image style={{ width: imageWidth, height: imageHeight }} source={source} />
  </ImageZoom>
}
