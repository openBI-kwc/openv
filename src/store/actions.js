import * as types from './mutation-types'
export default {
  UPDATE_POSITION({commit}, data) {
    commit(types['UPDATE_POSITION'], data)
  },
  SET_PERMISSION_ROUTING({commit}, data) {
    commit(types['SET_PERMISSION_ROUTING'], data)
  },
  SET_SYS_MENU({commit}, data) {
    commit(types['SET_SYS_MENU'], data)
  },
  PUSH_POSITION({commit}, data) {
    commit(types['PUSH_POSITION'], data)
  },
  SET_CHART_INDEX({commit}, data) {
    commit(types['SET_CHART_INDEX'], data)
  },
  SET_CHART_INDEX_LIST({commit}, data) {
    commit(types['SET_CHART_INDEX_LIST'], data)
  },
  REMOVE_POSITION({commit}, data) {
    commit(types['REMOVE_POSITION'], data)
  },
  SET_CONFIG({commit}, data) {
    commit(types['SET_CONFIG'], data)
  },
  COPY_POSITION({commit}, data) {
    commit(types['COPY_POSITION'], data)
  },
  SET_SCREEN_OPTION({commit}, data) {
    commit(types['SET_SCREEN_OPTION'], data)
  },
  SET_USER_INFO({commit}, data) {
    commit(types['SET_USER_INFO'], data)
  },
  CLEAR_SCREEN_OPTION({commit}, data) {
    commit(types['CLEAR_SCREEN_OPTION'])
  },
  SET_SYSTEM_SETTING({commit}, data) {
    commit(types['SET_SYSTEM_SETTING'], data)
  },
  SET_SYSTEM_INFO({commit}, data) {
    commit(types['SET_SYSTEM_INFO'], data)
  },
  SET_CHART_LOADING({commit}, data) {
    commit(types['SET_CHART_LOADING'], data)
  },
  CLEAR_ALL_INFO({commit}, data) {
    commit(types['CLEAR_ALL_INFO'])
  },
  SET_LAYER({commit}, data) {
    commit(types['SET_LAYER'], data)
  },
  SET_POSITION_LIST({commit}, data) {
    commit(types['SET_POSITION_LIST'], data)
  },
  SET_SCREEN_MOVE({commit}, data) {
    commit(types['SET_SCREEN_MOVE'], data)
  }
}
