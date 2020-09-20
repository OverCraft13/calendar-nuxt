import Vue from 'vue'
import VueI18n from 'vue-i18n'
import es from 'vee-validate/dist/locale/es.json'
import en from 'vee-validate/dist/locale/en.json'
import { configure } from 'vee-validate'

Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // inject our i18n instance into the app root to be used in middleware
  // This way we can use it in middleware and pages asyncData/fetch
  configure({
    // set up the vee validate configuration to translate with vue i18n
    defaultMessage: (field, values) => {
      values._field_ = app.i18n.t(`fields.${field}`)
      return app.i18n.t(`validation.${values._rule_}`, values)
    },
  })
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'en',
    messages: {
      en: {
        app: require('~/locales/en.json'),
        fields: {
          // add  form fields here
          email: 'email', //  name in the inputValidator
          password: 'password',
          name: 'name',
          passwordConfirmation: 'password confirmation',
        },
        validation: en.messages,
      },
      es: {
        app: require('~/locales/es.json'),
        fields: {
          email: 'email',
          password: 'contraseña',
          name: 'nombre',
          passwordConfirmation: 'password confirmation',
        },
        validation: es.messages,
      },
    },
  })
  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `${link}`
    }

    return `${link}?lang=${app.i18n.locale}`
  }
}
