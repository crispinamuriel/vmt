/* eslint-disable no-unused-vars */
import { max } from 'd3';
import moment from 'moment';
import { processData, dateFormatMap } from './stats.utils';

export const initialState = {
  byUser: false,
  byEvent: false,
  users: [],
  events: [],
  messages: [],
  actions: [],
  lines: [],
  data: [],
  timeScale: null,
  min: 0,
  maxY: 0,
  startDateF: '',
  endDateF: '',
  startTime: 0,
  currentStartTime: 0,
  endTime: 0,
  currentEndTime: 0,
  units: '',
  durationDisplay: 0,
  rawDuration: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GENERATE_DATA': {
      const { data } = action;
      const { users, events } = state;
      const start = data[0].timestamp;
      const end = data[data.length - 1].timestamp;
      const rawDuration = end - start;
      const { lines, timeScale, units } = processData(
        data,
        { users, events },
        { start, end }
      );
      const maxY = max(lines[0].data, d => d[1]);
      console.log({ rawDuration });
      const durationDisplay = rawDuration / 1000 / timeScale;
      return {
        ...state,
        lines,
        timeScale,
        units,
        maxY,
        data,
        rawDuration,
        durationDisplay,
        startDateF: moment.unix(start / 1000).format(dateFormatMap[units]),
        endDateF: moment.unix(end / 1000).format(dateFormatMap[units]),
        startTime: start,
        currentStartTime: start,
        endTime: end,
        currentEndTime: end,
      };
    }

    case 'ADD_REMOVE_FILTER': {
      let updatedFiltersArr;
      const { filterType, payload } = action;
      const { data, users, events, currentStartTime, currentEndTime } = state;
      let { messages, actions } = { ...state };
      if (payload === 'ALL') {
        updatedFiltersArr = [];
      } else if (state[filterType].indexOf(payload) > -1) {
        updatedFiltersArr = state[filterType].filter(u => u !== payload);
      } else {
        updatedFiltersArr = [...state[filterType], payload];
      }
      if (filterType === 'events') {
        if (payload === 'MESSAGES') {
          messages = [];
        } else if (payload === 'ACTIONS') {
          actions = [];
        }
      }
      const { lines } = processData(
        data,
        {
          users,
          events,
          messages,
          actions,
          [filterType]: updatedFiltersArr,
        },
        { start: currentStartTime, end: currentEndTime }
      );
      return {
        ...state,
        users,
        events,
        messages,
        actions,
        [filterType]: updatedFiltersArr,
        lines,
      };
    }

    case 'UPDATE_TIME': {
      const {
        payload: { id, percent },
      } = action;
      const {
        rawDuration,
        currentStartTime,
        currentEndTime,
        startTime,
        endTime,
        data,
        users,
        events,
        actions,
        messages,
        timeScale,
        maxY,
      } = state;
      let newStartTime = currentStartTime;
      let newEndTime = currentEndTime;
      let newMaxY = maxY;
      let startOffset = 0;
      let endOffset = 0;
      if (id === 'start') {
        console.log({ percent, rawDuration });
        startOffset = percent * rawDuration;
        newStartTime = startTime + startOffset;
      }
      if (id === 'end') {
        endOffset = (1 - percent) * rawDuration;
        newEndTime = endTime - endOffset;
        console.log({ newEndTime });
      }
      const { lines, timeScale: newTimeScale, units, start, end } = processData(
        data,
        {
          users,
          events,
          actions,
          messages,
        },
        { start: newStartTime, end: newEndTime }
      );
      const newDuration = newEndTime - newStartTime;
      const durationDisplay = newDuration / 1000 / newTimeScale;

      // if (newTimeScale !== timeScale) {
      let oldMaxY = 0;
      lines.forEach(l => {
        const candidateMaxY = max(l.data, d => d[1]);
        if (candidateMaxY > oldMaxY) {
          newMaxY = candidateMaxY;
          oldMaxY = newMaxY;
        }
      });
      // }
      return {
        ...state,
        lines,
        units,
        durationDisplay,
        maxY: newMaxY,
        timeScale: newTimeScale,
        currentStartTime: start,
        currentEndTime: end,
        startDateF: moment
          .unix(newStartTime / 1000)
          .format(dateFormatMap[units]),
        endDateF: moment.unix(newEndTime / 1000).format(dateFormatMap[units]),
      };
    }

    default:
      return state;
  }
};
