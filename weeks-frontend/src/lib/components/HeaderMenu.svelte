<script lang="ts" context="module">
  import type Item from "@likable-hair/svelte/navigation/Navigator.svelte"
</script>

<script lang="ts">
  export let opened: boolean = false
  function handleItemClick(event: CustomEvent) {
    opened = false
    console.log(event.detail.item)
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
    {name: 'calendar', title: 'Calendario'},
  ]}
  bind:openDrawer={opened}
  on:item-click={handleItemClick}
>
  <div slot="append">
    <UserAvatar
      username={""}
      src={$session?.currentUser?.avatarUrl}
    ></UserAvatar>
  </div>
</HeaderMenu>