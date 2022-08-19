import TeammateModel from 'App/Models/Teammate';
import InvitationModel from 'App/Models/Invitation';
import UserModel from 'App/Models/User'
import type User from 'App/Models/User'
import type Team from 'App/Models/Team'
import type Invitation from 'App/Models/Invitation'
import { test } from '@japa/runner'
import { TeamFactory, UserFactory } from 'Database/factories'

test.group('Invitations', (group) => {
  let loggedInUser: User
  let invitedUser: User
  let team: Team

  group.setup(async () => {
    team = await TeamFactory.with('owner').with('teammateUsers').create()
    loggedInUser = await UserModel.query().whereHas('teams', (builder) => builder.where('teams.id', team.id)).firstOrFail()
    invitedUser = await UserFactory.create()
  })

  test('invite a non exising user to a team', async ({ client, assert }) => {
    const response = await client.post('/invitations/inviteUser').json({
      user: {
        email: 'gabriele.garlaschelli@gmail.com'
      },
      team: {
        id: team.id
      }
    }).loginAs(loggedInUser)


    const invitation = response.body()
    response.assertAgainstApiSpec()
    assert.equal(invitation.status, 'pending', 'invitation should be pending')
    assert.equal(invitation.team.id, team.id, 'invitation should be for the right team')
    assert.equal(invitation.invitedEmail, 'gabriele.garlaschelli@gmail.com', 'invitation should be at the right user')
  })

  test('invite a exising user to a team', async ({ client, assert }) => {
    const response = await client.post('/invitations/inviteUser').json({
      user: {
        email: invitedUser.email
      },
      team: {
        id: team.id
      }
    }).loginAs(loggedInUser)


    const invitation = response.body()
    response.assertAgainstApiSpec()
    assert.equal(invitation.status, 'pending', 'invitation should be pending')
    assert.equal(invitation.team.id, team.id, 'invitation should be for the right team')
    assert.equal(invitation.invitedEmail, invitedUser.email, 'invitation should be at the right user')
  })

  test('get my invitations', async ({ client, assert }) => {
    const response = await client.get('/invitations/list').loginAs(invitedUser)

    const invitation = response.body()
    response.assertAgainstApiSpec()
    assert.isTrue(invitation.length > 0, 'should has at least one invitation')
  })

  test('accept an invitations', async ({ client, assert }) => {
    const inviteUserResponse = await client.post('/invitations/inviteUser').json({
      user: {
        email: invitedUser.email
      },
      team: {
        id: team.id
      }
    }).loginAs(loggedInUser)

    const invitationToAccept = inviteUserResponse.body()

    const response = await client.post('/invitations/accept').json({
      invitation: {
        id: invitationToAccept.id
      }
    }).loginAs(invitedUser)

    const invitation = response.body()
    response.assertAgainstApiSpec()
    assert.equal(invitation.status, 'accepted', 'invitation should be accepted')

    let teammate = await TeammateModel.query()
      .where('teamId', team.id)
      .where('userId', invitedUser.id)

    assert.isTrue(teammate.length > 0, 'should have created the teammate')
  })

  test('reject an invitations', async ({ client, assert }) => {
    const inviteUserResponse = await client.post('/invitations/inviteUser').json({
      user: {
        email: invitedUser.email
      },
      team: {
        id: team.id
      }
    }).loginAs(loggedInUser)

    const invitationToReject = inviteUserResponse.body()

    const response = await client.post('/invitations/reject').json({
      invitation: {
        id: invitationToReject.id
      }
    }).loginAs(invitedUser)

    const invitation = response.body()
    response.assertAgainstApiSpec()
    assert.equal(invitation.status, 'rejected', 'invitation should be rejected')
  })

  test('discard an invitations', async ({ client, assert }) => {
    const inviteUserResponse = await client.post('/invitations/inviteUser').json({
      user: {
        email: invitedUser.email
      },
      team: {
        id: team.id
      }
    }).loginAs(loggedInUser)

    const invitationToDiscard = inviteUserResponse.body()

    const response = await client.post('/invitations/discard').json({
      invitation: {
        id: invitationToDiscard.id
      }
    }).loginAs(loggedInUser)

    const invitation = response.body()
    response.assertAgainstApiSpec()
    assert.equal(invitation.status, 'discarded', 'invitation should be discarded')
  })
})
