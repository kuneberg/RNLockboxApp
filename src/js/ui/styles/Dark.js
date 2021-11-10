import {
    StyleSheet
} from 'react-native';
import Utils from './Utils';
import Common from './Common';

const bgColor = "rgb(30,32,34)";
const headerBgColor = "rgb(41, 44, 47)";
const textColor = "#fff";
const primaryColor = "rgb(57, 133, 247)";
const inactiveColor = 'rgb(115, 115, 118)';
const borderColor = 'rgb(65, 65, 65)';

export default Dark = Utils.mergeStyles(Common, {
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
            shadowColor: borderColor,
        },
        headerTintColor: primaryColor
    },
    navigationTheme: {
        dark: true,
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
            backgroundColor: primaryColor,
            borderColor: "rgba(255,255,255,0.7)"
        },
        text: {
            color: "#fff",
        }
    },
    form: {
        textInput: {
            style: {
                color: "#fff",
                borderColor: inactiveColor,
            },
            props: {
                placeholderTextColor: "#c3c3c3",
                selectionColor: primaryColor
            }
        }
    },
    primaryColor,
    textColor,
    bgColor,
    inactiveColor,
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
            backgroundColor: 'rgb(17, 17, 17)',
        }
    },
    memoryEditor: {
        input: {
            style: {
                color: textColor
            },
            props: {
                placeholderTextColor: "#c3c3c3"
            }
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
            backgroundColor: 'rgb(17, 17, 17)',
        }
    },
})


