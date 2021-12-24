import * as React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import FormTextInput from '../components/FormTextImput';
import SquareButton from '../components/SquareButton';
import ErrorView from '../components/ErrorView';
import ClearTextButton from "../components/ClearTextButton";
import KeyboardAvoidingView
    from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";

@observer
export default class SignInScreen extends React.Component {

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

    render() {
        return <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.theme.root}>
                <View style={styles.theme.form.view}>
                    {core.state.authErrorMsg && <ErrorView message={core.state.authErrorMsg}/>}
                    <FormTextInput
                        placeholder={"Email"}
                        value={this.state.email}
                        autoCapitalize='none' autoComplete='off'
                        onChangeText = {(email) => this.setState({...this.state, email})}/>
                    <FormTextInput
                        placeholder={"Password"}
                        value={this.state.password}
                        autoCapitalize='none' autoComplete='off'
                        onChangeText = {(password) => this.setState({...this.state, password})}/>
                    <SquareButton
                        title="Sign In"
                        onPress={() => this.onSignIn()}
                        color={styles.theme.button.color}
                    />
                    <ClearTextButton
                        title="Sign Up"
                        onPress={() => this.onSignUp()}
                    />
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    }
}
