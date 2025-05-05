import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import * as React from 'react';
import styles from '../styles';
import SettingsChangePasswordScreen from './SettingsChangePasswordScreen';
import SettingsHomeScreen from './SettingsHomeScreen';
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