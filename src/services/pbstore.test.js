import pbstore from './pbstore'
import PocketBase from 'pocketbase'
import dotenv from 'dotenv'
dotenv.config()

function loginToPocketBase() {
  const pb = new PocketBase(process.env.POCKETBASE_API_URL)
  const user = process.env.POCKETBASE_USER
  const password = process.env.POCKETBASE_PASSWORD
  pb.collection('users').authWithPassword(user, password)
  return pb
}
describe('pbstore', () => {
  test('bootstrap', async () => {
    const store = pbstore({ entity: 'test' })
    expect(store).toBeDefined()
  })
  test('create', async () => {
    const pb = loginToPocketBase()

    const store = pbstore({ entity: 'test', pb })
    const result = await store.create()

    expect(result.id).toBeDefined()
  })
  test('read', async () => {
    const pb = loginToPocketBase()

    const store = pbstore({ entity: 'test', pb })
    const result = await store.readAll()
    expect(result).toBeDefined()
  })
  test('readById', async () => {
    const pb = loginToPocketBase()
    const store = pbstore({ entity: 'test', pb })

    const list = await store.readAll()
    console.log(list[0].id)

    const result = await store.read(list[0].id)

    expect(result).toBeDefined()
  })
  test('delete', async () => {
    const pb = loginToPocketBase()
    const store = pbstore({ entity: 'test', pb })
    const list = await store.readAll()

    const result = await store.delete(list[0].id)

    expect(result).toBeUndefined()
  })
})
