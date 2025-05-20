import * as React from 'react';
import { SafeAreaView } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LoadingView from "../components/LoadingView";

const style = {
  safeArea: {
    style: {
      flex: 1
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

  static get headerOptions() {
    return {headerShown: false}
  }

  constructor(props) {
    super(props)
    this.state = {
      eventDate: null,
      showDatePicker: true,
      showTimePicker: false
    }
  }

  componentDidMount() {
    let memory = core.state.editingMemory
    let eventDate = moment(memory.eventDate).toDate() || new Date()


    this.setState({
      ...this.state,
      eventDate: eventDate
    });
  }

  onDateChange(e, eventDate) {
    if (e.type === 'dismissed') {
      core.goBack();
    } else if (e.type === 'set') {
      this.setState({eventDate: eventDate, showDatePicker: false, showTimePicker: true})
    }
  }

  onTimeChange(e, eventDate) {
    if (e.type === 'dismissed') {
      core.goBack();
    } else if (e.type === 'set') {
      this.setState({
        showTimePicker: false,
        eventDate: eventDate
      })
      core.state.editingMemory.eventDate = moment(this.state.eventDate).format('YYYY-MM-DDTHH:mm:ss.SSZ')
      core.goBack()
    }
  }

  render() {
    let eventDate = this.state.eventDate;

    if (!eventDate) {
      return <LoadingView />
    }

    return (
        <SafeAreaView style={style.safeArea.style}>
          {this.state.showDatePicker && (
              <RNDateTimePicker mode="date" display="default" value={eventDate} onChange={(e, d) => this.onDateChange(e, d)} textColor={"#fff"}/>
          )}
          {this.state.showTimePicker && (
              <RNDateTimePicker mode="time" display="default" value={eventDate} onChange={(e, d) => this.onTimeChange(e, d)} textColor={"#fff"} is24Hour={true}/>
          )}
        </SafeAreaView>
    );
  }
}
