<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="mobile"
      fixed
      :expand-on-hover="drawer && $vuetify.breakpoint.mdAndUp"
      app
      class="deep-purple"
    >
      <v-list dense nav class="py-0">
        <v-list-item
          class="ml-0 px-0"
          dark
          dense
          active-class="deep-purple darken-1"
        >
          <v-list-item-icon class="ml-2 my-2">
            <v-icon color="white">mdi-application-import</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white-color">
              <h2 style="color: white">Calendar Vue</h2>
            </v-list-item-title>
          </v-list-item-content></v-list-item
        >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          dark
          active-class="deep-purple darken-1"
          :to="$i18n.path(item.path)"
        >
          <v-list-item-icon>
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white-color">{{
              $t(item.title)
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar light app dense elevation="0">
      <v-app-bar-nav-icon
        color="primary"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <!-- <v-btn color="primary" outlined class="mr-5" @click="drawer = !drawer">
        <v-icon color="primary">mdi-menu</v-icon></v-btn
      > -->
      <v-toolbar-title>{{ $t('app.nav.appointments') }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu
        class="shadow"
        offset-y
        transition="slide-x-reverse-transition"
        rounded="lg"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" text v-bind="attrs" v-on="on">
            <country-flag class="flag" :country="selectedFlag" size="small" />
            {{ selectedLocaleName }}
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group v-model="selectedLocale" color="primary">
            <v-list-item
              v-for="(item, i) in locales"
              :key="i"
              class="pl-0"
              @click="setLang(i)"
            >
              <country-flag class="flag" :country="item.flag" size="small" />
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-menu
        class="shadow"
        offset-y
        offset-x
        offset-overflow
        transition="slide-x-reverse-transition"
        rounded="lg"
        max-width="300px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            class="no-uppercase"
            text
            v-bind="attrs"
            max-width="300px"
            v-on="on"
          >
            <v-avatar class="mr-1" size="36px" color="red">
              <img
                src="https://randomuser.me/api/portraits/men/85.jpg"
                alt="alt"
              />
            </v-avatar>
            Luis Davalos Chaparro
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group v-model="selectedLocale" color="primary">
            <v-list-item
              v-for="(item, i) in profileOptions"
              :key="i"
              @click="item.action"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid class="px-0 px-md-3">
        <transition name="fade">
          <nuxt />
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  components: {
    CountryFlag,
  },
  middleware: 'auth',
  data() {
    return {
      always: true,
      drawer: false,
      touch: false,

      title: 'Dashboard',
      items: [
        {
          title: 'app.nav.appointments',
          icon: 'mdi-calendar',
          path: '/users/calendar',
        },
        {
          title: 'app.nav.foods',
          icon: 'mdi-food-apple',
          path: '/users/foods',
        },
      ],

      profileOptions: [
        { name: 'profile', icon: 'mdi-account', action: this.doNothing },
        {
          name: 'configuration',
          icon: 'mdi-hammer-wrench',
          action: this.doNothing,
        },
        { name: 'logout', icon: 'mdi-logout', action: this.logout },
      ],
      locales: [
        { name: 'English', flag: 'us', locale: 'en' },
        { name: 'Spanish', flag: 'es', locale: 'es' },
      ],
      selectedLocale: 0,
      selectedFlag: 'us',
      selectedLocaleName: 'English',
    }
  },

  computed: {
    mobile: {
      // getter
      get() {
        if (this.$vuetify.breakpoint.mdAndUp) {
          return true
        }
        return this.drawer
      },
      // setter
      set(newValue) {
        this.drawer = newValue
      },
    },
  },
  methods: {
    doNothing() {},
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({
          path: this.$i18n.path('/'),
        })
      })
    },
    setLang(index) {
      if (this.locales[index]) {
        const lang = this.locales[index].locale
        this.selectedFlag = this.locales[index].flag
        this.selectedLocaleName = this.locales[index].name
        this.$router.push({
          path: `${this.$route.path}?lang=${lang}`,
        })
      }
    },
  },
  language: 1,
}
</script>

<style lang="scss" scoped>
h4 {
  color: white;
  margin: 0;
  padding: 10px 0;
}
.v-menu__content {
  box-shadow: 1px 1px 6px rgba(27, 27, 27, 0.2);
}
.white-color {
  color: white;
}
.flag {
  margin-left: 0;
  padding-left: 0;
}
</style>
