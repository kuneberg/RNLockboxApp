import * as React from 'react';
import { observer } from 'mobx-react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemoriesListScreen from './MemoriesListScreen';

const Stack = createNativeStackNavigator();

@observer
export default class MemoriesRootScreen extends React.Component {

    componentDidMount() {
    }

    render() {
        return <Stack.Navigator initialRouteName="MemoriesList">
            <Stack.Screen name="MemoriesList" component={MemoriesListScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    }
}
