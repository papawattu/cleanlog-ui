export default ({ entity = new Map(), currentId = 0 } = {}) => ({
  create: (value) =>
    new Promise((resolve, reject) => {
      entity.set(currentId, value)
      resolve({ id: currentId++ })
    }),
  read: (key) => new Promise((resolve, reject) => resolve(entity.get(key))),
  readAll: () => {
    console.log(entity)
    return new Promise((resolve, reject) => resolve([...entity.values()]))
  },
  update: (key, value) => {
    if (!entity.has(key)) {
      return new Promise((resolve, reject) =>
        reject(new Error('Key does not exist'))
      )
    }
    return new Promise((resolve, reject) => {
      entity.set(key, value)
      resolve(key)
    })
  },
  delete: (key) => {
    return new Promise((resolve, reject) => {
      entity.delete(key)
      if (!entity.has(key)) {
        resolve()
      } else {
        reject(new Error('Key still exists'))
      }
    })
  },
})
