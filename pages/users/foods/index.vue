<template>
  <v-container fluid class="px-0 px-md-3">
    <v-card class="card-shadow px-4">
      <v-card-title>
        <v-row no-gutters class="mt-2">
          <v-col cols="4" md="2"> Foods </v-col>
          <v-col cols="8" md="6">
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-md-9"
              single-line
              hide-details
              clearable
              @keydown.enter="appFetchFoods"
              @blur="appFetchFoods"
              @click:clear="searchCleared"
            >
              <template v-if="!search" v-slot:append>
                <v-icon>mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="foodGroup"
              :items="categories.names"
              clearable
              label="Food group"
              @change="appFetchFoods"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        loading-text=""
        :items="foods"
        :search="search"
        :options.sync="options"
        :server-items-length="totalFoods"
        :footer-props="{
          showFirstLastPage: true,
          showCurrentPage: true,
          'items-per-page-options': [10, 15, 20],
        }"
        @click:row="setFood"
      >
        <template v-slot:item.energy_kcal="{ item }">
          <v-chip :color="getColor(item.energy_kcal)" dark>{{
            item.energy_kcal
          }}</v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
/* eslint-disable no-console */

async function fetchFoods(store, app) {
  let from = 0
  let limit = 10
  let foodGroup = ''
  let name = ''

  const { page, itemsPerPage } = app.options
  from = (page - 1) * itemsPerPage
  limit = itemsPerPage
  const group = app.foodGroup
  foodGroup = app.categories[group]
  name = app.search
  if (name) {
    from = 0
  }
  try {
    await store.dispatch('foods/fetchFoods', { from, limit, foodGroup, name })
    app.loading = false
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

export default {
  layout: 'userLayout',
  components: {},
  data() {
    return {
      loading: true,
      categories: {
        names: ['Fruits', 'Vegetables'],
        Fruits: 'fruits and fruit products',
        Vegetables: 'vegetables and vegetable products',
      },
      foodGroup: '',
      limit: 10,
      selectedFood: {
        name: '',
        calories: 0,
      },
      pagination: {
        rowsPerPageItems: 12,
        totalItems: 36,
      },
      options: {},
      search: '',
      headers: [
        {
          text: 'Foods (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories (kcal)', value: 'energy_kcal', sortable: false },
        { text: 'Fat (g)', value: 'fat_g', sortable: false },
        { text: 'Carbs (g)', value: 'carbohydrate_g', sortable: false },
        { text: 'Protein (g)', value: 'protein_g', sortable: false },
        { text: 'Iron (mg)', value: 'iron_mg', sortable: false },
      ],
    }
  },
  computed: {
    foods() {
      return this.$store.state.foods.foods
    },
    totalFoods() {
      return this.$store.state.foods.totalCount
    },
  },
  watch: {
    options: {
      handler() {
        fetchFoods(this.$store, this)
      },
    },
  },
  methods: {
    searchCleared() {
      this.search = ''
      fetchFoods(this.$store, this)
    },
    setFood(event) {
      this.selectedFood.name = event.name
      this.selectedFood.id = event._id
      this.$router.push({
        path: this.$i18n.path(`/users/foods/${this.selectedFood.id}`),
      })
    },
    appFetchFoods() {
      fetchFoods(this.$store, this)
    },
    getColor(calories) {
      if (calories > 200) return 'red'
      else if (calories > 100) return 'orange'
      else return 'green'
    },
  },
}
</script>

<style lang="scss" scoped></style>
