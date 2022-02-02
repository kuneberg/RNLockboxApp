import {observer} from "mobx-react";
import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  View
} from "react-native";
import Styles from "../styles";
import SquareButton from "../components/SquareButton";
import AccessPointListItem from "../components/AccessPointListItem";
import setup from "../../core/setup";
import core from "../../core";

const style = {
  safeArea: {
    style: {
      flex: 1
    }
  },
  scanning : {
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
export default class AccessPointsDiscoveryScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let device = this.props.route.params.device;
    await setup.connectAndScanForAPs(device);
  }

  async componentWillUnmount() {
    await setup.disconnect();
  }

  renderError() {

  }

  renderScanningIndicator() {
    return (
        <View style={style.scanning.view.style}>
          <Text style={style.scanning.text.style}>{'Searching for access points ...'}</Text>
          <ActivityIndicator size="large" animating={true} />
        </View>
    )
  }

  renderAccessPoints(accessPoints) {
    return (
        <FlatList
            data={accessPoints}
            renderItem={({ item, index }) => this.renderAccessPoint(item, index)}
            ListHeaderComponent={() => this.renderHeader()}
            ListFooterComponent={() => this.renderFooter()}
            keyExtractor={item => item.id}
        />
    )
  }

  renderHeader() {
    return (
        <View style={style.header.view.style}>
          <Text style={style.header.text.style}>{'Select access point to connect'}</Text>
        </View>
    )
  }

  renderFooter() {
    return (
        <View style={style.footer.view.style}>
          <View>
            <SquareButton
                style={style.refreshButton}
                title="Refresh"
                onPress={async() => await setup.refreshAPs()}/>
          </View>
        </View>
    )
  }

  renderAccessPoint(accessPoint, index) {
    let first = index == 0
    return (
        <AccessPointListItem
            accessPoint={accessPoint}
            first={first}
            onPress={(accessPoint) => {this.onAccessPointSelected(accessPoint)}}/>
    )
  }

  onAccessPointSelected(accessPoint) {
    core.navigate('AccessPointConnection', { accessPoint: accessPoint });
  }

  renderContents(scanning, accessPoints, discovered) {

    if (scanning) {
      return this.renderScanningIndicator();
    }

    if (discovered) {
      return this.renderAccessPoints(accessPoints);
    } else {
      return this.renderNotDiscovered();
    }
  }

  renderNotDiscovered() {
    return (
        <View style={style.empty.view}>
          <Text style={style.empty.text}>No access points available</Text>
        </View>
    )
  }

  render() {
    let scanning = setup.state.scanningForAPs;
    let accessPoints = setup.state.discoveredAccessPoints;
    let discovered = accessPoints.length > 0;

    return (
        <SafeAreaView style={style.safeArea.style}>
          {
            this.renderContents(scanning, accessPoints, discovered)
          }
        </SafeAreaView>
    )
  }
}
