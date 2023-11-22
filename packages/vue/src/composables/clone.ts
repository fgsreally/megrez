import { cloneDeep } from 'lodash-es'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
export function useClone<T extends Ref>(value: T) {
  const clone = ref<T>(cloneDeep(value.value))

  watch(() => value, (n) => {
    clone.value = cloneDeep(n.value)
  })

  function revoke() {
    clone.value = value.value
  }

  return {
    value: clone,
    revoke,
  }
}
