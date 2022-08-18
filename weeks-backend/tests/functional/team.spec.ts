import UserModel from 'App/Models/User'
import type User from 'App/Models/User'
import { test } from '@japa/runner'
import { TeamFactory } from 'Database/factories'

test.group('Teams', (group) => {
  let loggedInUser: User

  group.setup(async () => {
    await TeamFactory.with('owner').with('teammateUsers').createMany(3)
    loggedInUser = await UserModel.query().has('ownedTeams', '>', 0).firstOrFail()
  })

  test('create a new team', async ({ client, assert }) => {
    const response = await client.post('/teams').json({
      name: 'Il mio team',
      notes: `# Come si struttura il mio team`,
    }).loginAs(loggedInUser)


    const team = response.body()
    response.assertAgainstApiSpec()
    assert.equal(team.name, 'Il mio team', 'should have the right name')
  })

  test('get a paginated list of mine existing teams', async ({ client, assert }) => {
    const response = await client.get('/teams').qs({
      page: 1,
      perPage: 200
    }).loginAs(loggedInUser)
    response.assertAgainstApiSpec()
    let teams = response.body()

    assert.equal(teams.meta.perPage, 200, "should use the right pagination")
    assert.equal(teams.meta.total, teams.data.length, "should return the right rows")
  })

  test('get a team', async ({ client, assert }) => {
    const team = await TeamFactory.with('owner').with('teammateUsers').create()
    const user = await UserModel.query().whereHas('teams', (builder) => builder.where('teams.id', team.id)).firstOrFail()
    const response = await client.get('/teams/' + team.id).loginAs(user)

    response.assertAgainstApiSpec()
    const teamResponse = response.body()
    assert.equal(teamResponse.id, team.id, "should return the correct team")
  })

  test('update an existing team', async ({ client, assert }) => {
    const team = await TeamFactory.with('owner').with('teammateUsers').create()
    const user = await UserModel.query().whereHas('teams', (builder) => builder.where('teams.id', team.id)).firstOrFail()
    const response = await client.put('/teams/' + team.id).json({
      name: 'il nuovo nome'
    }).loginAs(user)

    response.assertAgainstApiSpec()
    const teamResponse = response.body()
    assert.equal(teamResponse.id, team.id, "should update the correct team")
    assert.equal(teamResponse.name, 'il nuovo nome', "should update the team")
  })
})
