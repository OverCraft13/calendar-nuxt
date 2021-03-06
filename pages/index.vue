<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="11" md="9" class="mx-auto">
        <v-card class="background-color card-shadow" height="500">
          <v-row no-gutters align="center">
            <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="6">
              <div>
                <v-img
                  :src="require('~/assets/illustrations/block-chain.png')"
                ></v-img>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="white px-4 py-8">
              <v-card-title class="my-xl-4" primary-title>
                <p class="tittle">Login</p>
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
                        class="my-xl-3"
                        name="email"
                        :error-messages="errors"
                        :label="$t('app.login.email')"
                      ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="password"
                      rules="required|min:6|max:20"
                    >
                      >
                      <v-text-field
                        v-model="password"
                        class="my-xl-3"
                        type="password"
                        maxlength="20"
                        :error-messages="errors"
                        name="password"
                        :label="$t('app.login.password')"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-form>
                </ValidationObserver>
                <div v-show="failedLogin">
                  <p class="mt-0 mb-0" style="color: #f3625d">
                    {{ loginError }}
                  </p>
                </div>
                <v-btn
                  class="my-xl-4 my-3 no-uppercase"
                  color="primary"
                  rounded
                  :disabled="disabledButton"
                  width="100%"
                  @click="loginUser"
                >
                  {{ $t('app.login.login') }}
                </v-btn>
                <v-btn
                  class="my-xl-4 my-3 no-uppercase"
                  color="secondary"
                  outlined
                  rounded
                  to="/register"
                  width="100%"
                  >{{ $t('app.login.create-an-account') }}
                </v-btn>

                <v-btn
                  small
                  class="my-xl-6 my-3 no-uppercase"
                  color="primary"
                  text
                  >{{ $t('app.login.forgot-password') }}</v-btn
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
      failedLogin: false,
      loginError: '',
      disabledButton: false,
    }
  },
  methods: {
    loginUser() {
      this.failedLogin = false
      this.$refs.observer.validate().then((result) => {
        if (result) {
          // do axios or whatever on validate true
          this.disabledButton = true
          this.$nuxt.$loading.start()
          AuthService.login(this.email, this.password)
            .then((response) => {
              const user = response.data.user
              this.$nuxt.$loading.finish()
              console.log(response)
              this.$store.dispatch('login', user)
              this.$router.push({
                path: this.$i18n.path('/users/dashboard'),
              })
            })
            .catch((err) => {
              switch (err.response.data.code) {
                case 401:
                  this.loginError = 'wrong email or password'

                  break
                case 422:
                  this.loginError = 'Unprocessable entity'

                  break
                case 429:
                  this.loginError = 'Too many requests'

                  break
                case 500:
                  this.loginError = 'Something went wrong'

                  break
                default:
                  this.loginError = 'default error'
                  break
              }
              this.disabledButton = false
              this.$nuxt.$loading.finish()
              this.failedLogin = true
            })
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
