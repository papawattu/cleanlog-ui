import Store from './store'

export default function ({ user, store = Store() }) {
  const { create } = store
  console.log('user is', user)

  return {
    createWorkLog: async ({ date, hours }) => {
      return create({ date, hours, user })
    },
    getWorkLogs: async (filter) => {
      return store.readAll(filter)
    },
    registerChangeListener: (callback) => {
      store.registerChangeListener(callback)
    },
  }
}
