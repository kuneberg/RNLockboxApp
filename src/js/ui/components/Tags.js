import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';



const style = {
    tags: {
        view: {
            style: {
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
            }
        }
    },
    tag: {
        view: {
            style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 3,
                paddingTop: 3,
                paddingBottom: 3,
                paddingLeft: 6,
                paddingRight: 6,
                margin: 3
            }
        },
        text: {
            style: {
                fontSize: 14,
                fontWeight: '700'
            }
        },
        remove: {
            view: {
                style: {
                    paddingLeft: 3
                }
            }
        },
        icon: {
            style: {
                margin: 0
            }
        }
    }
}

export default class Tags extends React.Component {

    renderTags(tags, editable, onRemove) {
        return tags.map(tag => {
            return (<Tag tag={tag} editable={editable} onRemove={onRemove} />)
        })
    }

    render() {
        return (
            <View style={style.tags.view.style}>
                {this.renderTags(this.props.tags, this.props.editable, this.props.onRemove)}
            </View>
        )
    }
}

function Tag({ tag, editable, onRemove }) {
    console.log(`tag editable: ${editable}`)
    let foregroundColor = invertColor(tag.color);
    return (
        <View style={[style.tag.view.style, { backgroundColor: tag.color }]}>
            <Text style={[style.tag.text.style, { color: foregroundColor }]}>{tag.name}</Text>
            {editable && <Pressable style={style.tag.remove.view.style} onPress={() => onRemove(tag)}><Ionicon style={style.tag.icon.style} name="close-outline" color={foregroundColor} size={22} /></Pressable>}
        </View>
    )
}

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
}