<script lang="ts" context="module">
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
</script>

<script lang="ts">
  export let headers: Header[] = [],
    items: { [key: string]: any }[] = [],
    width: string = "auto"

  import SimpleTable from "@likable-hair/svelte/common/SimpleTable.svelte"
  import colors from '$lib/stores/colors';
</script>

<SimpleTable
  headers={headers}
  items={items}
  width={width}
  headerColor={$colors.thinContrast}
>
  <svelte:fragment slot="appendLastColumn" let:item>
    <slot name="appendLastColumn" item={item}></slot>
  </svelte:fragment>

  <svelte:fragment slot="customColumn" let:item let:header>
    <slot name="customColumn" item={item} header={header}></slot>
  </svelte:fragment>
</SimpleTable>