import * as React from 'react';
import { View, Text, Button, Image, Dimensions } from 'react-native';
import styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import DiscoverScreen from './DiscoverScreen';

const Stack = createNativeStackNavigator();


@observer
export default class AuthRootScreen extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <Stack.Navigator initialRouteName="Discover">
                <Stack.Screen name="Discover" component={DiscoverScreen} options={{headerShown: false}}/>
                <Stack.Screen name="SignIn" component={SignInScreen} options={{...styles.theme.stackHeaderOptions, title: 'Sign In' }}/>
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{...styles.theme.stackHeaderOptions, title: 'Sign Up' }}/>
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{...styles.theme.stackHeaderOptions, title: 'Reset Password' }}/>
            </Stack.Navigator>
        );
    }
}