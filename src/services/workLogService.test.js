import CreateWorkLogService from './workLogService.js'

describe('WorkLogService', () => {

  it('should return true when correct creds are passed', async () => {
    const workLogService = CreateWorkLogService()

    expect(workLogService).toBeTruthy()
  })
  it('should return true when correct creds are passed', async () => {
    const { saveWorkLogs, getWorkLogs } = CreateWorkLogService()

    const workLog = { description: "something"}
    saveWorkLogs(workLog)


    expect(getWorkLogs()).toBeTruthy()
  })
})
