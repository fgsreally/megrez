import { toAsync, useC } from 'phecda-client'
import { TeamController } from '../../../backend/src/modules/team/team.controller'
import { $request } from './axios'
const instance = useC(TeamController)
export const addTeam = toAsync($request, instance.add)
export const getTeams = toAsync($request, instance.getTeams)
