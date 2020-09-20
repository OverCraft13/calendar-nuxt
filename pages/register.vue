<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="11" md="9" class="mx-auto">
        <v-card class="card-shadow background-color" height="500">
          <v-row no-gutters align="center">
            <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="6">
              <div>
                <v-img
                  :src="require('~/assets/illustrations/remote-team.png')"
                ></v-img>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="white px-4 py-8">
              <v-card-title class="my-xl-4" primary-title>
                <p class="tittle">{{ $t('app.register.register') }}</p>
              </v-card-title>
              <v-card-text class="text-center">
                <ValidationObserver ref="observer">
                  <v-form>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="email"
                      rules="required|email"
                    >
                      <v-text-field
                        v-model="email"
                        class="my-xl-4"
                        name="email"
                        :label="$t('app.login.email')"
                        :error-messages="errors"
                      ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="password"
                      rules="required|min:6|max:20"
                    >
                      <v-text-field
                        v-model="password"
                        class="my-xl-4"
                        name="password"
                        type="password"
                        :error-messages="errors"
                        :label="$t('app.login.password')"
                      ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="password confirmation"
                      :rules="'required|min:6|max:20|string-match:' + password"
                    >
                      <v-text-field
                        v-model="confirmPassword"
                        class="my-xl-4"
                        type="password"
                        :error-messages="errors"
                        name="confirmPassword"
                        :label="$t('app.register.confirmPassword')"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-form>
                </ValidationObserver>
                <div v-show="failedRegistration">
                  <p class="mt-0 mb-0" style="color: #f3625d">
                    {{ registerError }}
                  </p>
                </div>
                <v-btn
                  class="my-xl-4 my-3 no-uppercase"
                  color="primary"
                  rounded
                  :disabled="disabledButton"
                  width="100%"
                  @click="registerUser"
                  >{{ $t('app.register.register') }}</v-btn
                >
                <v-btn
                  class="my-xl-4 my-3 no-uppercase"
                  color="secondary"
                  outlined
                  rounded
                  to="/"
                  width="100%"
                  >{{ $t('app.login.login') }}</v-btn
                >
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-console */
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import AuthService from '@/services/AuthService.js'
export default {
  layout: 'auth',
  middleware: 'isLoggedIn',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      failedRegistration: false,
      disabledButton: false,
      registerError: '',
    }
  },
  methods: {
    registerUser() {
      this.failedRegistration = false
      this.$refs.observer.validate().then((result) => {
        if (result) {
          this.disabledButton = true
          this.$nuxt.$loading.start()
          AuthService.register(this.email, this.password)
            .then((response) => {
              this.$nuxt.$loading.finish()
              this.$store.dispatch('login', response.data.user)
              this.$router.push({
                path: this.$i18n.path('/registered'),
              })
            })
            .catch((err) => {
              console.log(err.response)

              switch (err.response.data.code) {
                case 400:
                  this.registerError = 'the email is already registered'

                  break
                case 422:
                  this.registerError = 'Unprocessable entity'

                  break
                case 429:
                  this.registerError =
                    'Too many requests registration requests from this ip adress'

                  break
                case 500:
                  this.registerError = 'Something went wrong'

                  break
              }
              this.disabledButton = false
              this.failedRegistration = true
              this.$nuxt.$loading.finish()
            })
        }
        if (!result) {
          console.log('Invalid form , vee validate')
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.tittle {
  font-size: 25px;
  color: rgb(98, 98, 98);
}

.white {
  color: white;
  height: 500px;
  border-radius: 0px 10px 10px 0;
}
.background-color {
  background: rgb(228, 250, 247);
  border-radius: 10px;
}
.full-height {
  background: rgb(228, 250, 247);
}
.no-uppercase {
  text-transform: none;
}
</style>
