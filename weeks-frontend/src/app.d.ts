/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Stuff {}

  interface Session {
    currentUser: import("$lib/services/user/user.service").User
  }
}
