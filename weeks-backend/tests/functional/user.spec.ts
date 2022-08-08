import { test } from '@japa/runner'
import { assert } from 'chai'
import { UserFactory } from 'Database/factories'

test.group('Users', (group) => {
  let loggedInUser

  group.setup(async () => {
    loggedInUser = await UserFactory.create()
  })

  test('get a paginated list of existing users', async ({ client }) => {
    await UserFactory.create()
    const response = await client.get('/users').loginAs(loggedInUser)

    response.assertAgainstApiSpec()
  })

  test('create a new user', async ({ client }) => {
    const response = await client.post('/users').json({
      email: 'someemail@email.com',
      password: 'some_secret_password',
      name: 'some name'
    }).loginAs(loggedInUser)

    response.assertAgainstApiSpec()
    const user = response.body()
    assert.hasAnyKeys(user, ['id'], 'should have the id key')
  })

  test('get a user', async ({client}) => {
    const newUser = await UserFactory.create()
    const response = await client.get('/users/' + newUser.id).loginAs(loggedInUser)

    response.assertAgainstApiSpec()
    const user = response.body()
    assert.equal(newUser.id, user.id, "should return the correct user")
  })

  test('update an existing user', async ({ client }) => {
    const newUser = await UserFactory.create()
    const response = await client.put('/users/' + newUser.id).json({
      email: 'someotheremail@email.com'
    }).loginAs(loggedInUser)

    response.assertAgainstApiSpec()
    const user = response.body()
    assert.equal(newUser.id, user.id, "should update the correct user")
    assert.equal(user.email, 'someotheremail@email.com', "should update the user")
  })
})
