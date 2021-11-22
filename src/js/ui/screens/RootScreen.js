import * as React from 'react';
import { observer } from 'mobx-react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import core from '../../core';
import AuthRootScreen from './AuthRootScreen';
import Styles from '../styles';
import HomeRootNavScreen from './HomeRootNavScreen';

const Root = createNativeStackNavigator()

@observer
export default class RootScreen extends React.Component {

    componentDidMount() {
    }

    getContent() {
        console.log(`authenticated on screen: ${core.state.authenticated}`)


        let initialRouteName = core.state.authenticated ? "HomeRoot" : "AuthRoot"
        // if (core.state.authenticated) {
        //     return (
        //         <Root.Navigator mode="modal" initialRouteName="HomeRoot">
        //             <Root.Screen name="HomeRoot" component={HomeRootNavScreen} options={{ headerShown: false }}></Root.Screen>
        //             <Root.Screen name="AuthRoot" component={AuthRootScreen} options={{ headerShown: false }}></Root.Screen>
        //         </Root.Navigator>
        //     )
        // } else {
        //     return <AuthRootScreen></AuthRootScreen>
        // }

        return (
            <Root.Navigator mode="modal" initialRouteName={'HomeRoot'}>
                {/* <Root.Screen name="AuthRoot" component={AuthRootScreen} options={{ headerShown: false }}></Root.Screen> */}
                <Root.Screen name="HomeRoot" component={HomeRootNavScreen} options={{ headerShown: false }}></Root.Screen>
            </Root.Navigator>
        )
    }

    render() {
        return <NavigationContainer ref={core.navigationRef} theme={Styles.theme.navigationTheme}>
            {this.getContent()}
        </NavigationContainer>
    }
}