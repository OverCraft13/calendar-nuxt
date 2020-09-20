<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="5">
        <v-card class="mx-auto card-shadow">
          <v-card-title>
            Main composition<v-subheader>(g)</v-subheader>
          </v-card-title>
          <ClientOnly>
            <apexchart
              type="pie"
              width="100%"
              :options="chartOptions"
              :series="mainStatistics"
            ></apexchart>
          </ClientOnly>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card class="mx-auto card-shadow">
          <v-card-title> Minerals<v-subheader>(mg)</v-subheader> </v-card-title>
          <v-card-text>
            <ClientOnly>
              <apexchart
                type="bar"
                :options="mineralCharOptions"
                :series="minerals"
              ></apexchart>
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  data() {
    return {
      mineralCharOptions: {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: ['sodium', 'potassium', 'calcium', 'phosphorus', 'iron'],
        },
        colors: ['#FB5B5D', '#FD880A', '#A58AFF', '#00C45D', '#00B8D2'],
      },

      chartOptions: {
        chart: {
          type: 'pie',
        },
        labels: ['water', 'protein', 'fat', 'carbohydrate', 'minerals'],
      },
    }
  },
  computed: {
    ...mapState('foods/', {
      food: (state) => state.food,
    }),
    mainStatistics() {
      return [
        this.food.water_g,
        this.food.protein_g,
        this.food.fat_g,
        this.food.carbohydrate_g,
        this.food.ash_g,
      ]
    },

    minerals() {
      return [
        {
          data: [
            this.food.sodium_mg,
            this.food.potassium_mg,
            this.food.calcium_mg,
            this.food.phosphorus_mg,
            this.food.iron_mg,
          ],
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped></style>
