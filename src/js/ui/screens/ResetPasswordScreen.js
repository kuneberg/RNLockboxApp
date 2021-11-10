import * as React from 'react';
import { View, Text, Button, Image, Dimensions } from 'react-native';
import styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormTextInput from '../components/FormTextImput';
import SquareButton from '../components/SquareButton';

@observer
export default class ResetPasswordScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        };
    }

    componentDidMount() {
    }

    onSignIn() {
        core.signIn(this.state.email, this.state.password);
    }

    onSignUp() {
        core.navigate("SignUp");
    }

    onResetPassword() {
        core.navigate("ResetPassword");
    }

    render() {
        return <View style={styles.theme.root}>
            <View style={styles.theme.form.view}>
                <FormTextInput placeholder={"Email"} value={this.state.email} onChangeText = {(email) => this.setState({...this.state, email})}/>
                <SquareButton
                    title="Reset password"
                    onPress={() => this.onSignIn()}
                    color={styles.theme.button.color}
                />
            </View>
        </View>
    }
}