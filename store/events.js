import EventService from '@/services/EventService.js'
export const state = () => ({
  events: [],
  from: null,
  until: null,
  startYear: null,
  startMonth: null,
  endYear: null,
  endMonth: null,
  startDay: null,
  endDay: null,
})

export const mutations = {
  SET_EVENTS(state, events) {
    if (events) {
      state.events = events
    }
  },
  ADD_EVENT(state, event) {
    if (event) {
      state.events.push(event)
    }
  },
  DELETE_EVENT(state, eventId) {
    state.events = state.events.filter((event) => {
      return event._id !== eventId
    })
  },
  UPDATE_EVENT(state, event) {
    if (event) {
      const index = state.events.findIndex((e) => {
        return e._id === event._id
      })
      if (index > -1) {
        state.events[index].name = event.name
        state.events[index].start = event.start
        state.events[index].end = event.end
        state.events[index].startDate = event.startDate
        state.events[index].endDate = event.endDate

        state.events[index].startTime.hour = event.startTime.hour
        state.events[index].startTime.minute = event.startTime.minute
        state.events[index].startTime.dayInterval = event.startTime.dayInterval
        state.events[index].endTime.hour = event.endTime.hour
        state.events[index].endTime.minute = event.endTime.minute
        state.events[index].endTime.dayInterval = event.endTime.dayInterval
      }
    }
  },
  SET_RANGE(
    state,
    { from, until, startYear, startMonth, endYear, endMonth, startDay, endDay }
  ) {
    state.from = from
    state.until = until
    state.startYear = startYear
    state.startMonth = startMonth
    state.endYear = endYear
    state.endMonth = endMonth
    state.startDay = startDay
    state.endDay = endDay
  },
}

export const actions = {
  fetchEvents({ commit, state }) {
    return EventService.index(state.from, state.until)
      .then((response) => {
        response.data.events.map((event) => {
          const start = new Date(event.start)
          const end = new Date(event.end)

          event.startDate = getFormatedDateString(
            start.getFullYear(),
            start.getMonth(),
            start.getDate()
          )
          event.start = getFormatedDateTimeString(
            start.getFullYear(),
            start.getMonth(),
            start.getDate(),
            start.getHours(),
            start.getMinutes()
          )
          event.startTime = getTimeObject(start.getHours(), start.getMinutes())

          event.endDate = getFormatedDateString(
            end.getFullYear(),
            end.getMonth(),
            end.getDate()
          )
          event.end = getFormatedDateTimeString(
            end.getFullYear(),
            end.getMonth(),
            end.getDate(),
            end.getHours(),
            end.getMinutes()
          )
          event.endTime = getTimeObject(end.getHours(), end.getMinutes())
          return event
        })
        commit('SET_EVENTS', response.data.events)
      })
      .catch((error) => {
        throw error
      })
  },

  createEvent({ commit }, event) {
    return EventService.store(event)
      .then((response) => {
        event._id = response.data.event._id
        commit('ADD_EVENT', event)
      })
      .catch((err) => {
        throw err
      })
  },
  updateEvent({ commit }, { eventId, update, event }) {
    return EventService.patch(eventId, update)
      .then((response) => {
        commit('UPDATE_EVENT', event)
      })
      .catch((err) => {
        throw err
      })
  },
  deleteEvent({ commit }, eventId) {
    return EventService.delete(eventId)
      .then(() => {
        commit('DELETE_EVENT', eventId)
      })
      .catch((err) => {
        throw err
      })
  },
}
function getFormatedDateTimeString(year, month, day, hour, minute) {
  month = month < 9 ? '0' + (month + 1) : month + 1
  day = day < 10 ? '0' + day : day
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute

  return `${year}-${month}-${day}T${hour}:${minute}`
}

function getFormatedDateString(year, month, day) {
  month = month < 9 ? '0' + (month + 1) : month + 1
  day = day < 10 ? '0' + day : day

  return `${year}-${month}-${day}`
}

function getTimeObject(hour, minute) {
  let interval = 'AM'
  if (hour > 12) {
    hour = hour - 12
    interval = 'PM'
  }

  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  return {
    hour,
    minute,
    dayInterval: interval,
  }
}
