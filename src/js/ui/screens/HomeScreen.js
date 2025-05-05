import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import core from '../../core';
import Styles from '../styles';
import LockControlScreen from './LockControlScreen';
import MemoriesRootScreen from './MemoriesRootScreen';
import SettingsRootScreen from './SettingsRootScreen';
import TagsRootScreen from './TagsRootScreen';

const Tab = createBottomTabNavigator()

const style = {
    tabBar: {
        options: {
            activeTintColor: Styles.primaryColor,
            inactiveTintColor: Styles.inactiveColor
        }
    }
}

@observer
export default class HomeScreen extends React.Component {

    screenOptions(route) {
        return {
            tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Memories') {
                    iconName = 'cube';
                    return <Icon name={iconName} size={size} color={color} />
                } else if (route.name === 'Settings') {
                    iconName = 'gears';
                    return <Icon name={iconName} size={size} color={color} />
                } else if (route.name === 'Tags') {
                    iconName = 'tags';
                    return <Icon name={iconName} size={size} color={color} />
                } else if (route.name === 'LockControl') {
                    iconName = 'lock';
                    return <Icon name={iconName} size={size} color={color} />
                }

            },
        }
    }

    render() {
        let supportsLock = core.state.supportsLock
        return <Tab.Navigator screenOptions={({ route }) => this.screenOptions(route)} tabBarOptions={style.tabBar.options}>
            <Tab.Screen name="Memories" component={MemoriesRootScreen} options={{ tabBarLabel: 'Memories', headerShown: false }} />
            <Tab.Screen name="Tags" component={TagsRootScreen} options={{ tabBarLabel: 'Tags', headerShown: false }} />
            {supportsLock && <Tab.Screen name="LockControl" component={LockControlScreen} options={{ tabBarLabel: 'Lock Control', headerShown: false }} />}
            <Tab.Screen name="Settings" component={SettingsRootScreen} options={{ tabBarLabel: 'Settings', headerShown: false }} />
        </Tab.Navigator>
    }
}