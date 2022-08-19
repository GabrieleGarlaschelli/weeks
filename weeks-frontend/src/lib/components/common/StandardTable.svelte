<script lang="ts" context="module">
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
</script>

<script lang="ts">
  export let headers: Header[] = [],
    items: { [key: string]: any }[] = []

  import SimpleTable from "@likable-hair/svelte/common/SimpleTable.svelte"
</script>

<SimpleTable
  headers={headers}
  items={items}
>
  <svelte:fragment slot="appendLastColumn" let:item>
    <slot name="appendLastColumn" item={item}></slot>
  </svelte:fragment>
</SimpleTable>