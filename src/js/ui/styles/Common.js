import {
    StyleSheet
} from 'react-native';

export default Common = {
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        flex: 1
    },
    title: {
    },
    stackHeaderOptions: {
        headerStyle: {
            // backgroundColor: backgroundColor,
        },
        // headerTintColor: primaryColor,
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
    button: {
        container: {
            // width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            marginTop: 12,
            paddingVertical: 12,
            borderRadius: 6,
            borderWidth: 0,
        },
        text: {
            textAlign: "center",
            fontWeight: "600"
            // height: 24,
            // fontSize: 20,
        }
    },
    iconButton: {
        container: {
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 0,
            marginTop: 0,
            paddingVertical: 0,
            borderRadius: 0,
            borderWidth: 0,
        },
        icon: {
            size: 24
        }
    },
    form: {
        view: {
            flex: 1,
            justifyContent: "center",
            width: "80%"
        },
        textInput: {
            style: {
                height: 40,
                // fontSize: 20,
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginBottom: 20,
            }
        }
    },
    memoriesListItem: {
        caption: {
            marginRight: 22,
            marginLeft: 22,
            fontSize: 16,
            fontWeight: "600",
            color: "#fff"
        },
        description: {
            paddingTop: 10
        },
        label: {
            fontSize: 12,
            fontWeight: "600",
        },
        description: {
            marginRight: 22,
            marginLeft: 22,
            marginTop: 10,
            fontSize: 12,
            fontWeight: "600",
        },
        icon: {
            marginRight: 6,
        },
        iconSize: 12,
        row: {
            marginRight: 22,
            marginLeft: 22,
            flexDirection: 'row',
            marginTop: 5,
            marginBottom: 8,
        },
        view: {
            paddingRight: 0,
            paddingLeft: 0,

            paddingTop: 20,
            marginBottom: 20,
            shadowColor: "#3c3d3c",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 7,
        },
        image: {
            // width: "100%",
            height: "100%",
            resizeMode: "contain",
            borderRadius: 10
        },
        carouselItem: {
            backgroundColor: 'floralwhite',
            borderRadius: 10,
            // height: 250,
            marginLeft: 0,
            marginRight: 0,
        }
    },

    memoryEditor: {
        input: {
            style: {
                // width: "100%",
                marginRight: 22,
                marginLeft: 22,
                // fontSize: 16,
                fontWeight: "600",
                color: "#fff"
            },
            props: {

            }
        },
        description: {
            paddingTop: 10
        },
        label: {
            fontSize: 12,
            fontWeight: "600",
        },
        description: {
            marginRight: 22,
            marginLeft: 22,
            marginTop: 10,
            fontSize: 12,
            fontWeight: "600",
        },
        icon: {
            marginRight: 6,
            size: 12
        },
        row: {
            marginRight: 22,
            marginLeft: 22,
            flexDirection: 'row',
            marginTop: 5,
            marginBottom: 8,
        },
        view: {
            paddingRight: 0,
            paddingLeft: 0,

            paddingTop: 20,
            marginBottom: 20,
            shadowColor: "#3c3d3c",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 7,
        },
        image: {
            width: "100%",
            height: "250",
            resizeMode: "contain",
            borderRadius: 20
        },
        carouselItem: {
            backgroundColor: 'floralwhite',
            borderRadius: 10,
            // height: 250,
            marginLeft: 0,
            marginRight: 0,
            row: {
                marginRight: 5,
                marginLeft: 5,
                flexDirection: 'row',
                justifyContents: "flex-end",
                marginTop: 5,
                marginBottom: 8
            }
        },
        addButton: {
            marginRight: 22,
            marginLeft: 22,
        }
    }
}