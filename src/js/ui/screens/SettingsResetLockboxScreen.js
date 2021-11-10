import * as React from 'react';
import { SafeAreaView, ScrollView, Text, Button, Image, Dimensions, View } from 'react-native';
import styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormTextInput from '../components/FormTextImput';
import SquareButton from '../components/SquareButton';
import { HeaderBackButton } from '@react-navigation/native-stack';

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
                paddingBottom: 30,
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
    text: {
        style: {
            color: styles.textColor,
            marginBottom: 10
        }
    },
    button: {
        style: {
            marginTop: 40,
            backgroundColor: '#ff3333'
        }
    }
}


@observer
export default class SettingsResetLockboxScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: ''
        };
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerBackTitle: 'Back',
        })
    }

    async resetLockbox() {
        await core.resetLockbox();
        await core.signOut();
        core.navigate("SettingsHome");
    }

    render() {
        return <SafeAreaView style={style.safeArea.style}>
            <ScrollView>
                <View style={{padding: 20}}>
                <Text style={style.text.style}>Warning! Reset will delete all user data from the Lockbox!</Text>
                <Text style={style.text.style}>Use long press.</Text>
                <SquareButton
                    title="Reset Lockbox"
                    onPress={() => this.resetLockbox()}
                    style={style.button.style}
                />
                </View>
            </ScrollView>
        </SafeAreaView>
    }
}