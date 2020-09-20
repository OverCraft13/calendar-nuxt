<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          min="2020-01-01"
          max="2200-01-01"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="changeDate">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="4" md="2">
      <v-select v-model="time.hour" :items="hours" label="hh"></v-select>
    </v-col>
    <v-col cols="4" md="2">
      <v-select v-model="time.minute" :items="minutes" label="mm"></v-select>
    </v-col>
    <v-col cols="4" md="2">
      <v-select
        v-model="time.dayInterval"
        :items="dayIntervals"
        append-icon="mdi-weather-sunny"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
const hours = []
for (let i = 1; i <= 12; i++) {
  hours.push(i < 10 ? '0' + i : i)
}
const minutes = []
for (let i = 0; i <= 59; i++) {
  minutes.push(i < 10 ? '0' + i : i)
}
export default {
  props: {
    date: {
      type: String,
      default: '',
    },
    time: {
      type: Object,
      default() {
        return {
          hour: '',
          minute: '',
          dayInterval: '',
        }
      },
    },
    updateMethod: {
      type: String,
      default: 'updateDate',
    },
  },
  data: () => ({
    menu: false,
    hours,
    minutes,
    dayIntervals: ['AM', 'PM'],
  }),
  methods: {
    changeDate() {
      this.$emit(this.updateMethod, this.date)
      this.$refs.menu.save(this.date)
    },
  },
}
</script>

<style lang="scss" scoped></style>
