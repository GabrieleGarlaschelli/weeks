<script lang="ts">
  export let title: string,
    marginTop: string = "",
    paddingTop: string = "",
    alignItems: string = "center",
    justifyContent: string = "left",
    prependVisible: boolean = false

  function handleBackClick() {
    window.history.back()
  }
  import Icon from "@likable-hair/svelte/media/Icon.svelte";
</script>

<div
  style:font-weight="600"
  style:font-size="22pt"
  style:margin-top={marginTop}
  style:padding-top={paddingTop}
  style:display="flex"
  style:align-items={alignItems}
  style:justify-content={justifyContent}
>
  {#if prependVisible}  
    <div
      style:margin-right="15px"
    >
      <slot name="prepend">
        <Icon 
          name="mdi-arrow-left"
          click={true}
          on:click={handleBackClick}
        ></Icon>
      </slot>
    </div>
  {/if}
  {title}
</div>