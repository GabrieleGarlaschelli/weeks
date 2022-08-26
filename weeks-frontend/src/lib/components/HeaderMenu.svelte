<script lang="ts" context="module">
  import type Item from "@likable-hair/svelte/navigation/Navigator.svelte"
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import AuthService from "$lib/services/auth/auth.service";

  export let opened: boolean = false

  function handleItemClick(event: CustomEvent) {
    opened = false
    if(event.detail.item.name == 'home') goto('/')
    else if(event.detail.item.name == 'teams') goto('/teams') 
    else if(event.detail.item.name == 'notifications') goto('/notifications')
    else if(event.detail.item.name == 'logout') handleLogout()
  }

  function handleLogout() {
    const service = new AuthService({ fetch })
    service.logout().then(() => {
      goto("/auth/Login")
    })
  }

  import { session } from "$app/stores";
  import colors from "$lib/stores/colors";
  import HeaderMenu from "@likable-hair/svelte/navigation/HeaderMenu.svelte";
  import UserAvatar from "./UserAvatar.svelte";
</script>

<HeaderMenu
  backgroundColor={$colors.primary}
  color={$colors.background}
  title="Weeks"
  items={[
    {name: 'home', title: 'Home'},
    {name: 'teams', title: 'Teams'},
    // {name: 'notifications', title: 'Notifiche'},
    {name: 'logout', title: 'Logout'}
  ]}
  bind:openDrawer={opened}
  on:item-click={handleItemClick}
>
  <div slot="append">
    <UserAvatar
      username={$session?.currentUser?.name}
      src={$session?.currentUser?.avatarUrl}
    ></UserAvatar>
  </div>
</HeaderMenu>