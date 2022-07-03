import * as cookie from 'cookie'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }: any) {
  if (event.url.pathname.startsWith('/custom')) {
    return new Response('custom response');
  }

  event.locals.pippo = 'pluto'

  const response = await resolve(event);
  return response;
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event: any) {
  return event.locals
}