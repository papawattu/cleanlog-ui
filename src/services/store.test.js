import e from 'express'
import Store from './store'
import dotenv from 'dotenv'
dotenv.config()

describe('pbstore', () => {
  test('bootstrap', async () => {
    const store = Store()
    expect(store).toBeDefined()
  })
  test('create', async () => {
    const store = Store()
    const result = await store.create()

    expect(result.id).toBeDefined()
  })
  test('read', async () => {
    const map = new Map()
    map.set(0, { id: 1 })
    const store = Store({ entity: map, currentId: 0 })
    const result = await store.readAll()
    expect(result).toHaveLength(1)
  })
  test('delete', async () => {
    const map = new Map()
    map.set(0, { id: 0 })
    const store = Store({ entity: map, currentId: 0 })
    const list = await store.readAll()

    expect(list).toHaveLength(1)
    console.log(list)

    const result = await store.delete(list[0].id)

    expect(result).toBeUndefined()
    const results = await store.readAll()
    expect(results).toHaveLength(0)
  })
})
