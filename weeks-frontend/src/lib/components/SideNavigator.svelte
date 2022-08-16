<script lang="ts" context="module">
  export type MenuItem = {
    title: string,
    icon: string,
    name: string
  }
</script>

<script lang="ts">
  import Icon from '@likable-hair/svelte/media/Icon.svelte'
  import colors from '$lib/stores/colors';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{
    "click": {
      nativeEvent: MouseEvent,
      item: MenuItem
    }
  }>()


  export let items: MenuItem[] = [],
    selected: string | undefined = undefined

  function handleItemClick(item: MenuItem, event: MouseEvent) {
    dispatch('click', {
      item: item,
      nativeEvent: event
    })
  }
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:gap="20px"
>
  {#each items as item}
    <div 
      style:display="flex"
      style:padding-left="30px"
      style:cursor="pointer"
      on:click={(event) => handleItemClick(item, event)}
    >
      <div
        style:margin-right="30px"
      >
        <Icon 
          name={item.icon}
          color={selected == item.name ? $colors.primary : $colors.contrast}
        ></Icon>
      </div>
      <div
        style:font-size="14pt"
        style:font-weight="400"
        style:color={selected == item.name ? $colors.primary : $colors.contrast}
        style:transition="all .1s ease-in"
      >{item.title}</div>
    </div>
  {/each}
</div>
