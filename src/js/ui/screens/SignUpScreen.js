import * as React from 'react';
import { View, Text, Button, Image, Dimensions } from 'react-native';
import styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormTextInput from '../components/FormTextImput';
import SquareButton from '../components/SquareButton';
import ErrorView from '../components/ErrorView';

@observer
export default class SignUpScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        };
    }

    componentDidMount() {
    }

    onSignUp() {
        core.signUp(this.state.email, this.state.password);
    }


    render() {
        return <View style={styles.theme.root}>
            <View style={styles.theme.form.view}>
                {core.state.authErrorMsg && <ErrorView message={core.state.authErrorMsg}/>}
                <FormTextInput placeholder={"Email"} value={this.state.email} autoCapitalize='none' autoComplete='off' onChangeText = {(email) => this.setState({email})}/>
                <FormTextInput placeholder={"Password"} value={this.state.password} autoCapitalize='none' autoComplete='off' onChangeText = {(password) => this.setState({password})}/>
                <SquareButton
                    title="Sign Up"
                    onPress={() => this.onSignUp()}
                    color={styles.theme.button.color}
                />
            </View>

        </View>
    }
}