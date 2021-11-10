import * as React from 'react';
import { View, Text, Button, Image, Dimensions } from 'react-native';
import styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import FormTextInput from '../components/FormTextImput';
import SquareButton from '../components/SquareButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ErrorView from '../components/ErrorView';

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

    onResetPassword() {
        core.navigate("ResetPassword");
    }

    discover() {
        core.discover()
    }

    render() {
        return <View style={styles.theme.root}>
            {/* <View style={{flexDirection:'row', height:44, justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={this.fill.bind(this)}>
                    <View style={{width: 44, height: 44, }}/>
                </TouchableOpacity>
            </View> */}
            <View style={styles.theme.form.view}>
                {core.state.authErrorMsg && <ErrorView message={core.state.authErrorMsg}/>}
                <FormTextInput placeholder={"Email"} value={this.state.email} autoCapitalize='none' autoComplete='off' onChangeText = {(email) => this.setState({...this.state, email})}/>
                <FormTextInput placeholder={"Password"} value={this.state.password} autoCapitalize='none' autoComplete='off' onChangeText = {(password) => this.setState({...this.state, password})}/>
                {/* <Button
                    title="Forgot Password?"
                    onPress={() => this.onResetPassword()}
                    color={styles.theme.button.color}
                /> */}
                <SquareButton
                    title="Sign In"
                    onPress={() => this.onSignIn()}
                    color={styles.theme.button.color}
                />
                <Button
                    title="Sign Up"
                    onPress={() => this.onSignUp()}
                    color={styles.theme.button.color}
                />
            </View>
        </View>
    }
}