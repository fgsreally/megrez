import type { ObjectId } from 'mongodb'

export enum ApplicationNamespaceMode {
  Fixed = 'fixed',
  AppId = 'appid',
}

export interface RegionNamespaceConf {
  mode: ApplicationNamespaceMode
  prefix: string
  fixed?: string
}

export interface RegionClusterConf {
  driver: string
  kubeconfig: string
  npmInstallFlags: string
  runtimeAffinity: any
}

export interface RegionDatabaseConf {
  driver: string
  connectionUri: string
  controlConnectionUri: string
}

export interface TLSConf {
  enabled: boolean
  issuerRef: {
    name: string
    kind: 'ClusterIssuer' | 'Issuer'
  }
  wildcardCertificateSecretName?: string
}

export interface RegionGatewayConf {
  driver: 'apisix' | 'nginx'
  runtimeDomain: string
  websiteDomain: string
  port: number
  tls: TLSConf
}

export interface RegionStorageConf {
  driver: string
  domain: string
  externalEndpoint: string
  internalEndpoint: string
  accessKey: string
  secretKey: string
  controlEndpoint: string
}

export interface LogServerConf {
  apiUrl: string
  secret: string
  databaseUrl: string
}

export interface PrometheusConf {
  apiUrl: string
}

export class Region {
  _id?: ObjectId

  name: string

  displayName: string

  namespaceConf: RegionNamespaceConf
  clusterConf: RegionClusterConf
  databaseConf: RegionDatabaseConf
  gatewayConf: RegionGatewayConf
  storageConf: RegionStorageConf
  logServerConf: LogServerConf
  prometheusConf: PrometheusConf

  state: 'Active' | 'Inactive'

  createdAt: Date

  updatedAt: Date

  constructor(partial: Partial<Region>) {
    Object.assign(this, partial)
  }
}
