import workLogService from './workLog'
import pbstore from './pbstore'
import PocketBase from 'pocketbase'
import dotenv from 'dotenv'
import Store from './store'
dotenv.config()

async function loginToPocketBase() {
  const pb = new PocketBase(process.env.POCKETBASE_API_URL)
  const username = process.env.POCKETBASE_USER
  const password = process.env.POCKETBASE_PASSWORD
  const record = await pb
    .collection('users')
    .authWithPassword(username, password)
  console.log('Logged in as', record.record.id)
  return { pb, user: record.record.id }
}
describe('workLog service', () => {
  test('should create a work log', async () => {
    //    const { pb, user } = await loginToPocketBase()

    //const store = pbstore({ entity: 'worklog', pb })
    const store = Store()
    const { createWorkLog } = workLogService({
      user: '1',
      store,
    })

    const workLog = await createWorkLog({
      date: '2020-01-01',
      hours: 8,
    })
    expect(workLog).toBeDefined()
    console.log(workLog)
  })
  test('should return a list of work logs', async () => {
    const store = Store()
    const { getWorkLogs, createWorkLog } = workLogService({
      user: '1',
      store,
    })
    await createWorkLog({
      date: '2020-01-01',
      hours: 8,
    })
    const workLogs = await getWorkLogs()
    expect(workLogs).toHaveLength(1)
  })
})
