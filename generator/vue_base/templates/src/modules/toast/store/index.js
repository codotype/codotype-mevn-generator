import uniqueId from 'lodash/uniqueId'

// removeToast
// Helper function used to remove a toast from state.collection
function removeToast (collection, id) {
  return collection.filter(e => e.id !== id)
}

export default {
  namespaced: true,
  state: {
    collection: [
      // Notification examples:
      // { dismissible: true, strong: 'Warning', message: 'Something went wrong.', context: 'warning' },
      // { dismissible: true, strong: 'Info', message: 'Something went wrong.', context: 'info' },
      // { dismissible: true, strong: 'Danger!', message: 'Something went wrong.', context: 'danger' }
    ]
  },
  getters: {
    collection: state => {
      return state.collection
    }
  },
  mutations: {
    // Adds a toast to state.collection
    add (state, toast) {
      // Assigns unique ID to toast
      // this is used for removing the toast after a timeout
      let toastId = uniqueId()
      toast.id = toastId

      // Adds the toast to state.collection
      state.collection.push(toast)

      // Removes the toast after
      setTimeout(() => {
        state.collection = removeToast(state.collection, toastId)
      }, toast.timeout || 2500)
    },

    // Removes a Toast from state.collection
    remove (state, toastId) {
      state.collection = removeToast(state.collection, toastId)
    }
  }
}
