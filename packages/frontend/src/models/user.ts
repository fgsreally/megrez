import { useRequest } from 'vue-request'
import { Init } from 'phecda-vue'
import type { UserEntity } from '../../../backend/src/modules/user/user.model'
import type { TeamEntity } from '../../../backend/src/modules/team/team.model'
import type { NamespaceEntity } from '../../../backend/src/modules/namespace/namespace.model'

export class UserModel {
  user!: UserEntity
  team!: TeamEntity
  namespace!: NamespaceEntity
  namespaces: NamespaceEntity[] = []
  @Init
  async init() {
    this.refreshUser()
    await this.refreshTeam()
    this.refreshNamespace()
  }

  async refreshUser() {
    this.user = await getUserInfo()
  }

  async refreshTeam() {
    const teams = await getTeams()
    this.team = teams[0]
  }

  async refreshNamespace() {
    this.namespaces = await getAllNamespace(this.team._id)
  }

  updateNamespace(namespace: NamespaceEntity) {
    this.namespace = namespace
  }
}
