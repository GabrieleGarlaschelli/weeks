<script lang="ts">
  import StandardCheckbox from "./StandardCheckbox.svelte";
  import colors from "$lib/stores/colors";

  export let label: string = "",
    id: string,
    value: boolean = false,
    textColor: string = $colors.lightContrast
</script>


<div class="container">
  <StandardCheckbox
    bind:value={value}
    id={id}
    on:change
  ></StandardCheckbox>
  <slot name="label">
    <label 
      style:margin-left="0.7rem"
      style:color={textColor}
      for={id}
    >
      <slot name="text">
        {label}
      </slot>
    </label>
  </slot>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
  }
</style>