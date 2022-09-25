<script lang="ts" context="module">
  export type Option = {
    value: string | number,
    text: string
  }
</script>

<script lang="ts">
  export let options: Option[],
    value: string | number

</script>

<select 
  bind:value={value} 
  on:change
  class="select"
>
  {#each options as option}
    <option value={option.value}>
      {option.text}
    </option>
  {/each}
</select>

<style>
  .select {
    height: 30px;
    color: var(--global-contrast-color);
    background-color: var(--global-background-color);
  }
</style>