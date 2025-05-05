import * as React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import core from '../../core';
import MemoriesListItem from './MemoriesListItem';

export default class MemoriesList extends React.Component {

    state = {refreshing: false}

    onItemPress(item) {
        if (this.props.onItemPress) {
            this.props.onItemPress(item);
        }
    }

    renderListItem(item) {
        console.log('render item: ' + JSON.stringify(item))
        return <MemoriesListItem item={item} onPress={(item) => this.onItemPress(item)}></MemoriesListItem>
    }

    async refresh() {
        console.log('refresh...')
        this.setState({refreshing: true})
        await core.loadMemories()
        this.setState({refreshing: false})
    }

    render() {
        return <FlatList refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh.bind(this)} />}
                data={this.props.memories}
                renderItem={({ item }) => this.renderListItem(item)}
                keyExtractor={item => item.id}>
        </FlatList>
    }
}
