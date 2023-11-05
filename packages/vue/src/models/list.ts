import { markRaw } from 'vue'
import { cloneDeep, isEqual, merge } from 'lodash-es'

export class ListModel<T extends object> {
  value: T[] = []
  _ALL = markRaw(new WeakSet<T>())
  _ADD = markRaw(new Set<T>())
  _REMOVE = markRaw(new Set<T>())
  _UPDATE = markRaw(new Set<T>())
  // syncing item
  _S = markRaw(new WeakSet<T>())
  // update map
  _U_M = markRaw(new WeakMap<T, T>())

  isLocked: false | Promise<any> = false

  isSyncing(item: T) {
    if (this._S.has(item))
      return true
  }

  clean() {
    this._REMOVE.clear()
    this._UPDATE.clear()
    this._ADD.clear()
  }

  protected validate(_item: T) {
    return true
  }

  add(item: T) {
    if (this.has(item))
      return
    if (!this.validate(item))

      return

    this.value.unshift(item)
    this._ADD.add(item)
    this._ALL.add(item)
  }

  // push(item: T) {
  //   if (this.has(item))
  //     return
  //   if (!this.validate(item))

  //     return
  //   this.value.push(item)
  //   this._ADD.add(item)
  // }

  protected _add(item: T) {
    this._ALL.add(item)
    this.value.unshift(item)
  }

  remove(item: T) {
    if (!this.validate(item))

      return
    this._remove(item)
    this._REMOVE.add(item)
  }

  protected _remove(item: T) {
    const index = this.value.findIndex(i => item === i)
    if (index < 0)
      return
    this._ALL.delete(item)

    this.value.splice(index, 1)
  }

  protected _replace(oldItem: T, newItem: T) {
    const index = this.value.findIndex(item => item === oldItem)
    if (!index)
      return
    this._ALL.delete(oldItem)
    this._ALL.add(newItem)

    this.value.splice(index, 1, newItem)
    return true
  }

  has(item: T) {
    return this._ALL.has(item)
  }
}

export abstract class SyncListModel<T extends object> extends ListModel<T> {
  merge(item: T, part: Partial<T>) {
    if (!this.has(item))
      return

    if (!this.validate(item))
      return
    this._UPDATE.add(item)
    this._U_M.set(item, cloneDeep(item))

    merge(item, part)
  }

  protected validate(_item: T): boolean {
    return !this.isSyncing(_item) && !this.isLocked
  }

  async push() {
    if (this.isLocked)
      await this.isLocked
    return this.isLocked = new Promise<void>((resolve) => {
      let count = 0
      for (const item of [...this._UPDATE]) {
        if (!this._REMOVE.has(item) && !this._ADD.has(item)) {
          this._S.add(item)
          count++
          this.update(item).catch(() => {
            this._replace(item, this._U_M.get(item)!)
          }).finally(() => {
            if (--count === 0)
              resolve()
            this._S.delete(item)
            this._UPDATE.delete(item)
          })
        }
      }

      for (const item of [...this._ADD]) {
        if (!this._REMOVE.has(item) && !this._S.has(item)) {
          this._S.add(item)
          count++

          this.create(item).catch(() => {
            this._remove(item)
          }).finally(() => {
            this._ADD.delete(item)
            this._S.delete(item)
            if (--count === 0)
              resolve()

            this._REMOVE.delete(item)
          })
        }
      }

      for (const item of [...this._REMOVE]) {
        this._S.add(item)
        count++
        this.delete(item).catch(() => {
          this._add(item)
        }).finally(() => {
          if (--count === 0)
            resolve()
          this._REMOVE.delete(item)
          this._ADD.delete(item)
          this._UPDATE.delete(item)
        })
      }
    }).then(() => {
      this.isLocked = false
    })
  }

  async pull() {
    await this.isLocked
    this.isLocked = this.find()
    this.value = await this.isLocked

    this.isLocked = false
  }

  abstract create(item: T): Promise<void>
  abstract delete(item: T): Promise<void>
  abstract update(item: T): Promise<void>
  abstract find(): Promise<T[]>
}

export abstract class AsyncListModel<T extends object> extends ListModel<T> {
  merge(item: T, part: Partial<T>) {
    if (!this.has(item))
      return

    if (!this.validate(item))
      return
    this._UPDATE.add(item)
    this._U_M.set(item, cloneDeep(item))

    merge(item, part)
  }

  async push() {
    if (this.isLocked)
      await this.isLocked
    return this.isLocked = new Promise<void>((resolve) => {
      let count = 0
      const update = (item: T) => {
        if (this._S.has(item))
          return
        this._S.add(item)

        if (this._REMOVE.has(item)) {
          count++
          this.delete(item).catch(() => {
            this._add(item)
          }).finally(() => {
            if (--count === 0)
              resolve()
            this._S.delete(item)
            this._REMOVE.delete(item)
            this._ADD.delete(item)
            this._UPDATE.delete(item)
          })
          return
        }

        if (this._ADD.has(item)) {
          count++
          this._UPDATE.delete(item)
          this.create(item).catch(() => {
            this._remove(item)
          }).finally(() => {
            this._S.delete(item)
            this._ADD.delete(item)
            update(item)
            if (--count === 0)
              resolve()
          })
          return
        }
        if (this._UPDATE.has(item)) {
          count++

          this._S.add(item)
          const cloneItem = cloneDeep(item)
          this.update(item).then(() => {
            this._S.delete(item)

            this._U_M.set(item, cloneItem)
            if (isEqual(item, cloneItem))
              this._UPDATE.delete(item)
            else update(item)
            if (--count === 0)
              resolve()
          }).catch(() => {
            this._S.delete(item)

            if (isEqual(item, cloneDeep)) {
              this._replace(item, this._U_M.get(item)!)

              this._UPDATE.delete(item)
            }
            else { update(item) }
            if (--count === 0)
              resolve()
          })
        }
      }
      const items = [...this._UPDATE, ...this._ADD, ...this._REMOVE]

      if (!items.length)
        resolve()
      for (const item of items) update(item)
    }).then(() => {
      this.isLocked = false
    })
  }

  async pull() {
    await this.isLocked
    this.isLocked = this.find()
    this.value = await this.isLocked

    this.isLocked = false
  }

  abstract create(item: T): Promise<void>
  abstract delete(item: T): Promise<void>
  abstract update(item: T): Promise<void>
  abstract find(): Promise<T[]>
}
