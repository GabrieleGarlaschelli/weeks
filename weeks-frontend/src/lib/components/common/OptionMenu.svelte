<script lang="ts" context="module">
  import type { Option } from '$lib/components/common/OptionSelector.svelte'
</script>

<script lang="ts">
  export let options: Option[] = []
    
  let activator: HTMLElement,
    open: boolean = false,
    closeOnOptionClick: boolean = true

  function handleIconClick() {
    open = !open
  }

  function handleOptionClick() {
    if(closeOnOptionClick) open = false
  }

  import OptionSelector from '$lib/components/common/OptionSelector.svelte';
  import MediaQuery from '@likable-hair/svelte/common/MediaQuery.svelte';
  import Drawer from '@likable-hair/svelte/navigation/Drawer.svelte';
  import Menu from '@likable-hair/svelte/common/Menu.svelte'
  import Icon from '@likable-hair/svelte/media/Icon.svelte'
  import colors from '$lib/stores/colors'
</script>


<MediaQuery
  let:mAndDown
>
  <div bind:this={activator}>
    <Icon
      name="mdi-dots-horizontal"
      click
      color={$colors.contrast}
      on:click={handleIconClick}
    ></Icon>
  </div>
  {#if mAndDown}
    <Drawer
      position="bottom"
      bind:open={open}
      space={options.length * 50 + "px"}
    >
      <div
        style:background-color={$colors.background}
      >
        <OptionSelector
          optionHeight="50px"
          options={options}
          on:option-click={handleOptionClick}
          on:option-click
        ></OptionSelector>
      </div>
    </Drawer>
  {:else}
    <Menu
      bind:activator={activator}
      bind:open={open}
      width="200px"
      height="auto"
      maxHeight="300px"
      closeOnClickOutside={true}
      boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
    >
      <div 
        style:border-color={$colors.thinContrast}
        class="menu-card"
      >
        <OptionSelector
          options={options}
          on:option-click={handleOptionClick}
          on:option-click
        ></OptionSelector>
      </div>
    </Menu>
  {/if}
</MediaQuery>

<style>
  .menu-card {
    border-radius: 5px;
    height: 100%;
    border: 1px solid;
  }
</style>