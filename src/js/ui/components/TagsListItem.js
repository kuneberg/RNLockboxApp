import * as React from 'react';
import { Pressable, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Styles from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ClearIconButton from './ClearIconButton';

const style = {
  view: {
    style: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'rgba(255,255,255,0.02)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    first: {
      style: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
      },
    },
    pressed: {
      style: {
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
    },
  },
  text: {
    style: {
      marginLeft: 10,
      color: Styles.textColor,
      alignSelf: 'center',
      flex: 1
    },
  },
  icon: {
    size: 20,
    style: {},
  },
};
export default class TagsListItem extends React.Component {
  onSharePress(tag) {
    if (this.props.onSharePress) {
      this.props.onSharePress(tag);
    }
  }

  onEditPress(tag) {
    if (this.props.onEditPress) {
      this.props.onEditPress(tag);
    }
  }

  render() {
    let viewStyle = this.props.first
      ? { ...style.view.style, ...style.view.first.style }
      : style.view.style;
    let icon = this.props.checked ? 'check-square' : 'square';

    let tag = this.props.tag;
    let accountId = this.props.accountId;
    let owned = accountId == tag.ownerId;

    return (
      <View style={viewStyle}>
        <Icon
          style={style.icon.style}
          name={icon}
          size={style.icon.size}
          color={tag.color}
        />
        <Text style={style.text.style}>{tag.name}</Text>
        {owned && (
          <ClearIconButton
            icon={'share-outline'}
            onPress={() => this.onSharePress(tag)} />
        )}
        {owned && (
          <ClearIconButton
            icon={'create-outline'}
            onPress={() => this.onEditPress(tag)} />
        )}
      </View>
    );
  }
}
