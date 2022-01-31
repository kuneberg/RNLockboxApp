import {observer} from "mobx-react";
import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView, Text, View
} from "react-native";
import DeviceListItem from "../components/DeviceListItem";
import Styles from "../styles";
import SquareButton from "../components/SquareButton";
import core from "../../core";
import setup from "../../core/setup";


const style = {
  safeArea: {
    style: {
      flex: 1
    }
  },
  refresh: {
    tintColor: Styles.inactiveColor,
    titleColor: Styles.inactiveColor,
    colors: [
      Styles.inactiveColor
    ]
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
        fontSize: 30,
        fontWeight: "600",
        color: Styles.textColor
      }

    }
  },
  footer : {
    view: {
      style: {
        padding: 20
      }
    },
    text: {
      style: {
        fontSize: 14,
        fontWeight: "600",
        alignSelf: 'center',
        color: Styles.textColor
      }
    }
  },
  empty: {
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
        fontSize: 14,
        fontWeight: "600",
        color: Styles.textColor
      }
    }
  },
  refreshButton: {
    style: {
      backgroundColor: Styles.primaryColor,
      marginTop: 80
    }
  }
}

@observer
export default class BluetoothDevicesDiscoveryScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await setup.startScan();
  }

  async componentWillUnmount() {
  }

  renderDevice(device, index) {
    let first = index == 0
    return (
        <DeviceListItem
            device={device}
            first={first}
            onPress={(device) => {this.onDeviceSelected(device)}}/>
    )
  }

  onDeviceSelected(device) {
    core.navigate('AccessPointsDiscovery', { device: device });
  }

  renderHeader(discovered) {
    if (discovered) {
      return (
          <View style={style.header.view.style}>
            <Text style={style.header.text.style}>{'Select device to setup'}</Text>
          </View>
      )
    } else {
      return null;
    }
  }

  renderFooter(scanning) {
    return (
        <View style={style.footer.view.style}>
          {scanning
              ? this.renderSearchingIndicator()
              : this.renderRefreshButton()
          }
        </View>
    )
  }

  renderRefreshButton() {
    return (
        <View>
          <SquareButton style={style.refreshButton}
                        title="Refresh"
                        onPress={async() => await setup.startScan()} />
        </View>
    )
  }

  renderSearchingIndicator() {
    return (
        <View>
          <Text style={style.footer.text.style}>{'Searching for devices ...'}</Text>
          <ActivityIndicator size="large" animating={true} />
        </View>
    )
  }

  render() {
    let scanning = setup.state.scanningForDevices;
    let devices = Array.from(setup.state.discoveredDevices.values());
    let discovered = devices.length > 0;

    return (
        <SafeAreaView style={style.safeArea.style}>
          <FlatList
              data={devices}
              renderItem={({ item, index }) => this.renderDevice(item, index)}
              ListHeaderComponent={() => this.renderHeader(discovered)}
              ListFooterComponent={() => this.renderFooter(scanning)}
              keyExtractor={item => item.id}
          />
        </SafeAreaView>
    );
  }
}
