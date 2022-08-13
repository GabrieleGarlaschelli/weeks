import { DateTime } from 'luxon';
import UserModel from 'App/Models/User'
import type User from 'App/Models/User'
import type Team from 'App/Models/Team'
import { test } from '@japa/runner'
import { TeamFactory } from 'Database/factories'


test.group('Events', (group) => {
  let loggedInUser: User
  let team: Team

  group.setup(async () => {
    team = await TeamFactory.with('owner').with('teammateUsers').create()

    loggedInUser = await UserModel.query().whereHas('teams', builder => {
      builder.where('teams.id', team.id)
    }).firstOrFail()

    team.ownerId = loggedInUser.id
    await team.save()
  })

  test('create a new event', async ({ client, assert }) => {
    const response = await client.post('/events').json({
      event: {
        name: "Evento casuale",
        start: DateTime.local(2022, 5, 15, 9, 0, 0),
        end: DateTime.local(2022, 5, 15, 11, 0, 0),
        description: "Descrizione dell'evento",
        status: 'confirmed',
        team: {
          id: team.id
        }
      }
    }).loginAs(loggedInUser)


    const event = response.body()
    response.assertAgainstApiSpec()
    assert.equal(event.name, 'Evento casuale', 'should create the right event')
  })

  test('create a new event with frequency', async ({ client, assert }) => {
    const response = await client.post('/events/createWithFrequency').json({
      event: {
        name: "Evento casuale",
        start: DateTime.local(2022, 5, 15, 9, 0, 0),
        end: DateTime.local(2022, 5, 15, 11, 0, 0),
        description: "Descrizione dell'evento",
        status: 'confirmed',
        team: {
          id: team.id
        }
      },
      rule: {
        frequency: 'week',
        from: DateTime.local(2022, 5, 15),
        to: DateTime.local(2022, 6, 15),
        daysOfWeek: [1, 4]
      }
    }).loginAs(loggedInUser)


    const events = response.body()
    response.assertAgainstApiSpec()
    assert.equal(events.length, 9, 'should be the right number of events')
  })

  test('get a list of events', async ({ client, assert }) => {
    await client.post('/events').json({
      event: {
        name: "Evento casuale",
        start: DateTime.local(2022, 5, 15, 9, 0, 0),
        end: DateTime.local(2022, 5, 15, 11, 0, 0),
        description: "Descrizione dell'evento",
        status: 'confirmed',
        team: {
          id: team.id
        }
      }
    }).loginAs(loggedInUser)

    const response = await client.get('/events').json({
      filters: {
        from: DateTime.local(2022, 5, 15),
        to: DateTime.local(2022, 5, 23),
      },
    }).loginAs(loggedInUser)


    const events = response.body()
    response.assertAgainstApiSpec()
    assert.isTrue(events.length > 0, 'should find some events')
  })

  test('update an event', async ({ client, assert }) => {
    let response = await client.post('/events').json({
      event: {
        name: "Evento casuale",
        start: DateTime.local(2022, 5, 15, 9, 0, 0),
        end: DateTime.local(2022, 5, 15, 11, 0, 0),
        description: "Descrizione dell'evento",
        status: 'confirmed',
        team: {
          id: team.id
        }
      }
    }).loginAs(loggedInUser)

    let eventToUpdate = response.body()

    response = await client.put('/events/' + eventToUpdate.id).json({
      start: DateTime.local(2022, 5, 15, 11, 30, 0),
      end: DateTime.local(2022, 5, 15, 12, 30, 0)
    }).loginAs(loggedInUser)

    const event = response.body()
    response.assertAgainstApiSpec()

    const start = DateTime.fromISO(event.start)
    assert.equal(start.get('hour'), 11, "should update the start hour")
    assert.equal(start.get('minute'), 30, "should update the start minute")
    const end = DateTime.fromISO(event.end)
    assert.equal(end.get('hour'), 12, "should update the end hour")
    assert.equal(end.get('minute'), 30, "should update the end minute")
  })

  test('destroy an event', async ({ client, assert }) => {
    let response = await client.post('/events').json({
      event: {
        name: "Evento casuale",
        start: DateTime.local(2022, 5, 15, 9, 0, 0),
        end: DateTime.local(2022, 5, 15, 11, 0, 0),
        description: "Descrizione dell'evento",
        status: 'confirmed',
        team: {
          id: team.id
        }
      }
    }).loginAs(loggedInUser)

    let eventToUpdate = response.body()

    await client.delete('/events/' + eventToUpdate.id).loginAs(loggedInUser)
  })

  
})
