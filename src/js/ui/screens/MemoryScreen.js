import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import core from '../../core';
import { observer } from 'mobx-react';
import MemoryView from '../components/MemoryView';
import LoadingView from '../components/LoadingView';
import ClearIconButton from '../components/ClearIconButton';

const style = {
    safeArea: {
        style: { flex: 1 }
    },
}
@observer
export default class MemoryScreen extends React.Component {

    async componentDidMount() {
        let id = this.props.route.params.id
        await core.loadMemory(id);

        this.props.navigation.setOptions({
            headerRight: () => this.renderHeaderRight(core.state.isMine),
            headerBackTitle: 'Back',
        })
    }

    renderHeaderRight(isMine) {

        if (!isMine) {
            return null
        }

        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", flexShrink: 1 }}>
                <ClearIconButton
                    icon={'share-outline'}
                    onPress={() => this.onSharePress()} />
                <ClearIconButton
                    icon={'create-outline'}
                    onPress={() => this.onEditPress()} />
            </View>
        )
    }

    onSharePress() {
        core.navigate('MemoryShare', { id: core.state.memory.id });
    }

    onEditPress() {
        core.navigate('MemoryEditor', { id: core.state.memory.id });
    }

    render() {
        if (core.state.memory == null) {
            return (
                <LoadingView/>
            )
        }
        let tagsMap = core.getTagsMap()
        return (
            <SafeAreaView style={style.safeArea.style}>
                <MemoryView item={core.state.memory} tags={tagsMap} />
            </SafeAreaView>
        );
    }
}
