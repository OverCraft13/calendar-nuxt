<template>
  <v-card class="card-shadow px-6 py-6">
    <v-sheet height="64">
      <v-toolbar flat color="white">
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        :key="calendarKey"
        v-model="focus"
        color="primary"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        locale="en"
        @change="updateRange"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @click:time="setDate"
        @click:day="setDateMonth"
      >
      </v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
        max-width="500px"
      >
        <v-card color="grey lighten-4" min-width="350px" max-width="500px" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title> {{ selectedEvent.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="deleteEvent">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <ValidationObserver ref="updateObserver">
              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                rules="required|min:1|max:30|safeText"
              >
                <v-text-field
                  v-model="selectedEvent.name"
                  :error-messages="errors"
                  name="name"
                  label="Name"
                ></v-text-field>
              </ValidationProvider>
              Start date and time
              <DateTimePicker
                :date="selectedEvent.startDate"
                :time="selectedEvent.startTime"
                update-method="updateSelectedEventStart"
                @updateSelectedEventStart="changeSelectedEventStart"
              />
              Start date and time
              <DateTimePicker
                :date="selectedEvent.endDate"
                :time="selectedEvent.endTime"
                update-method="updateSelectedEventEnd"
                @updateSelectedEventEnd="changeSelectedEventEnd"
              />
              <div v-if="eventSpanError" style="color: #f3625d">
                the event cannot end before it starts
              </div>
              <ValidationProvider
                v-slot="{ errors }"
                name="details"
                rules="max:200|safeText"
              >
                <v-textarea
                  v-model="selectedEvent.details"
                  name="details"
                  :error-messages="errors"
                  label="Event details"
                  rows="3"
                ></v-textarea>
              </ValidationProvider>
            </ValidationObserver>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="cancelEventUpdate">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="updateEvent"> Ok </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
    <v-dialog v-model="dialog" persistent max-width="650px">
      <v-card class="px-3 py-1">
        <v-card-title>
          <span class="headline">Create event</span>
        </v-card-title>
        <ValidationObserver ref="observer">
          <v-card-text>
            <v-row>
              <v-col>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="name"
                  rules="required|min:1|max:30|safeText"
                >
                  <v-text-field
                    v-model="event.name"
                    :error-messages="errors"
                    maxlength="50"
                    name="name"
                    label="Name"
                  >
                    <template slot="prepend">
                      <v-icon>mdi-tag-multiple-outline</v-icon>
                    </template>
                  </v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="my-0 py-0">
                Start date and time
                <DateTimePicker
                  :key="startKey"
                  :date="event.startDate"
                  :time="event.startTime"
                  update-method="updateStartDate"
                  @updateStartDate="changeStartDate"
                />
                <div v-if="eventStartDateError" style="color: #f3625d">
                  the event start date and time is required
                </div>
              </v-col>
            </v-row>
            <v-row class="my-0 py-0">
              <v-col>
                End date and time
                <DateTimePicker
                  :key="endKey"
                  :date="event.endDate"
                  :time="event.endTime"
                  update-method="updateEndDate"
                  @updateEndDate="changeEndDate"
                >
                </DateTimePicker>
                <div v-if="eventEndDateError" style="color: #f3625d">
                  the event end date and time is required
                </div>
                <div v-else-if="eventSpanError" style="color: #f3625d">
                  the event cannot end before it starts
                </div>
              </v-col>
            </v-row>
            <ValidationProvider
              v-slot="{ errors }"
              name="details"
              rules="max:200|safeText"
            >
              <v-textarea
                v-model="event.details"
                name="details"
                :error-messages="errors"
                label="Details"
                rows="3"
              ></v-textarea>
            </ValidationProvider>
          </v-card-text>
        </ValidationObserver>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text right @click="dialog = false"
            >Close</v-btn
          >
          <v-btn color="primary" text right @click="saveEvent">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      elevation="24"
      :timeout="3000"
      :right="$vuetify.breakpoint.lgAndUp"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
/* eslint-disable no-console */
import DateTimePicker from '@/components/DateTimePicker.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
async function fetchEvents(store, router) {
  try {
    await store.dispatch('events/fetchEvents')
  } catch (err) {
    if (err.response.status === 401) {
      store.dispatch('logout')
      router.push({
        path: '/',
      })
    } else {
      console.log(err)
    }
  }
}
function createFreshObjectEvent() {
  return {
    name: '',
    startDate: null,
    endDate: null,
    startTime: {},
    endTime: {},
    details: '',
    color: '',
  }
}
function isValidDate(d) {
  return d instanceof Date && !isNaN(d)
}
function setDateTimeString(event) {
  let startHour = Number(event.startTime.hour)

  if (startHour === 12 && event.startTime.dayInterval === 'AM') {
    startHour = '00'
  } else if (startHour === 12 && event.startTime.dayInterval === 'PM') {
    startHour = '12'
  } else {
    startHour =
      event.startTime.dayInterval === 'PM' ? startHour + 12 : startHour // 24 hour convertion
    startHour = startHour < 10 ? '0' + startHour : startHour // 2 digit
  }
  let endHour = Number(event.endTime.hour)

  if (endHour === 12 && event.endTime.dayInterval === 'AM') {
    endHour = '00'
  } else if (endHour === 12 && event.endTime.dayInterval === 'PM') {
    endHour = '12'
  } else {
    endHour = event.endTime.dayInterval === 'PM' ? endHour + 12 : endHour // 24 hour
    endHour = endHour < 10 ? '0' + endHour : endHour // 2 digit
  }
  event.start = `${event.startDate}T${startHour}:${event.startTime.minute}`
  event.end = `${event.endDate}T${endHour}:${event.endTime.minute}`
}

function validDatesForEvent(event, app) {
  setDateTimeString(event)
  const start = new Date(event.start)
  const end = new Date(event.end)
  if (isValidDate(start)) {
    if (isValidDate(end)) {
      if (end > start) {
        return true
      } else {
        app.eventSpanError = true
      }
    } else {
      app.eventEndDateError = true
    }
  } else {
    app.eventStartDateError = true
  }
  return false
}

export default {
  components: {
    DateTimePicker,
    ValidationProvider,
    ValidationObserver,
  },
  layout: 'userLayout',
  data: () => ({
    snackbarText: '',
    snackbar: false,
    snackbarColor: 'primary',
    eventSpanError: false,
    eventStartDateError: false,
    eventEndDateError: false,
    startKey: 0,
    endKey: 0,
    calendarKey: 0,
    dialog: false,
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    colors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1',
    ],
    names: [
      'Meeting',
      'Holiday',
      'PTO',
      'Travel',
      'Event',
      'Birthday',
      'Conference',
      'Party',
    ],
    event: createFreshObjectEvent(),
    selectedEventReference: null,
  }),
  computed: {
    events() {
      return this.$store.state.events.events
    },
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    saveEvent() {
      this.$refs.observer.validate().then((result) => {
        if (result) {
          this.clearDateErrors()
          setDateTimeString(this.event)
          this.event.color = '#00949C'
          if (validDatesForEvent(this.event, this)) {
            this.$store
              .dispatch('events/createEvent', this.event)
              .then(() => {
                this.event = createFreshObjectEvent()
                this.$refs.observer.reset()
                this.snackbarText = 'Event created successfully'
                this.snackbarColor = 'success'
                this.snackbar = true
              })
              .catch((err) => {
                if (err) {
                  this.snackbarText = 'Something went wrong'
                  this.snackbarColor = 'danger'
                  this.snackbar = true
                }
              })
            this.dialog = false
          }
          if (!result) {
            console.log('Invalid form , vee validate')
          }
        }
      })
    },

    cancelEventUpdate() {
      this.selectedOpen = false
      this.selectedEvent = JSON.parse(
        JSON.stringify(this.selectedEventReference)
      )
    },

    updateEvent() {
      this.$refs.updateObserver.validate().then((result) => {
        if (result) {
          const update = {}
          let changed = false
          if (this.selectedEvent.name !== this.selectedEventReference.name) {
            update.name = this.selectedEvent.name
            changed = true
          }
          if (
            this.selectedEvent.startDate !==
              this.selectedEventReference.startDate ||
            this.selectedEvent.endDate !==
              this.selectedEventReference.endDate ||
            this.selectedEvent.startTime.hour !==
              this.selectedEventReference.startTime.hour ||
            this.selectedEvent.startTime.minute !==
              this.selectedEventReference.startTime.minute ||
            this.selectedEvent.startTime.dayInterval !==
              this.selectedEventReference.startTime.dayInterval ||
            this.selectedEvent.endTime.hour !==
              this.selectedEventReference.endTime.hour ||
            this.selectedEvent.endTime.minute !==
              this.selectedEventReference.endTime.minute ||
            this.selectedEvent.endTime.dayInterval !==
              this.selectedEventReference.endTime.dayInterval
          ) {
            if (validDatesForEvent(this.selectedEvent, this)) {
              update.start = this.selectedEvent.start
              update.end = this.selectedEvent.end
              changed = true
            } else {
              console.log('invalid dates')
              return
            }
          }
          if (
            this.selectedEvent.details !== this.selectedEventReference.details
          ) {
            update.details = this.selectedEvent.details
            changed = true
          }
          if (changed) {
            console.log(update)
            this.$store
              .dispatch('events/updateEvent', {
                eventId: this.selectedEvent._id,
                update,
                event: this.selectedEvent,
              })
              .then(() => {
                this.snackbarText = 'Event updated successfully'
                this.snackbarColor = 'success'
                this.snackbar = true
              })
              .catch((err) => {
                if (err.response.status === 404) {
                  this.snackbarText = 'The event does not exist'
                } else {
                  this.snackbarText = 'Something went wrong'
                }
                this.snackbarColor = 'danger'
                this.snackbar = true
              })
          }
          this.selectedOpen = false
        }
      })
    },

    changeStartDate(date) {
      this.event.startDate = date
    },
    changeEndDate(date) {
      this.event.endDate = date
    },
    changeSelectedEventStart(date) {
      this.selectedEvent.startDate = date
    },
    changeSelectedEventEnd(date) {
      this.selectedEvent.endDate = date
    },
    setDateMonth(e) {
      this.clearDateErrors()
      this.dialog = true
      this.event.startDate = e.date
      this.event.endDate = e.date
      this.event.startTime.dayInterval = 'PM'
      this.event.endTime.dayInterval = 'PM'
    },
    setDate(e) {
      this.clearDateErrors()
      this.dialog = true
      console.log(e.hour)

      this.event.startTime.dayInterval = 'AM'
      this.event.endTime.dayInterval = 'AM'
      if (e.hour === 0) {
        e.hour = 12
        this.event.startTime.dayInterval = 'AM'
        this.event.endTime.dayInterval = 'AM'
      } else if (e.hour > 12) {
        e.hour = e.hour - 12
        this.event.startTime.dayInterval = 'PM'
        this.event.endTime.dayInterval = 'PM'
      }

      if (e.minute) {
        this.event.startTime.minute = e.minute < 10 ? '0' + e.minute : e.minute
        this.event.endTime.minute = this.event.startTime.minute
      }
      if (e.hour) {
        this.event.startTime.hour = e.hour < 10 ? '0' + e.hour : e.hour
        this.event.endTime.hour = this.event.startTime.hour
      }

      this.event.startDate = e.date
      this.event.endDate = e.date

      this.endKey++
      this.startKey++
    },
    clearDateErrors() {
      this.eventSpanError = false
      this.eventStartDateError = false
      this.eventEndDateError = false
    },
    deleteEvent() {
      console.log(this.selectedEvent._id)
      this.$store
        .dispatch('events/deleteEvent', this.selectedEvent._id)
        .then(() => {
          this.selectedOpen = false
          this.snackbarText = 'Event deleted successfully'
          this.snackbarColor = 'success'
          this.snackbar = true
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.snackbarText = 'The event does not exist'
          } else {
            this.snackbarText = 'Something went wrong'
          }
          this.snackbarColor = 'danger'
          this.snackbar = true
        })
    },
    updateRange({ start, end }) {
      console.log(start)
      console.log(end)
      if (
        start.year !== this.$store.state.events.startYear ||
        start.month !== this.$store.state.events.startMonth ||
        end.year !== this.$store.state.events.endYear ||
        end.month !== this.$store.state.events.endMonth ||
        start.day < this.$store.state.events.startDay ||
        end.day > this.$store.state.events.endDay
      ) {
        this.$store.commit('events/SET_RANGE', {
          from: `${start.date}T00:00`,
          until: `${end.date}T23:59`,
          startYear: start.year,
          startMonth: start.month,
          endYear: end.year,
          endMonth: end.month,
          startDay: start.day,
          endDay: end.day,
        })
        fetchEvents(this.$store, this.$router)
      }
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },

    getEventColor(event) {
      return event.color
    },

    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEventReference = event
        this.selectedEvent = JSON.parse(JSON.stringify(event))
        console.log(event)
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
  },
}
</script>
<style lang="scss" scoped></style>
