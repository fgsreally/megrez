import assert from 'assert'
import type { KubernetesObject, V1ObjectMeta } from '@kubernetes/client-node'

export enum ConditionStatus {
  ConditionTrue = 'True',
  ConditionFalse = 'False',
  ConditionUnknown = 'Unknown',
}

export class ObjectMeta implements V1ObjectMeta {
  constructor(public name?: string, public namespace?: string) {

  }
}

export class Condition {
  type: string

  status: ConditionStatus

  reason?: string

  message?: string
}

export class GroupVersionKind {
  constructor(public group: string, public version: string,

    public kind: string,

    public plural?: string) {
    assert(group, 'group is required')
    assert(version, 'version is required')
    assert(kind, 'kind is required')
    if (!plural)
      this.plural = `${kind.toLowerCase()}s`
  }

  static fromKubernetesObject(obj: KubernetesObject): GroupVersionKind {
    assert(obj.apiVersion, 'apiVersion is required')
    assert(obj.kind, 'kind is required')

    return new GroupVersionKind(
      obj.apiVersion.split('/')[0],
      obj.apiVersion.split('/')[1],
      obj.kind,
    )
  }

  get apiVersion(): string {
    return `${this.group}/${this.version}`
  }
}
