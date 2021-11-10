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
}


@observer
export default class SettingsChangePasswordScreen extends React.Component {

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

    async changePassword() {
        await core.changePassword(this.state.email, this.state.password);
        core.navigate("SettingsHome");
    }

    render() {
        return <SafeAreaView style={style.safeArea.style}>
            <ScrollView>
                <View style={{padding: 20}}>
                <FormTextInput placeholder={"Old Password"} value={this.state.oldPassword} onChangeText = {(oldPassword) => this.setState({...this.state, oldPassword})}/>
                <FormTextInput placeholder={"New Password"} value={this.state.newPassword} onChangeText = {(newPassword) => this.setState({...this.state, newPassword})}/>
                <SquareButton
                    title="Change Password"
                    onPress={() => this.changePassword()}
                    color={styles.theme.button.color}
                />
                </View>
            </ScrollView>
        </SafeAreaView>
    }
}