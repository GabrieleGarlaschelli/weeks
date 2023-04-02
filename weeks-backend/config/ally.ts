/**
 * Config source: https://git.io/JOdi5
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { AllyConfig } from '@ioc:Adonis/Addons/Ally'

/*
|--------------------------------------------------------------------------
| Ally Config
|--------------------------------------------------------------------------
|
| The `AllyConfig` relies on the `SocialProviders` interface which is
| defined inside `contracts/ally.ts` file.
|
*/
const allyConfig: AllyConfig = {
	/*
	|--------------------------------------------------------------------------
	| Google driver
	|--------------------------------------------------------------------------
	*/
	google: {
		driver: 'google',
		clientId: Env.get('GOOGLE_CLIENT_ID'),
		clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: Env.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3333/auth/google/callback',
  }, 
  googleIos: {
    driver: 'google',
    clientId: Env.get('GOOGLE_IOS_CLIENT_ID'),
    clientSecret: Env.get('GOOGLE_IOS_CLIENT_SECRET'),
    callbackUrl: Env.get('GOOGLE_IOS_CALLBACK_URL') || 'http://localhost:3333/auth/googleios/callback',
  }
}

export default allyConfig
