import { describe, expect, it, vi } from 'vitest'
import { cloneDeep, isEqual } from 'lodash-es'
import { AsyncListModel, SyncListModel } from '../src/models'
describe('model', () => {
  it('sync list model', async () => {
    const errorFn = vi.fn()
    const createFn = vi.fn()
    const updateFn = vi.fn()
    const deleteFn = vi.fn()

    const data = [{
      id: 1,
    }, { id: 2 }]

    interface Item { id: number; value?: string }
    class TestModel extends SyncListModel<Item> {
      async find() {
        return cloneDeep(data)
      }

      protected validate(_item: Item): boolean {
        const ret = super.validate(_item)
        if (!ret)
          errorFn()
        return ret
      }

      async create(item: Item) {
        createFn()
        data.unshift(item)
      }

      async delete(item: Item) {
        deleteFn()
        const index = data.findIndex(({ id }) => item.id === id)
        index > -1 && data.splice(index, 1)
      }

      async update(item: Item) {
        updateFn()
        const index = data.findIndex(({ id }) => item.id === id)
        index > -1 && data.splice(index, 1, item)
      }
    }
    const instance = new TestModel()
    const item1 = {
      id: 3,
      value: 'item1',
    }
    const item2 = {
      id: 4,
      value: 'item2',
    }
    // pull
    await instance.pull()
    expect(instance.value).toMatchSnapshot()
    // create>update
    instance.add(item1)
    instance.merge(item1, { value: 'new item1' })
    instance.push()
    await instance.isLocked
    expect(createFn).toBeCalledTimes(1)
    expect(updateFn).toBeCalledTimes(0)
    expect(data).toMatchSnapshot()
    // delete>create
    instance.add(item2)
    expect(isEqual(instance.value, data)).toBe(false)

    instance.remove(item2)
    instance.push()
    await instance.isLocked
    expect(createFn).toBeCalledTimes(1)
    expect(deleteFn).toBeCalledTimes(1)
    expect(data).toMatchSnapshot()
    expect(isEqual(instance.value, data)).toBe(true)

    // won't act item or pull which during push
    expect(errorFn).toBeCalledTimes(0)
    instance.add(item2)
    instance.push()
    instance.pull()
    instance.delete(item2)
    expect(errorFn).toBeCalledTimes(1)
  })
  it('async list model', async () => {
    const createFn = vi.fn()
    const updateFn = vi.fn()
    const deleteFn = vi.fn()

    const data = [{
      id: 1,
    }, { id: 2 }]

    interface Item { id: number; value?: string }
    class TestModel extends AsyncListModel<Item> {
      async find() {
        return cloneDeep(data)
      }

      async create(item: Item) {
        createFn()
        data.unshift(item)
      }

      async delete(item: Item) {
        deleteFn()
        const index = data.findIndex(({ id }) => item.id === id)
        index > -1 && data.splice(index, 1)
      }

      async update(item: Item) {
        const index = data.findIndex(({ id }) => item.id === id)
        if (index > -1) {
          data.splice(index, 1, item)

          updateFn()
        }
      }
    }
    const instance = new TestModel()
    const item1 = {
      id: 3,
      value: 'item1',
    }
    const item2 = {
      id: 4,
      value: 'item2',
    }
    const item3 = {
      id: 5,
      value: 'item3',
    }
    // pull
    await instance.pull()
    expect(instance.value).toMatchSnapshot()
    // create>update
    instance.add(item1)
    instance.merge(item1, { value: 'new item1' })
    await instance.push()
    expect(createFn).toBeCalledTimes(1)
    expect(updateFn).toBeCalledTimes(0)

    expect(data).toMatchSnapshot()
    // delete>create
    instance.add(item2)
    expect(isEqual(instance.value, data)).toBe(false)

    instance.remove(item2)
    await instance.push()
    expect(deleteFn).toBeCalledTimes(1)
    expect(data).toMatchSnapshot()
    expect(isEqual(instance.value, data)).toBe(true)

    instance.add(item3)
    instance.push()
    instance.merge(item3, { value: 'new item3' })
    expect(createFn).toBeCalledTimes(2)

    await instance.push()

    expect(updateFn).toBeCalledTimes(1)

    expect(isEqual(instance.value, data)).toBe(true)
    data.shift({
      id: '6',
      value: 'item6',
    })
    expect(isEqual(instance.value, data)).toBe(false)

    await instance.pull()
    expect(isEqual(instance.value, data)).toBe(true)
  })
})
