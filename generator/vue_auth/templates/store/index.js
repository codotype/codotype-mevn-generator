import actions from './actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import resetModule from './resetModule'
import resetPasswordModule from './resetPasswordModule'
const namespaced = true

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters,
  modules: {
    reset: resetModule,
    reset_password: resetPasswordModule
  }
}
