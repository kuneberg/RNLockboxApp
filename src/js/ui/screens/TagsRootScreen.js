import * as React from 'react';
import { observer } from 'mobx-react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TagsListScreen from './TagsListScreen';

const Stack = createNativeStackNavigator();


@observer
export default class TagsRootScreen extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <Stack.Navigator initialRouteName="TagsList">
                <Stack.Screen name="TagsList" component={TagsListScreen} options={{headerShown: false, title: 'All Tags'}}/>
            </Stack.Navigator>
        );
    }
}
