import uniqueId from 'lodash/uniqueId'

// // // //

// removeToast
// Helper function used to remove a toast from state.collection
function removeToast (collection, id) {
  return collection.filter(e => e.id !== id)
}

// // // //

// Toast Module mutations
export default {
  // Adds a toast to state.collection
  add (state, toast) {
    // Assigns unique ID to toast
    // this is used for removing the toast after a timeout
    let uniqueId = uniqueId()
    toast.id = uniqueId

    // Adds the toast to state.collection
    state.collection.push(toast)

    // Removes the toast after
    setTimeout(() => {
      state.collection = removeToast(state.collection, uniqueId)
    }, toast.timeout || 2500)
  },

  // Removes a Toast from state.collection
  remove (state, toastId) {
    state.collection = removeToast(state.collection, toastId)
  }
}
