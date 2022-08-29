import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

import UserModel from 'App/Models/User'
import InvitationModel from 'App/Models/Invitation'
import RoleModel from 'App/Models/Role'
import EventModel from 'App/Models/Event'

import type User from 'App/Models/User'
import type Team from 'App/Models/Team'
import type Invitation from 'App/Models/Invitation'
import type Event from 'App/Models/Event'
import type EventSession from 'App/Models/EventSession'
import type Convocation from 'App/Models/Convocation'
import type Role from 'App/Models/Role'

export type Resource = 
  'Team' |
  'Invitation' |
  'Event' |
  'Convocation' |
  'EventSession' |
  'Role'

export type Action =
  'update' |
  'destroy' |
  'create' |
  'view' |
  'invite' |
  'removeUser' |
  'accept' |
  'reject' |
  'discard' |
  'convocate'

export type Entities = {
  team?: Pick<Team, 'id'>,
  invitation?: Pick<Invitation, 'id'>,
  event?: Pick<Event, 'id'>,
  eventSession?: Pick<EventSession, 'id'>,
  convocation?: Pick<Convocation, 'id'>,
  invitee?: Pick<User, 'email'>
  role?: Pick<Role, 'id'>
}

type CanFunction = (params: {
  actor: User,
  entities: Entities
}, context?: {
  trx?: TransactionClientContract
}) => Promise<boolean>


type CanParameters = {
  data: {
    actor: User,
    resource: Resource,
    action: Action,
    entities: Entities
  },
  context?: {
    trx?: TransactionClientContract
  }
}

export default class AuthorizationManager {
  static mapper: {
    [resource in Resource]?: {
      [action in Action]?: CanFunction
    }
  } = {
    Team: {
      update: AuthorizationManager._canUpdateTeam,
      destroy: AuthorizationManager._canDestroyTeam,
      view: AuthorizationManager._canViewTeam,
      invite: AuthorizationManager._canInviteToTeam,
      removeUser: AuthorizationManager._canUpdateTeam
    },
    Invitation: {
      accept: AuthorizationManager._canAcceptInvitation,
      reject: AuthorizationManager._canRejectInvitation,
      discard: AuthorizationManager._canDiscardInvitation,
    },
    Role: {
      create: AuthorizationManager._canUpdateTeam,
      update: AuthorizationManager._canUpdateRole,
      destroy: AuthorizationManager._canUpdateRole,
      view: AuthorizationManager._canViewRole,
    },
    Event: {
      create: AuthorizationManager._canCreateEvent,
      convocate: AuthorizationManager._canConvocateToEvent
    }

  }

  constructor() { }

  public static async can(
    { data, context }: CanParameters
  ) {
    let canFunction = this.mapper[data.resource]?.[data.action] ?? AuthorizationManager._generalCanFunction
    return await canFunction({
      actor: data.actor, entities: data.entities
    }, context)
  }

  public static async canOrFail(params: CanParameters): Promise<boolean> {
    let results = await AuthorizationManager.can(params)
    if (!this.mapper[params.data.resource]?.[params.data.action] || !results) throw new Error(`cannot ${params.data.action} on resource ${params.data.resource} with current user`)
    else return true
  }

  private static async _generalCanFunction(
    _params: { actor: User, entities: Entities },
    _context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    return false
  }

  private static async _canUpdateTeam(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.team?.id) throw new Error('team must be defined')
    let teamId: number = params.entities.team.id

    const userBelongs = await UserModel.query({
        client: context?.trx
      }).whereHas('teams', (builder) => {
        builder.where('teams.id', teamId)
      })
      .where('users.id', params.actor.id)

    return userBelongs.length != 0
  }

  private static async _canDestroyTeam(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.team?.id) throw new Error('team must be defined')
    let teamId: number = params.entities.team.id

    const userBelongs = await UserModel.query({
      client: context?.trx
    }).whereHas('teams', (builder) => {
      builder.where('teams.id', teamId)
    }).where('users.id', params.actor.id)

    return userBelongs.length != 0
  }

  private static async _canViewTeam(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.team?.id) throw new Error('team must be defined')
    let teamId: number = params.entities.team.id

    const userBelongs = await UserModel.query({
      client: context?.trx
    }).whereHas('teams', (builder) => {
      builder.where('teams.id', teamId)
    }).where('users.id', params.actor.id)

    return userBelongs.length != 0
  }

  private static async _canInviteToTeam(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.team?.id) throw new Error('team must be defined')
    let teamId: number = params.entities.team.id

    const userBelongs = await UserModel.query({
      client: context?.trx
    }).whereHas('teams', (builder) => {
      builder.where('teams.id', teamId)
    }).where('users.id', params.actor.id)

    return userBelongs.length != 0
  }

  private static async _canAcceptInvitation(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.invitation?.id) throw new Error('invitation must be defined')
    let invitationId: number = params.entities.invitation.id

    const invitationBelogs = await InvitationModel.query({ client: context?.trx })
      .whereIn('invitedEmail', UserModel.query({ client: context?.trx })
        .select('email')
        .where('id', params.actor.id)
      )
      .where('id', invitationId)

    return invitationBelogs.length != 0
  }

  private static async _canRejectInvitation(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.invitation?.id) throw new Error('invitation must be defined')
    let invitationId: number = params.entities.invitation.id

    const invitationBelogs = await InvitationModel.query({ client: context?.trx })
      .whereIn('invitedEmail', UserModel.query({ client: context?.trx })
        .select('email')
        .where('id', params.actor.id)
      )
      .where('id', invitationId)

    return invitationBelogs.length != 0
  }

  private static async _canDiscardInvitation(
    params: { actor: User, entities: Entities },
    _context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.invitation?.id) throw new Error('invitation must be defined')
    let invitationId: number = params.entities.invitation.id

    const invitationBelogs = await InvitationModel.query()
      .whereHas('invitedBy', inviteBuilder => {
        inviteBuilder.where('users.id', params.actor.id)
      })
      .where('id', invitationId)

    return invitationBelogs.length != 0
  }

  private static async _canViewRole(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.role?.id) throw new Error('role must be defined')
    let roleId: number = params.entities.role.id

    const userBelongs = await UserModel.query({
      client: context?.trx
    }).whereHas('teams', (builder) => {
      builder.whereHas('roles', rolesBuilder => {
        rolesBuilder.where('roles.id', roleId)
      })
    }).where('users.id', params.actor.id)

    return userBelongs.length != 0
  }

  private static async _canUpdateRole(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.role?.id) throw new Error('role must be defined')
    let roleId: number = params.entities.role.id

    const userBelongs = await UserModel.query({
      client: context?.trx
    }).whereHas('teams', (builder) => {
      builder
        .whereIn('teams.id', RoleModel.query().select('teamId').where('roles.id', roleId))
        .where(teamsBuilder => {
          teamsBuilder
            .whereHas('roles', rolesBuilder => {
              rolesBuilder.whereRaw("cast(roles.cans->'Event'->>'create' as BOOLEAN) = true")
            })
            .orWhere('ownerId', params.actor.id)
        })
    }).where('users.id', params.actor.id)

    return userBelongs.length != 0
  }

  private static async _canCreateEvent(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.team?.id) throw new Error('team must be defined')
    let teamId: number = params.entities.team.id

    const userBelongs = await UserModel.query({
      client: context?.trx
    }).whereHas('teams', (builder) => {
      builder
        .where('teams.id', teamId)
        .where(teamsBuilder => {
          teamsBuilder
            .whereHas('roles', rolesBuilder => {
              rolesBuilder.whereRaw("cast(roles.cans->'Event'->>'create' as BOOLEAN) = true")
            })
            .orWhere('ownerId', params.actor.id)
        })
    }).where('users.id', params.actor.id)

    return userBelongs.length != 0
  }

  private static async _canConvocateToEvent(
    params: { actor: User, entities: Entities },
    context?: { trx?: TransactionClientContract }
  ): Promise<boolean> {
    if (!params.entities.event?.id) throw new Error('event must be defined')
    let eventId: number = params.entities.event.id

    let results = await EventModel.query({
      client: context?.trx
    }).where('id', eventId).first()

    let event: Event
    if(!results) return false
    else event = results

    const userBelongs = await UserModel.query({
      client: context?.trx
    }).whereHas('teams', (builder) => {
      builder
        .where('teams.id', event.teamId)
        .where(teamsBuilder => {
          teamsBuilder
            .whereHas('roles', rolesBuilder => {
              rolesBuilder.whereRaw("cast(roles.cans->'Event'->>'create' as BOOLEAN) = true")
            })
            .orWhere('ownerId', params.actor.id)
        })
    }).where('users.id', params.actor.id)

    return userBelongs.length != 0
  }
}