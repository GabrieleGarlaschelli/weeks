<script lang="ts" context="module">
  import type { Teammate } from '$lib/services/teams/teams.service'
  import type { Role } from '$lib/services/roles/roles.service'
  import type { Item } from '@likable-hair/svelte/forms/Autocomplete.svelte'
</script>

<script lang="ts">
  import LabelAndTextfield from '$lib/components/LabelAndTextfield.svelte';
	import RolesAutocomplete from "../roles/RolesAutocomplete.svelte";

  export let alias: string | undefined,
    team: { id: number },
    role: {
      id: number,
      name: string
    } | undefined

  let selectedRoles: Item[] = []

  $: selectedRoles = !!role ? [{
    value: role.id.toString(),
    label: role.name
  }] : []

  function handleRoleChange() {
    if(selectedRoles.length > 0 && !!selectedRoles[0].label) {
      role = {
        id: parseInt(selectedRoles[0].value),
        name: selectedRoles[0].label
      }
    } else if (selectedRoles.length == 0) {
      role = undefined
    }
  }
</script>

<div class="form">
  <div>
    <LabelAndTextfield
      label="Alias"
      name="alias"
      bind:value={alias}
    ></LabelAndTextfield>
  </div>
  <div>
    <RolesAutocomplete
      bind:values={selectedRoles}
      on:change={handleRoleChange}
      team={team}
    ></RolesAutocomplete>
  </div>
</div>