import { test } from '@japa/runner'
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
