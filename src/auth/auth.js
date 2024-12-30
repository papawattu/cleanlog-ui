// Auth module

export default function auth({ pb }) {
  let currentUser = null
  return {
    getUser: () => {
      if (currentUser) {
        return Promise.resolve(currentUser)
      }
      return new Promise((resolve, reject) => {
        pb.collection('users')
          .authWithOAuth2({ provider: 'google' })
          .then((user) => {
            const {
              meta: { avatarUrl: avatar },
              record: { id, name, email },
            } = user
            currentUser = { id, name, email, avatar }
            resolve(currentUser)
          })
      })
    },
  }
}
