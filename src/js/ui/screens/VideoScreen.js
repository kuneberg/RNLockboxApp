import * as React from 'react';
import { View, Text, Button, Image, Dimensions, SafeAreaView, FlatList } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import LoadingView from '../components/LoadingView';

import Video from 'react-native-video';

export default class VideoScreen extends React.Component {

    render() {
        // console.log('props: ' + JSON.stringify(this.props, null, 2))
        let {id, item} = this.props.route.params
        console.log('id: ' + id + ' ' + JSON.stringify(item, null, 2))
        
        let source = core.createReactSource(item)
        source.headers["Connection"] = "keep-alive"
        //let source = {uri: 'http://192.168.1.3/xxx.mp4'}
        
        console.log('source: ' + JSON.stringify(source, null, 2))
        
        return <SafeAreaView style={{flex:1}}>
            <Video source={source} 
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