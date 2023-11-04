import { markRaw } from 'vue'
import { cloneDeep, isEqual, merge } from 'lodash-es'
export abstract class ArrModel<T extends object> {
  value: T[] = []
  _ADD = markRaw(new Set<T>())
  _REMOVE = markRaw(new Set<T>())
  _UPDATE = markRaw(new Set<T>())
  // update history
  _U_M = markRaw(new WeakMap<T, T>())
  unshift(item: T) {
    this.value.unshift(item)
    this._ADD.add(item)
  }

  push(item: T) {
    this.value.push(item)
    this._ADD.add(item)
  }

  pop() {
    const item = this.value.pop()
    this._REMOVE.add(item!)
    return item
  }

  _add(item: T) {
    this.value.unshift(item)
  }

  remove(item: T) {
    this._remove(item)
    this._REMOVE.add(item)
  }

  protected _remove(item: T) {
    const index = this.value.findIndex(i => item === i)
    if (!index)
      return
    this.value.splice(index, 1)
  }

  assign(oldItem: T, newItem: Partial<T>) {
    this._UPDATE.add(Object.assign(oldItem, newItem))
  }

  has(item: T) {
    const index = this.value.findIndex(i => item === i)
    return index >= 0
  }

  merge(item: T, part: Partial<T>) {
    if (this.has(item)) {
      this._UPDATE.add(item)
      this._U_M.set(item, cloneDeep(item))

      merge(item, part)
    }
  }

  updateOne(oldItem: T, newItem: T) {
    if (this._updateOne(oldItem, newItem)) {
      this._UPDATE.add(newItem)
      let history = this._U_H.get(oldItem)
      if (!history) {
        history = [cloneDeep(oldItem), cloneDeep(newItem)]
        this._U_H.set(oldItem, history!)
      }
      else {
        this._U_H.set(oldItem, [history[0], cloneDeep(newItem)])
      }
    }
  }

  protected _updateOne(oldItem: T, newItem: T) {
    const index = this.value.findIndex(item => item === oldItem)
    if (!index)
      return
    this.value.splice(index, 1, newItem)
    return true
  }

  exec() {
    for (const item of [...this._ADD]) {
      if (!this._REMOVE.has(item) && !this._UPDATE.has(item)) {
        this.create(item).catch(() => {
          this._add(item)
        }).finally(() => {
          this._REMOVE.delete(item)
        })
      }
    }
    for (const item of [...this._UPDATE]) {
      if (!this._REMOVE.has(item)) {
        const cloneItem = cloneDeep(item)
        this.update(item).then(() => {
          this._U_M.set(item, cloneItem)
          if (isEqual(item, cloneDeep))
            this._UPDATE.delete(item)
        }).catch(() => {
          if (isEqual(item, cloneDeep)) {
            this._updateOne(item, this._U_M.get(item)!)

            this._UPDATE.delete(item)
          }
        }).finally(() => {

        })
      }
    }

    for (const item of [...this._REMOVE]) {
      this.delete(item).then(() => {
        this._REMOVE.delete(item)
        this._ADD.delete(item)
        this._UPDATE.delete(item)
      })
    }
  }

  abstract create(item: T): Promise<void>
  abstract delete(item: T): Promise<void>
  abstract update(item: T): Promise<void>
  abstract find: (item: T) => Promise<void>
}
