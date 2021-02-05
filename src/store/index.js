import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
const isproduction = process.env.NODE_ENV === 'production'
const plugins = isproduction ? [] : [createLogger()]
Vue.use(Vuex)
export default new Vuex.Store({
  mutations,
  state,
  getters,
  actions,
  // plugins
})
