<template>
  <v-container fluid class="px-0 px-md-3">
    <v-toolbar class="ml-0" flat color="white">
      <v-btn fab text color="primary" :to="$i18n.path('/users/foods')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <div class="mr-4 ml-2">
        <v-icon color="primary">mdi-chevron-right</v-icon>
      </div>

      <div>
        {{ selectedFood.name }}
      </div>
    </v-toolbar>

    <FoodStatistics />
  </v-container>
</template>

<script>
import FoodStatistics from '@/components/FoodStatistics.vue'

export default {
  layout: 'userLayout',
  components: {
    FoodStatistics,
  },
  async fetch({ store, route, error }) {
    try {
      await store.dispatch('foods/fetchFood', route.params.id)
    } catch (err) {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('bad  request')
        error({
          statusCode: 404,
          message: 'the resource that you are looking for does not exist',
        })
      } else {
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    selectedFood() {
      return this.$store.state.foods.food
    },
  },
}
</script>

<style lang="scss" scoped></style>
