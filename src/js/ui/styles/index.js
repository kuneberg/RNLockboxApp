import { Appearance } from 'react-native';
import Light from './Light';
import Dark from './Dark';

export default class Styles {
    static get primaryColor() {
        return 'rgb(57, 133, 247)'
    }

    static get textColor() {
        return '#fff'
    }

    static get primaryColor() {
        return 'rgb(57, 133, 247)'
    }

    static get inactiveColor() {
        // return 'rgb(115, 115, 118)'
        return 'rgb(200, 200, 200)'
    }

    static get borderColor() {
        return 'rgb(65, 65, 65)'
    }

    static get bgColor() {
        return 'rgb(41, 44, 47)'
    }

    static get bgColorTransparent() {
        return 'rgba(41, 44, 47, 0.9)'
    }

    static get errrorBgColor() {
        return 'rgba(232, 28, 79, 1)'
    }

    static get errrorColor() {
        return '#fff'
        // return 'rgba(251, 216, 225, 1)'
    }

    static get theme() {
        return Dark;
        // const colorScheme = Appearance.getColorScheme();
        // if (colorScheme === 'dark') {
        //     return Dark;
        // } else {
        //     return Light;
        // }
    }
}