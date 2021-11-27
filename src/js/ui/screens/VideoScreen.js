import * as React from 'react';
import { SafeAreaView } from 'react-native';
import core from '../../core';
import Video from 'react-native-video';

export default class VideoScreen extends React.Component {

    render() {
        let {item} = this.props.route.params

        let source = core.createReactSource(item)

        console.log('source: ' + JSON.stringify(source, null, 2))

        return <SafeAreaView style={{flex:1}}>
            <Video
                source={source}
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
                }}                                      // Store reference
                onBuffer={(a,b)=>console.log('on buffer: ' + JSON.stringify(a) + ' ' + + JSON.stringify(b))}
                onError={(a,b)=>console.log('on error: ' + JSON.stringify(a) + ' ' + + JSON.stringify(b))}

            />
        </SafeAreaView>
    }

}
