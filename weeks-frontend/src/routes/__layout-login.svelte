<script lang="ts">
  import { onMount } from "svelte";
  import { session, page } from "$app/stores"
  import AuthService from "$lib/services/auth/auth.service"
  import { goto, beforeNavigate  } from "$app/navigation";
  import "$lib/css/global.css"
  import colors from "$lib/stores/colors"

  onMount(async () => {
    await checkAuth($page.url.pathname)
  })

  beforeNavigate(async ({from, to}) => {
    await checkAuth(to?.pathname || '/')
  })

  let loginPath: string = '/auth/Login'
  let defaultPath: string = '/'
  async function checkAuth(destinationUrl: string) {
    const authService = new AuthService({ fetch })
    if(!!$session.currentUser) return
    else if(!$session.currentUser && authService.authCookiePresent()) {
      await authService.setSession()

      if(destinationUrl == loginPath) goto(defaultPath)
    } else if(!$session.currentUser && !authService.authCookiePresent()) {
      if(destinationUrl != loginPath) goto(loginPath)
    }
  }

  onMount(() => {
    let html: HTMLElement | null = document.querySelector("html")
    if(!!html)
      html.style.backgroundColor = $colors.thinContrast
  })
</script>

<main>
  <slot></slot>
</main>

<style global>
  body {
    margin: 0px;
  }

  html {
    background-color: var(--global-background-color);
  }

  html, 
  body {
    height: 100%;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active{
      -webkit-box-shadow: 0 0 0 30px var(--global-background-color) inset !important;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: var(--global-contrast-color) !important;
}
</style>



