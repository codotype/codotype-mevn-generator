export default function configureModerator (store, router) {
  // listen to mutations
  store.subscribe(({ type }) => {
    switch (type) {
      case 'auth/logged_in': return router.push('/')
    }
  })
  // listen to actions
  // note: doesn't not wait for the result of async actions
  store.subscribeAction(({ type }) => {
    switch (type) {
      case 'auth/signOut': return router.push('/')
    }
  })
}
