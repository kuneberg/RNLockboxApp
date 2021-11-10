import * as React from 'react';
import { observer } from 'mobx-react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from '../styles';
import ResetPasswordScreen from './ResetPasswordScreen';
import MemoriesRootScreen from './MemoriesRootScreen';
import TagsRootScreen from './TagsRootScreen';
import SettingsRootScreen from './SettingsRootScreen';

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
                }

            },
        }
    }

    render() {
        return <Tab.Navigator screenOptions={({ route }) => this.screenOptions(route)} tabBarOptions={style.tabBar.options}>
            <Tab.Screen name="Memories" component={MemoriesRootScreen} options={{ tabBarLabel: 'Memories', headerShown: false }} />
            <Tab.Screen name="Tags" component={TagsRootScreen} options={{ tabBarLabel: 'Tags', headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsRootScreen} options={{ tabBarLabel: 'Settings', headerShown: false }} />
        </Tab.Navigator>
    }
}