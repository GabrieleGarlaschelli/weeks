<script lang="ts" context="module">
  import type { Teammate, Team } from '$lib/services/teams/teams.service'
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
</script>

<script lang="ts">
  export let teammates: Teammate[] = [],
    searchable: boolean = false,
    value: {
      [key: number]: boolean
    } = { }

  let searchText: string
  $: filteredTeammates = !!searchText ? teammates.filter((teammate) => {
    return teammate.user.name.toLowerCase().includes(searchText.toLowerCase())
  }) : teammates

  function handleChange(teammate: Teammate, event: any) {
    value[teammate.id] = event.target.checked
  }

  import StandardTextfield from '$lib/components/StandardTextfield.svelte';
  import Icon from '@likable-hair/svelte/media/Icon.svelte';
  import colors from '$lib/stores/colors';
  import LabelAndCheckbox from '../LabelAndCheckbox.svelte';
</script>


{#if searchable}
  <div
    style:width="100%"
    style:margin-bottom="0px"
    style:display="flex"
  >
    <StandardTextfield
      bind:value={searchText}
      maxWidth="300px"
      placeholder="Cerca partecipanti ..."
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
  </div>
{/if}

<div
  style:max-width="100%"
  style:overflow="auto"
>
  {#each filteredTeammates as teammate}
    <div
      style:margin-top="10px"
      style:margin-bottom="10px"
    >
      <LabelAndCheckbox
        id={`check-convocation-${teammate.id}`}
        value={value[teammate.id]}
        label={teammate.user.name}
        textColor={$colors.contrast}
        on:change={(event) => handleChange(teammate, event)}
      ></LabelAndCheckbox>
    </div>
  {/each}
</div>