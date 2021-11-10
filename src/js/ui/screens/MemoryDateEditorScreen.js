import * as React from 'react';
import { Text, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import { HeaderBackButton } from '@react-navigation/native-stack';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingView from '../components/LoadingView';
import TagsListItem from '../components/TagsListItem';
import moment from 'moment';



const style = {
    safeArea: {
        style: {
            flex: 1
        }
    },
    header: {
        view: {
            style: {
                flexDirection: 'row',
                justifyContent:'space-between',
                padding: 20,
                paddingTop: 50,
                paddingBottom: 30,
            }
        },
        text: {
            style: {
                fontSize: 36,
                fontWeight: "600",
                color: Styles.textColor
            }

        }
    },
    label: {
        style: {
            color: Styles.textColor,
            fontSize: 18,
            padding: 10
        }
    },
    tag: {
        view: {
            style: {
                flexDirection: 'row',
                padding: 10,
                paddingLeft: 20
            }
        },
        icon: {
            size: 24,
            style: {
            }
        },
        text: {
            style: {
                marginLeft: 20,
                fontSize: 20,
                color: Styles.textColor
            }

        }
    }

}

@observer
export default class MemoryDateEditorScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventDate: new Date()
        }
    }


    componentDidMount() {
        let memory = core.state.editingMemory
        let eventDate = moment(memory.eventDate).toDate()


        this.setState({
            eventDate
        });

        this.props.navigation.setOptions({
            headerRight: () => this.renderHeaderRight(),
            headerBackTitle: 'Cancel',
        })
    }


    renderHeaderRight() {
        return <Button onPress={() => this.onOkPress()} title="OK" />
    }

    onOkPress() {
        core.state.editingMemory.eventDate = moment(this.state.eventDate).format('YYYY-MM-DDTHH:mm:ss.SSZ')
        core.goBack()
    }

    onChange(e, eventDate) {
        console.log(e)
        console.log(eventDate)
        this.setState({
            eventDate
        })
    }

    render() {
        let eventDate = this.state?.eventDate || new Date()
        return (
            <SafeAreaView style={style.safeArea.style}>
                <Text style={style.label.style}>Date:</Text>
                <RNDateTimePicker mode="date" display="spinner" value={eventDate} onChange={(e, d) => this.onChange(e, d)} textColor={"#fff"}/>
                <Text style={style.label.style}>Time:</Text>
                <RNDateTimePicker mode="time" display="spinner" value={eventDate} onChange={(e, d) => this.onChange(e, d)} textColor={"#fff"} is24Hour={true}/>
            </SafeAreaView>
        );
    }
}