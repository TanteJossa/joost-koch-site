/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const myTheme = {
    dark: true,
    colors: {
        // background: '#FFFFFF',
        // surface: '#FFFFFF',
        primary: '#6200EE',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
        'light-grey': '#333333'
    },
    variables: {
        'border-color': '#000000',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'theme-kbd': '#212529',
        'theme-on-kbd': '#FFFFFF',
        'theme-code': '#F5F5F5',
        'theme-on-code': '#000000',
    }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    theme: {
        defaultTheme: 'myTheme',
        themes: {
            myTheme
        }
    },
    defaults: {
        global: {
            // elevation: 0,
            hideDetails: 'auto',

        },
        VTextField: {
            hideDetails: 'auto'
        },
        // make sure swiping is disabled: this can cause users to access windows wich are not ment for them
        VWindow: {
            touch: {
                left: () => {},
                right: () => {}
            }
        },
        VInput: {
            hideDetails: 'auto'
        },
        VSwitch: {
            color: 'primary'
        },
        VBtn: {
            color: 'primary'

        }

    }
})
