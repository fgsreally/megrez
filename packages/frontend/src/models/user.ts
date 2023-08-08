import type { UserEntity } from '../../../backend/src/modules/user/user.model'
import type { TeamEntity } from '../../../backend/src/modules/team/team.model'

export class UserModel {
  user!: UserEntity
  team!: TeamEntity 
  constructor() {
    this.refresh()
  }

  async refresh() {
    this.user = await getUserInfo()
  }

  async refreshTeam() {
    const teams = await getTeams()
    this.team = teams[0]
  }
}
