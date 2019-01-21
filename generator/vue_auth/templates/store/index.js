import actions from './actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import forgotPasswordModule from './forgotPasswordModule'
import resetPasswordModule from './resetPasswordModule'
const namespaced = true

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters,
  modules: {
    forgot_password: forgotPasswordModule,
    reset_password: resetPasswordModule
  }
}
