/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/auth/login', 'AuthController.login')
Route.post('/auth/signup', 'AuthController.signup')
Route.post('/auth/logout', 'AuthController.logout').middleware('auth:api')
Route.get('/auth/me', 'AuthController.me').middleware('auth:api')
Route.get('/auth/google/redirect', 'AuthController.googleRedirect')
Route.get('/auth/google/callback', 'AuthController.googleCallback')

Route.resource('teams', 'TeamsController')
  .only(['index', 'store', 'update', 'show', 'destroy'])
  .middleware({
    '*': ['auth:api']
  })
  
Route.resource('users', 'UsersController')
  .only([ 'index', 'store', 'update', 'show', 'destroy' ])
  .middleware({
    '*': ['auth:api']
  })

Route.post('/invitations/inviteUser', 'InvitationsController.inviteUser').middleware('auth:api')
Route.get('/invitations/list', 'InvitationsController.list').middleware('auth:api')
Route.post('/invitations/accept', 'InvitationsController.accept').middleware('auth:api')
Route.post('/invitations/reject', 'InvitationsController.reject').middleware('auth:api')
Route.post('/invitations/discard', 'InvitationsController.discard').middleware('auth:api')

Route.post('/events', 'EventsController.store').middleware('auth:api')
Route.post('/events/createWithFrequency', 'EventsController.createWithFrequency').middleware('auth:api')
Route.get('/events', 'EventsController.index').middleware('auth:api')
Route.put('/events/:id', 'EventsController.update').middleware('auth:api')
Route.delete('/events/:id', 'EventsController.destroy').middleware('auth:api')
Route.get('/events/:id', 'EventsController.show').middleware('auth:api')

Route.resource('eventSessions', 'EventSessionsController')
  .only(['index', 'store', 'update', 'show', 'destroy'])
  .middleware({
    '*': ['auth:api']
  })