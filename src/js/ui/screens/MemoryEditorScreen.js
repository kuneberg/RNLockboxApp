import * as React from 'react';
import {SafeAreaView} from 'react-native';
import core from '../../core';
import {observer} from 'mobx-react';
import MemoryEditor from '../components/MemoryEditor';
import LoadingView from '../components/LoadingView';
import ClearTextButton from '../components/ClearTextButton';
import ErrorScreen from "./ErrorScreen";

const style = {
  safeArea: {
    style: {flex: 1}
  },
}

@observer
class MemoryEditorHeader extends React.Component {
  render() {
    let disabled = core.state.mediaItemUploadInProgress;
    return <ClearTextButton
        disabled={disabled}
        onPress={() => this.onAddPress()}
        title="Save"/>
  }

  async onAddPress() {
    await core.saveMemory()
  }
}

@observer
export default class MemoryEditorScreen extends React.Component {

  componentDidMount() {
    let {id, add} = this.props.route.params
    console.log(`EDIT ID: ${id} add: ${add}`)
    if (add) {
      core.startMemoryAdd()
    } else {
      core.startMemoryEdit(id)
    }
    this.props.navigation.setOptions({
      headerRight: () => (<MemoryEditorHeader/>),
      headerBackTitle: 'Cancel',
    })
  }

  onEditTagsPress() {
    core.navigate('MemoryTagsEditor', {});
  }

  onEditDatePress() {
    core.navigate('MemoryDateEditor', {});
  }

  async onDeletePress() {
    await core.deleteMemory()
  }

  render() {
    if (core.state.editingMemory == null || core.state.tags == null) {
      return <LoadingView/>
    }

    let tags = core.getTagsMap()
    return (
        <SafeAreaView style={style.safeArea.style}>
          <MemoryEditor item={core.state.editingMemory}
                        tags={tags}
                        onEditTagsPress={() => this.onEditTagsPress()}
                        onEditDatePress={() => this.onEditDatePress()}
                        onAddMediaItems={async (mediaItems) => await core.addMediaItems(mediaItems)}
                        onDelete={() => this.onDeletePress()}
                        onError={(errorMsg) => core.goError(errorMsg)}
          />
        </SafeAreaView>
    )
  }
}
