import * as React from 'react';
import { View, Text, Button, TextInput, SafeAreaView, StyleSheet } from 'react-native';
import Styles from '../styles';
import core from '../../core';
import { observer } from 'mobx-react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import ClearTextButton from '../components/ClearTextButton';
import { toJS } from 'mobx';
import SquareButton from '../components/SquareButton';


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
                color: Styles.textColor
            }

        }
    },
    tag: {
        row: {
            style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                marginBottom: 30
            }
        },
        view: {
            style: {
                flexGrow: 1,
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'stretch',

            }
        },
        removeButton: {
            style: {
                alignSelf: 'center',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10
            },
            icon: {
                size: 24,
                style: {
                    marginLeft: 1,
                    marginTop: 1,
                    padding: 0
                },
                color: '#e74c3c'
            }
        },
        icon: {
            size: 24,
            style: {}
        },
        input: {
            style: {
                alignSelf: 'stretch',
                flexGrow: 1,
                color: Styles.textColor,
                borderColor: Styles.borderColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginLeft: 20,
                marginRight: 20,
                height: 40,
                fontSize: 20,
            }
        },
        label: {
            style: {
                marginTop: 20,
                marginLeft: 20,
                marginRight: 20,
                color: Styles.inactiveColor
            }
        },
        circleView: {
            style: {
                alignSelf: 'stretch',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginTop: 10,
                marginLeft: 20,
                marginRight: 20,
            }
        },
        circle: {
            style: {
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                justifyContent: 'center',
                alignItems: 'center',
            }
        },
    },
    footer: {
        style: {
            fles: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 50
        },
        addButton: {
            icon: {
                size: 24,
                style: {
                    marginLeft: 1,
                    marginTop: 1,
                    padding: 0
                },
                color: Styles.primaryColor
            },
        },
    },

    deleteButton: {
        style: {
            backgroundColor: "#ff3333",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 80
        }
    },

    tagColors: [
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#f39c12',
        '#f1c40f',
        '#e74c3c'
    ]
}

@observer
export default class TagEditScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tag: {}
        };
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => <ClearTextButton onPress={() => this.onDonePress()} title="Save" />,
            headerBackTitle: 'Cancel',
          })
        console.log('core.loadTagsIfNeeded')
        core.loadTagsIfNeeded();
        let { tag } = this.props.route.params;
        tag = tag ? {...tag} : { color: '#2ecc71' };
        this.setState({
            tag
        });
    }

    onDonePress() {
        core.saveTag(this.state.tag);
    }

    onDeletePress() {
        core.deleteTag(this.state.tag);
    }

    renderColors() {
        return style.tagColors.map(color => {

            let icon = 'square'
            if (this.state.tag.color === color) {
                icon = 'check-square'
            }
            return (
                <TouchableOpacity key={color} style={style.tag.view.style} onPress={() => this.updateTagColor(color)}>
                    <Icon style={style.tag.icon.style} name={icon} size={style.tag.icon.size} color={color} />
                </TouchableOpacity>
            )
        })
    }

    updateTagName(name) {
        this.setState({
            tag: {
                ...this.state.tag,
                name: name
            },
        })
    }

    updateTagColor(color) {
        this.setState({
            tag: {
                ...this.state.tag,
                color: color
            },
        })
    }

    render() {
        console.log(this.state);
        return (
            <SafeAreaView style={style.safeArea.style}>
                {/* <View style={style.header.view.style}>
                    <Text style={style.header.text.style}>{'Edit tag'}</Text>
                    <Button onPress={() => this.onDonePress()} title="Done" />
                </View> */}
                <View style={style.tag.row.style}>
                    <View style={style.tag.view.style}>
                        <Text style={style.tag.label.style}>Enter tag name</Text>
                        <TextInput
                            style={style.tag.input.style}
                            placeholder={"Tag Name"}
                            value={this.state.tag.name}
                            onChangeText={(name) => this.updateTagName(name)}
                        />
                        <Text style={style.tag.label.style}>Select Color</Text>
                        <View style={style.tag.circleView.style}>
                            {this.renderColors()}
                        </View>
                        {this.state.tag.id && <SquareButton title="Delete Tag" style={style.deleteButton.style} onPress={() => this.onDeletePress()}></SquareButton>}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
