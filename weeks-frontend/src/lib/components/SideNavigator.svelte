<script lang="ts" context="module">
  export type MenuItem = {
    title: string,
    icon: string,
    name: string
  }
</script>

<script lang="ts">
  export let items: MenuItem[] = [],
    selected: string | undefined = undefined

  import Icon from '@likable-hair/svelte/media/Icon.svelte'
  import colors from '$lib/stores/colors';
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
      >{item.title}</div>
    </div>
  {/each}
</div>
