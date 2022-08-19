<script lang="ts" context="module">
  import type { User } from '$lib/services/users/user.service'
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
</script>

<script lang="ts">
  export let users: User[] = []

  let headers: Header[] = [
    {
      value: "name",
      label: "Nome",
      type: 'string',
    },
    {
      value: "email",
      label: "Email",
      type: 'string',
    }
  ]

  import StandardTable from '$lib/components/common/StandardTable.svelte';
</script>


<div
  style:max-width="100%"
  style:overflow="auto"
>
  <StandardTable
    headers={headers}
    items={users}
  >
    <div 
      style:display="flex"
      style:justify-content="end"
      slot="appendLastColumn" 
      let:item
    >
      <slot 
        name="appendLastColumn"
        item={item}
      ></slot>
    </div>
  </StandardTable>
</div>