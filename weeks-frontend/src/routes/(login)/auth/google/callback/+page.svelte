<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { page } from "$app/stores"
  import AuthService from "$lib/services/auth/auth.service"

  onMount(async () => {
    let token = $page.url.searchParams.get('token')
    let refreshToken = $page.url.searchParams.get('refreshToken')
    let expiresAt = $page.url.searchParams.get('expires_at')
    let refreshTokenExpiration = $page.url.searchParams.get('refreshTokenExpiration')

    if(!!token && !!expiresAt) {
      const service = new AuthService({ fetch })
      await service.loginWithGoogleCallback({ 
        token: token,
        refreshToken: refreshToken!,
        refreshTokenExpiresAt: new Date(refreshTokenExpiration!),
        expiresAt: new Date(expiresAt)
      })

      // had to set the timeout because redirection was going too fast
      setTimeout(() => {
        goto('/')
      }, 400);
    }
  })
</script>