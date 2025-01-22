import Store from './store'

export default function ({ user, store = Store() }) {
  const { create } = store

  return {
    createWorkLog: async ({ date, hours }) => {
      return create({ date, hours, user })
    },
    getWorkLogs: async (filter) => {
      return store.readAll(filter)
    },
    deleteWorkLog: async ({ date }) => {
      console.log(`${date} ${user}`)
      const worklog = await store.readAll(
        `user = "${user}" && date = "${
          date.toISOString().split('T')[0]
        } 00:00:00.000Z"`
      )
      console.log(worklog[0])
      return store.delete(worklog[0].id)
    },
    registerChangeListener: (callback) => {
      store.registerChangeListener(callback)
    },
  }
}
