import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import core from '../../core';
import Styles from '../styles';
import HomeRootNavScreen from './HomeRootNavScreen';

const Root = createNativeStackNavigator()

@observer
export default class RootScreen extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <GestureHandlerRootView>
                <NavigationContainer ref={core.navigationRef} theme={Styles.theme.navigationTheme}>
                    <Root.Navigator mode="modal" initialRouteName={'HomeRoot'}>
                        {/* <Root.Screen name="AuthRoot" component={AuthRootScreen} options={{ headerShown: false }}></Root.Screen> */}
                        <Root.Screen name="HomeRoot" component={HomeRootNavScreen} options={{ headerShown: false }}></Root.Screen>
                    </Root.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        )
    }
}