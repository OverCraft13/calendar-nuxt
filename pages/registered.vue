<template>
  <v-container fill-height>
    <v-row class="text-center mb-15">
      <v-col cols="12">
        <h3>Account created</h3>
        <h3>An activation email has been send to your account</h3>
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'auth',

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(this.redirect, 2000)
    })
  },
  methods: {
    redirect() {
      this.$nuxt.$loading.finish()
      this.$router.push({
        path: this.$i18n.path('/users/dashboard'),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
h3,
h4 {
  color: white;
}
.spinner {
  width: 50px;
  height: 50px;

  position: relative;
  margin: 50px auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: white;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
