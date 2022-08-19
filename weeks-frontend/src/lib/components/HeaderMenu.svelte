<script lang="ts" context="module">
  import type Item from "@likable-hair/svelte/navigation/Navigator.svelte"
</script>

<script lang="ts">
  export let opened: boolean = false
  import { goto } from "$app/navigation";

  function handleItemClick(event: CustomEvent) {
    opened = false
    if(event.detail.item.name == 'home') goto('/')
    if(event.detail.item.name == 'teams') goto('/teams') 
    if(event.detail.item.name == 'notifications') goto('/notifications')
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
    {name: 'notifications', title: 'Notifiche'},
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