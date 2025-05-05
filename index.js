/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './src/js/App';
import {name as appName} from './app.json';

function getAppComponent() {
    console.log("Starting");
    return App
}

AppRegistry.registerComponent(appName, getAppComponent);