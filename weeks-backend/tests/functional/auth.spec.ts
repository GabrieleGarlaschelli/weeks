import { test } from '@japa/runner'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'

test.group('Auth', () => {
  test('return a token for a user', async ({ client }) => {
    const user = await UserFactory
      .merge({
        email: 'test@example.com',
        password: 'passwordtest'
      })
      .create()

    const response = await client.post('/auth/login').json({
      email: 'test@example.com',
      password: 'passwordtest'
    })

    response.assertAgainstApiSpec()

    await user.delete()
  })

  test('signup the user', async ({ client, assert }) => {
    const response = await client.post('/auth/signup').json({
      email: 'test2@example.com',
      password: 'passwordtest',
      name: 'some new name'
    })

    assert.equal(response.status(), 200)
    let users = await User.query().where('email', 'test2@example.com')
    assert.lengthOf(users, 1)
    await User.query().delete()
  })

  test('revoke a token for a user', async ({ client }) => {
    const user = await UserFactory
      .merge({
        email: 'test@example.com',
        password: 'passwordtest'
      })
      .create()


    const response = await client.post('/auth/logout').loginAs(user)

    response.assertAgainstApiSpec()

    await user.delete()
  })
})
