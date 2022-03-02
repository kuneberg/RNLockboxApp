import * as React from 'react';
import styles from '../styles';
import { observer } from 'mobx-react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemoryScreen from './MemoryScreen';
import MemoryEditorScreen from './MemoryEditorScreen';
import MemoryTagsEditorScreen from './MemoryTagsEditorScreen';
import VideoScreen from './VideoScreen'
import MemoryShareScreen from './MemoryShareScreen';
import MemoryDateEditorScreen from './MemoryDateEditorScreen';
import ImageScreen from './ImageScreen';
import HomeScreen from './HomeScreen';
import TagEditScreen from './TagEditScreen';
import TagShareScreen from './TagShareScreen';
import ApiUnavailableScreen from "./ApiUnavailableScreen";
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import DiscoverScreen from './DiscoverScreen';
import BluetoothDevicesDiscoveryScreen from "./BluetoothDevicesDiscoveryScreen";
import AccessPointsDiscoveryScreen from "./AccessPointsDiscoveryScreen";
import AccessPointConnectionScreen from "./AccessPointConnectionScreen";

const Stack = createNativeStackNavigator();

@observer
export default class HomeRootNavScreen extends React.Component {

    componentDidMount() {
    }

    render() {
        let initialRouteName = core.state.authenticated ? "Home" : "Discover"
        // initialRouteName = 'AccessPointConnection'
        // initialRouteName = 'AccessPointsDiscovery'
        return <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Screen name="Discover" component={DiscoverScreen} options={{headerShown: false}}/>
            <Stack.Screen name="BluetoothDevicesDiscovery" component={BluetoothDevicesDiscoveryScreen} options={{ title: 'LockBox Setup' }}/>
            <Stack.Screen name="AccessPointsDiscovery" component={AccessPointsDiscoveryScreen} options={{ title: 'LockBox Setup' }}/>
            <Stack.Screen name="AccessPointConnection" component={AccessPointConnectionScreen} options={{ title: 'LockBox Setup' }}/>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{...styles.theme.stackHeaderOptions, title: 'Sign In' }}/>
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{...styles.theme.stackHeaderOptions, title: 'Sign Up' }}/>
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{...styles.theme.stackHeaderOptions, title: 'Reset Password' }}/>

            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Memory" component={MemoryScreen} options={{ ...styles.theme.stackHeaderOptions, title: 'Memory' }} />
            <Stack.Screen name="MemoryEditor" component={MemoryEditorScreen} options={{ ...styles.theme.stackHeaderOptions, title: 'Edit Memory' }} />
            <Stack.Screen name="MemoryShare" component={MemoryShareScreen} options={{ ...styles.theme.stackHeaderOptions, title: 'Share Memory' }} />
            <Stack.Screen name="MemoryTagsEditor" component={MemoryTagsEditorScreen} options={{ ...styles.theme.stackHeaderOptions, title: 'Set Memory Tags' }} />
            <Stack.Screen name="MemoryDateEditor" component={MemoryDateEditorScreen} options={MemoryDateEditorScreen.headerOptions} />
            <Stack.Screen name="Video" component={VideoScreen} options={{ ...styles.theme.stackHeaderOptions, title: 'Video' }} />
            <Stack.Screen name="Image" component={ImageScreen} options={{ ...styles.theme.stackHeaderOptions, title: 'Image' }} />
            <Stack.Screen name="TagEdit" component={TagEditScreen} options={{ headerShown: true, title: 'Edit Tag' }} />
            <Stack.Screen name="TagShare" component={TagShareScreen} options={{ headerShown: true, title: 'Share Tag' }} />
            <Stack.Screen name="ApiUnavailable" component={ApiUnavailableScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    }
}
