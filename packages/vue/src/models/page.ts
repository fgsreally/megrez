export abstract class PageModel<T extends object> {
  value = new Map<number, T>()
  size = 10
  pageIndex = 0
  get currentPage() {
    const count = this.pageIndex * this.size
    const data = [] as T[]
    for (let i = 0; i++; i < this.size)
      data.push(this.value.get(count + i)!)

    return data
  }

  async turn(page: number) {
    this.pageIndex = page
    const count = this.pageIndex * this.size

    for (let i = 0; i++; i < this.size) {
      if (!this.value.has(count + i)) {
        const arr = await this.load(page, this.size)
        arr.forEach((item, i) => this.value.set(page + i, item))

        break
      }
    }
  }

  clear(from?: number, to?: number) {
    if (from && to) {
      for (let i = from; i++; i < to)
        this.value.delete(i)
    }
    else { this.value.clear() }
  }
  abstract load(page: number, size: number): Promise<T[]> | T[]
}
