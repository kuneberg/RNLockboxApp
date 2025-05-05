import {
    StyleSheet
} from 'react-native';
import Utils from './Utils';
import Common from './Common';

const bgColor = "#fff";
const headerBgColor = bgColor;
const textColor = "#000";
const primaryColor = "#005cb9";
const inactiveColor = 'rgb(65, 65, 65)';
const borderColor = 'rgb(65, 65, 65)';

const Light = Utils.mergeStyles(Common, {
    root: {
        backgroundColor: bgColor
    },
    body: {
        backgroundColor: bgColor
    },
    title: {
        color: textColor
    },
    button: {
        color: primaryColor
    },
    stackHeaderOptions: {
        headerStyle: {
            backgroundColor: headerBgColor,
        },
        headerTintColor: primaryColor
    },
    navigationTheme: {
        dark: false,
        colors: {
          primary: primaryColor,
          background: headerBgColor,
          card: headerBgColor,
          text: textColor,
          border: borderColor,
        },
    },
    tabBarOptions: {
        activeTintColor: primaryColor,
        inactiveTintColor: inactiveColor
    },
    button: {
        container: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primaryColor,
            marginBottom: 12,
            paddingVertical: 12,
            borderRadius: 4,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "rgba(255,255,255,0.7)"
        },
        text: {
            color: "#fff",
            textAlign: "center",
            height: 20
        }
    },
    form: {
        textInput: {
            style: {
                height: 40,
                borderColor: inactiveColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginBottom: 20,
            },
            props: {
                selectionColor: primaryColor
            }
            
           
        }
    },
    primaryColor,
    textColor,
    bgColor,
    memoriesListItem: {
        caption: {
            color: textColor
        },
        description: {
            color: textColor
        },
        label: {
            color: inactiveColor
        },
        view: {
            shadowColor: "rgb(26, 26, 25)",
            shadowOpacity: 0.1,
        },
        carouselItem: {
            backgroundColor: 'floralwhite',
        }
    },
});

export default Light
