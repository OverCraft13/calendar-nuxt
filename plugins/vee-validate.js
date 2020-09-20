import { extend } from 'vee-validate'
import { required, email, min, max } from 'vee-validate/dist/rules'

// Install required rule and message.
extend('required', required)

// Install email rule and message.
extend('email', email)

extend('min', min)

extend('max', max)
extend('safeText', {
  validate(value) {
    const reg = new RegExp("^[À-ÿ\\u00f1\\u00d1\\w \\s\\-\\']+$")
    return reg.test(value)
  },
  message: 'only alphanumeric characters and dashes are allowed',
})

extend('string-match', {
  validate(value, args) {
    return value === args.string
  },
  params: ['string'],
  message: 'The {_field_} does not match',
})
