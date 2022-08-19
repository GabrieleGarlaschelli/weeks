<script lang="ts" context="module">
  import type { Role } from '$lib/services/roles/roles.service'
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
  import type { Team } from '$lib/services/teams/teams.service'
</script>

<script lang="ts">
  import { goto } from '$app/navigation';

  export let roles: Role[] = [],
    team: Team | undefined = undefined,
    searchable: boolean = false

  let headers: Header[] = [
    {
      value: "id",
      label: "Id",
      type: 'number',
    },
    {
      value: "name",
      label: "Nome",
      type: 'string',
    }
  ]

  let searchText: string

  function goToNewRole(event: any) {
    if(!!team) {
      goto(`/teams/${team.id}/roles/new`)
    }
  }

  import StandardTable from '$lib/components/common/StandardTable.svelte';
  import StandardTextfield from '$lib/components/StandardTextfield.svelte';
  import Icon from '@likable-hair/svelte/media/Icon.svelte';
  import colors from '$lib/stores/colors';
  import StandardButton from '../StandardButton.svelte';
</script>


{#if searchable}
  <div
    style:max-width="100%"
    style:width="400px"
    style:margin-bottom="0px"
    style:display="flex"
  >
    <StandardTextfield
      bind:value={searchText}
      placeholder="Cerca ruoli ..."
    >
      <svelte:fragment
        slot="prepend-inner"
      >
        <div style:margin-right="10px">
          <Icon 
            name="mdi-search-web"
            color={$colors.lightContrast}
          ></Icon>
        </div>
      </svelte:fragment>
    </StandardTextfield>
    <div
      style:margin-left="10px"
    >
      <StandardButton
        on:click={goToNewRole}
      >Nuovo</StandardButton>
    </div>
  </div>
{/if}

<StandardTable
  headers={headers}
>
  <slot name="appendLastColumn">
    pippo
  </slot>
</StandardTable>