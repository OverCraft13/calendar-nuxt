<template>
  <v-app>
    <v-main class="color">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.color {
  overflow: hidden;
  background-image: linear-gradient(
    to right top,
    #1259a6,
    #396bb5,
    #557ec4,
    #6d92d4,
    #85a6e3,
    #90b5eb,
    #9dc4f3,
    #acd3fa,
    #b7dffa,
    #c7e9fb,
    #daf3fc,
    #eefcff
  );

  // background-image: url('../assets/img/background.jpg');
  // background-repeat: no-repeat;
  // background-attachment: fixed;
  // background-size: cover;
}
</style>
