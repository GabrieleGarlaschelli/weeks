<script lang="ts">
  export let value: string | undefined,
    label: string,
    placeholder: string = "",
    name: string,
    type: 'password' | 'text' = 'text',
    error: boolean = false

  import StandardTextfield from "./StandardTextfield.svelte";
  import PasswordTextfield from "./PasswordTextfield.svelte";
</script>

<label
  style:font-weight="500"
  style:margin-left="3px"
  for={name}
>{label}</label>
<div
  style:margin-top="5px"
>
  {#if type == 'text'}
    <StandardTextfield
      bind:value={value}
      label={placeholder}
      on:input
      bind:error={error}
    ></StandardTextfield>
  {:else if type == 'password'}
    <PasswordTextfield
      bind:value={value}
      label={placeholder}
      on:input
      bind:error={error}
    ></PasswordTextfield>
  {/if}
</div>