import * as React from 'react';
import { View, Text, Button, Image, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { observer } from 'mobx-react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from '../styles';
import core from '../../core';
import ResetPasswordScreen from './ResetPasswordScreen';
import SettingsHomeScreen from './SettingsHomeScreen';
import SettingsChangePasswordScreen from './SettingsChangePasswordScreen';
import SettingsResetLockboxScreen from './SettingsResetLockboxScreen';
import SettingsSupportScreen from './SettingsSupportScreen';

const Stack = createNativeStackNavigator();

@observer
export default class SettingsRootScreen extends React.Component {


    render() {
        return <Stack.Navigator initialRouteName="SettingsHome">
            <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SettingsLockboxReset" component={SettingsResetLockboxScreen} options={{...styles.theme.stackHeaderOptions, title: 'Reset Lockbox' }}/>
            <Stack.Screen name="SettingsPasswordChange" component={SettingsChangePasswordScreen} options={{...styles.theme.stackHeaderOptions, title: 'Password Change' }}/>
            <Stack.Screen name="SettingsSupport" component={SettingsSupportScreen} options={{...styles.theme.stackHeaderOptions, title: 'Support' }}/>
        </Stack.Navigator>
    }
}