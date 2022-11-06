<script lang="ts" context="module">
  import type { Chip } from "$lib/components/common/ChipMultipleSelection.svelte"
  import type { Role } from "$lib/services/roles/roles.service"
</script>

<script lang="ts">
  import ChipMultipleSelection from "$lib/components/common/ChipMultipleSelection.svelte";
  import RolesService from '$lib/services/roles/roles.service'

  export let team: { id: number },
    value: Chip[],
    onlyConvocable: boolean = false

  
  let roles: Role[],
    filteredChips: Chip[]

  async function loadRoles() {
    if(!!team) {
      let service = new RolesService({ fetch })
      let response = await service.list({ team: team })
      roles = response.data
    }
  }

  $: if(!!team) loadRoles()
  $: filteredChips = !!roles ? roles
    .filter((role) => {
      return !onlyConvocable || (onlyConvocable && role.convocable)
    }).map((role): Chip => {
      return {
        value: role.id.toString(),
        label: role.name
      }
    }) : []
</script>

<ChipMultipleSelection
  bind:chips={filteredChips}
  bind:value={value}
></ChipMultipleSelection>