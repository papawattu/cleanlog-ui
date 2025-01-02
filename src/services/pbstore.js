import PocketBase from 'pocketbase'

export default ({ entity, pb = new PocketBase() }) => {
  return {
    create: (data) => {
      return new Promise((resolve, reject) => {
        pb.collection(entity)
          .create(data)
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    read: (key) => {
      return new Promise((resolve, reject) => {
        pb.collection(entity)
          .getOne(key)
          .then((data) => {
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    readAll: (filter) => {
      return new Promise((resolve, reject) => {
        pb.collection(entity)
          .getFullList({ filter })
          .then((data) => {
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    update: (key, data) => {
      return new Promise((resolve, reject) => {
        pb.collection(entity)
          .update(key, data)
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    delete: (key) => {
      return new Promise((resolve, reject) => {
        pb.collection(entity)
          .delete(key)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    registerChangeListener: (callback) => {
      pb.collection(entity).subscribe(
        '*',
        function (e) {
          callback(e)
        },
        {
          /* other options like expand, custom headers, etc. */
        }
      )
    },
  }
}
