import * as React from 'react';
import { SafeAreaView, ScrollView, Text, Button, Image, Dimensions, View, Linking } from 'react-native';
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
            backgroundColor: styles.primaryColor
        }
    }
}


@observer
export default class SettingsSupportScreen extends React.Component {

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

    async openSupport() {
        Linking.openURL("http://google.com")
    }

    render() {
        return <SafeAreaView style={style.safeArea.style}>
            <ScrollView>
                <View style={{padding: 20}}>
                <Text style={style.text.style}>Support</Text>
                <Text style={style.text.style}>Blah blah</Text>
                <SquareButton
                    title="Open support page"
                    onPress={() => this.openSupport()}
                    style={style.button.style}
                />
                </View>
            </ScrollView>
        </SafeAreaView>
    }
}