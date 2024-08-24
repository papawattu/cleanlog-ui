import CreateLoginAuthService from './loginService'

describe('loginService', () => {
  const findUser = (username) =>
    Promise.resolve({ username, password: 'password' })
  const validatePassword = (user, password) => Promise.resolve(true)
  it('should return true when correct creds are passed', async () => {
    // Arrange
    const authenticate = CreateLoginAuthService({ findUser, validatePassword })
    const username = 'user'
    const password = 'password'

    // Act
    const result = await authenticate(username, password)

    // Assert
    expect(result).toBeTruthy()
  })
  it('should return true when correct creds are passed', async () => {
    // Arrange
    const authenticate = CreateLoginAuthService({
      findUser,
      validatePassword: () => false,
    })

    const username = 'baduser'
    const password = 'password'

    // Act
    const result = await authenticate(username, password)

    // Assert
    expect(result).toBeFalsy()
  })
})
