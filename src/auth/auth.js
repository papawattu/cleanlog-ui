// Auth module

export default function auth({ pb }) {
  let currentUser = null
  const loginUser = () =>
    new Promise(async (resolve, reject) => {
      if (!currentUser) {
        console.log('logging in')
        console.trace()
        const user = await pb
          .collection('users')
          .authWithOAuth2({ provider: 'google' })
        const {
          meta: { avatarUrl: avatar },
          record: { id, name, email },
        } = user
        currentUser = { id, name, email, avatar }
        return resolve(currentUser)
      }
      return resolve(currentUser)
    })
  return {
    loginUser,
    getUser: () => (currentUser ? currentUser : loginUser()),
  }
}
