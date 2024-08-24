import CreateLoginAuthService from './loginService'

describe('loginService', () => {
  it('should return true when correct creds are passed', () => {
    // Arrange
    const { authenticate } = CreateLoginAuthService()
    const username = 'user'
    const password = 'password'

    // Act
    const result = authenticate(username, password)

    // Assert
    expect(result).toBeTruthy()
  })
  it('should return true when correct creds are passed', () => {
    // Arrange
    const { authenticate } = CreateLoginAuthService()
    const username = 'baduser'
    const password = 'password'

    // Act
    const result = authenticate(username, password)

    // Assert
    expect(result).toBeFalsy()
  })
})
