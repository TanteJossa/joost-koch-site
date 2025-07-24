/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import analytics from './analytics'

export function registerPlugins (app) {
  app.use(vuetify)
  app.use(analytics)
}
