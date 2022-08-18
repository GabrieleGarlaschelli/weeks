<script lang="ts" context="module">
  export type Option = {
    name: string,
    label: string,
    icon?: string,
    color?: string
  }
</script>

<script lang="ts">
  export let options: Option[] = [],
    padding: string = "0px",
    optionPadding: string = "0px 20px 0px 10px",
    optionHeight: string = "35px"

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{
    "option-click": {
      nativeEvent: MouseEvent,
      option: Option
    }
  }>()

  function handleOptionClick(event: MouseEvent, option: Option) {
    dispatch('option-click', {
      option,
      nativeEvent: event
    })
  }

  import colors from "$lib/stores/colors"
  import Icon from "@likable-hair/svelte/media/Icon.svelte";
</script>

<div 
  style:padding={padding}
  style:background-color={$colors.background}
  style:--option-selector-hover-background-color={$colors.thinContrast}
  class="options-container"
>
  {#each options as option}
    <div 
      style:height={optionHeight}
      style:padding={optionPadding}
      class="option-container"
      on:click={(event) => handleOptionClick(event, option)}
    >
      {#if !!option.icon}
        <div
          style:margin-right="10px"
        >
          <Icon 
            name={option.icon}
            color={option.color || $colors.contrast}
            size={12}
          ></Icon>
        </div>
      {/if}
      <div
        style:color={option.color}
      >{option.label}</div>
      <div class="spacer"></div>
      <div>
        <slot 
          name="option-append"
          option={option}
        ></slot>
      </div>
    </div>
  {/each}
</div>

<style>
  .options-container {
    display: flex;
    flex-direction: column;
  }

  .option-container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .option-container:hover {
    background-color: var(--option-selector-hover-background-color);
  }

  .spacer {
    flex-grow: 1;
  }
</style>