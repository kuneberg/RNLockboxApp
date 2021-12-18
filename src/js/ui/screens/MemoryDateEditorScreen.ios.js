import * as React from 'react';
import { Text, SafeAreaView } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ClearTextButton from "../components/ClearTextButton";



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
        return <ClearTextButton onPress={() => this.onDonePress()} title="Done" />
    }

    onDonePress() {
        core.state.editingMemory.eventDate = moment(this.state.eventDate).format('YYYY-MM-DDTHH:mm:ss.SSZ')
        core.goBack()
    }

    onChange(e, eventDate) {
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
