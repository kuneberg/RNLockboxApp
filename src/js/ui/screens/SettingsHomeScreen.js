import * as React from 'react';
import { View, Text, Button, Image, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { observer } from 'mobx-react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from '../styles';
import core from '../../core';
import ResetPasswordScreen from './ResetPasswordScreen';
import { ScrollView } from 'react-native-gesture-handler';
import Separator from '../components/Separator';
import MenuButton from '../components/MenuButton';


const style = {
    safeArea: {
        style: { flex: 1 }
    },
    header: {
        view: {
            style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                paddingTop: 50,
                paddingBottom: 10,
            }
        },
        text: {
            style: {
                fontSize: 36,
                fontWeight: "600",
                color: styles.textColor
            }

        }
    },
    info: {
        view: {
            style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                paddingTop: 0,
                paddingBottom: 10,
            }
        },
        text: {
            style: {
                fontSize: 18,
                fontWeight: "600",
                color: styles.textColor
            }

        }
    },
}

@observer
export default class SettingsHomeScreen extends React.Component {

    componentDidMount() {
        core.loadDeviceInfo();
    }

    changePassword() {
        core.navigate("SettingsPasswordChange");
    }

    resetLockbox() {
        core.navigate("SettingsLockboxReset");
    }

    support() {
        core.navigate("SettingsSupport");
    }

    signOut() {
        core.signOut()
    }

    bytesToSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    render() {

        let deviceInfo = core.state.deviceInfo


        return <SafeAreaView style={style.safeArea.style}>
            <ScrollView>
                <View style={style.header.view.style}>
                    <Text style={style.header.text.style}>{'Settings'}</Text>
                </View>
                {deviceInfo && <View style={style.info.view.style}>
                    <Text style={style.info.text.style}>Device Name: {deviceInfo.name}</Text>
                </View>}
                {deviceInfo && <View style={style.info.view.style}>
                    <Text style={style.info.text.style}>Disc Usage: {this.bytesToSize(deviceInfo.usedSpace)}/{this.bytesToSize(deviceInfo.totalSpace)}</Text>
                </View>}
                <MenuButton
                    title="Support"
                    onPress={() => this.support()}
                />
                <MenuButton
                    title="Change Password"
                    onPress={() => this.changePassword()}
                    first
                />
                <MenuButton
                    title="Reset Lockbox"
                    onPress={() => this.resetLockbox()}
                />
                <MenuButton
                    title="Logout"
                    onPress={() => this.signOut()}
                />
            </ScrollView>
        </SafeAreaView>
    }
}
