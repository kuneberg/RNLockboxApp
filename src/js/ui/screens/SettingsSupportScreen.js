import * as React from 'react';
import { SafeAreaView, ScrollView, Text, View, Linking } from 'react-native';
import styles from '../styles';
import { observer } from 'mobx-react';

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
    link: {
        style: {
            color: styles.primaryColor,
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

    render() {
        return <SafeAreaView style={style.safeArea.style}>
            <ScrollView>
                <View style={{padding: 20}}>
                    <Text style={style.text.style}>For support, please visit our website at</Text>
                    <Text style={style.link.style} onPress={() => Linking.openURL("https://www.memorieslockbox.com/support")}>https://www.memorieslockbox.com/support</Text>
                    <Text style={style.text.style}>or email us at</Text>
                    <Text style={style.link.style} onPress={() => Linking.openURL("mailto: support@memorieslockbox.com")}>support@memorieslockbox.com</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    }
}
