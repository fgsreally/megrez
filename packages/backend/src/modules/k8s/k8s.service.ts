import * as k8s from '@kubernetes/client-node'
import type { KubernetesObject } from '@kubernetes/client-node'
import { compare } from 'fast-json-patch'
import type { Logger } from '../logger/logger.service'
import { ApplicationNamespaceMode, type Region } from './type'
import { GroupVersionKind } from './utils'

const LABEL_KEY_USER_ID = 'megrez.dev/user.id'
const LABEL_KEY_APP_ID = 'megrez.dev/appid'
const LABEL_KEY_NAMESPACE_TYPE = 'megrez.dev/namespace.type'

export function GetApplicationNamespace(region: Region, appid: string) {
  const conf = region.namespaceConf
  if (conf?.mode === 'fixed')
    return conf.fixed

  if (conf?.mode === 'appid') {
    const prefix = conf?.prefix || ''
    return `${prefix}${appid}`
  }

  return appid
}
export class BaseK8sService {
  constructor(protected logger: Logger) {

  }

  loadKubeConfig(region: Region) {
    const conf = region.clusterConf.kubeconfig
    const kc = new k8s.KubeConfig()

    // if conf is empty load from default config (in-cluster service account or ~/.kube/config)
    if (!conf) {
      kc.loadFromDefault()
      return kc
    }

    // if conf is not empty load from string
    kc.loadFromString(conf)
    return kc
  }

  // create app namespace
  async createAppNamespace(region: Region, appid: string, userid: string) {
    try {
      const namespace = new k8s.V1Namespace()
      namespace.metadata = new k8s.V1ObjectMeta()
      namespace.metadata.name = GetApplicationNamespace(region, appid)
      namespace.metadata.labels = {
        [LABEL_KEY_APP_ID]: appid,
        [LABEL_KEY_NAMESPACE_TYPE]: 'app',
        [LABEL_KEY_USER_ID]: userid,
      }
      const coreV1Api = this.makeCoreV1Api(region)

      const res = await coreV1Api.createNamespace(namespace)
      return res.body
    }
    catch (err: any) {
      this.logger.error(err)
      this.logger.error(err?.response?.body)
      throw err
    }
  }

  // get app namespace
  async getAppNamespace(region: Region, appid: string) {
    try {
      const coreV1Api = this.makeCoreV1Api(region)
      const namespace = GetApplicationNamespace(region, appid)!
      const res = await coreV1Api.readNamespace(namespace)
      return res.body
    }
    catch (err: any) {
      if (err?.response?.body?.reason === 'NotFound')
        return null
      this.logger.error(err)
      this.logger.error(err?.response?.body)
      throw err
    }
  }

  // remove app namespace
  async removeAppNamespace(region: Region, appid: string) {
    if (region.namespaceConf?.mode !== ApplicationNamespaceMode.AppId)
      return

    try {
      const coreV1Api = this.makeCoreV1Api(region)
      const namespace = GetApplicationNamespace(region, appid)!
      const res = await coreV1Api.deleteNamespace(namespace)
      return res
    }
    catch (err: any) {
      this.logger.error(err)
      this.logger.error(err?.response?.body)
      throw err
    }
  }

  async patchCustomObject(region: Region, spec: KubernetesObject) {
    const client = this.makeCustomObjectApi(region)
    const gvk = GroupVersionKind.fromKubernetesObject(spec)

    // get the current spec
    const res = await client.getNamespacedCustomObject(
      gvk.group,
      gvk.version,
      spec.metadata!.namespace!,
      gvk.plural!,
      spec.metadata!.name!,
    )
    const currentSpec = res.body as KubernetesObject

    // calculate the patch
    const patch = compare(currentSpec, spec)
    const options = {
      headers: {
        'Content-Type': k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH,
      },
    }

    // apply the patch
    const response = await client.patchNamespacedCustomObject(
      gvk.group,
      gvk.version,
      spec.metadata!.namespace!,
      gvk.plural!,
      spec.metadata!.name!,
      patch,
      undefined,
      undefined,
      undefined,
      options,
    )

    return response.body
  }

  async deleteCustomObject(region: Region, spec: KubernetesObject) {
    const client = this.makeCustomObjectApi(region)
    const gvk = GroupVersionKind.fromKubernetesObject(spec)

    const response = await client.deleteNamespacedCustomObject(
      gvk.group,
      gvk.version,
      spec.metadata.namespace!,
      gvk.plural!,
      spec.metadata.name!,
    )

    return response.body
  }

  async getIngress(region: Region, name: string, namespace: string) {
    const api = this.makeNetworkingApi(region)

    try {
      const res = await api.readNamespacedIngress(name, namespace)
      return res.body
    }
    catch (err: any) {
      // if ingress not found, return null
      if (err?.response?.statusCode === 404)
        return null

      this.logger.error(err)
      this.logger.error(err?.response?.body)
      throw err
    }
  }

  async createIngress(region: Region, body: k8s.V1Ingress) {
    body.apiVersion = 'networking.k8s.io/v1'
    body.kind = 'Ingress'
    const api = this.makeNetworkingApi(region)
    const res = await api.createNamespacedIngress(body.metadata!.namespace!, body)
    return res.body
  }

  async deleteIngress(region: Region, name: string, namespace: string) {
    const api = this.makeNetworkingApi(region)
    const res = await api.deleteNamespacedIngress(name, namespace)
    return res.body
  }

  makeCoreV1Api(region: Region) {
    const kc = this.loadKubeConfig(region)
    return kc.makeApiClient(k8s.CoreV1Api)
  }

  makeAppsV1Api(region: Region) {
    const kc = this.loadKubeConfig(region)
    return kc.makeApiClient(k8s.AppsV1Api)
  }

  makeBatchV1Api(region: Region) {
    const kc = this.loadKubeConfig(region)
    return kc.makeApiClient(k8s.BatchV1Api)
  }

  makeObjectApi(region: Region) {
    const kc = this.loadKubeConfig(region)
    return kc.makeApiClient(k8s.KubernetesObjectApi)
  }

  makeCustomObjectApi(region: Region) {
    const kc = this.loadKubeConfig(region)
    return kc.makeApiClient(k8s.CustomObjectsApi)
  }

  makeHorizontalPodAutoscalingV2Api(region: Region) {
    const kc = this.loadKubeConfig(region)
    return kc.makeApiClient(k8s.AutoscalingV2Api)
  }

  makeNetworkingApi(region: Region) {
    const kc = this.loadKubeConfig(region)
    return kc.makeApiClient(k8s.NetworkingV1Api)
  }
}
