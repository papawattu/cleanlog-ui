export default function CreateUserService({ users = [] } = {}) {
  return {
    findUser: async (username) => {
      return Promise.resolve(users.find((user) => user.username === username))
    },
    validatePassword: async (user, password) => {
      console.log('User ' + JSON.stringify(user))
      return Promise.resolve(user.password === password)
    },
  }
}
