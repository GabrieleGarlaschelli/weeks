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
Route.post('/auth/logout', 'AuthController.logout').middleware('auth:api')
Route.get('/auth/me', 'AuthController.me').middleware('auth:api')
Route.post('/auth/google/redirect', 'AuthController.googleRedirect')
Route.post('/auth/google/callback', 'AuthController.googleCallback')
Route.resource('users', 'UsersController')
  .only([ 'index', 'store', 'update', 'show', 'destroy' ])
  .middleware('auth:api')
