<script lang="ts" context="module">
  export type Team = {
    name: string,
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{
    "teams-click": {
      nativeEvent: MouseEvent,
      team: Team
    }
  }>()

  export let teams: Team[] = [],
    loading: boolean = false,
    searchable: boolean = false,
    marginTop: string | undefined = undefined,
    marginBottom: string | undefined = undefined

  function goToCreateTeam() {
    goto('/teams/new')
  }

  function handleTeamClick(event: MouseEvent, team: Team) {
    dispatch("teams-click", {
      nativeEvent: event,
      team: team
    })
  }

  let searchText: string
  $: filteredTeams = !!searchText ? teams.filter((team) => {
    return team.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
  }) : teams

  import colors from "$lib/stores/colors"
  import CircularLoader from "@likable-hair/svelte/loaders/CircularLoader.svelte"
  import LinkButton from "$lib/components/LinkButton.svelte"
  import Icon from "@likable-hair/svelte/media/Icon.svelte"
  import StandardTextfield from "$lib/components/StandardTextfield.svelte";
</script>


<div 
  style:margin-top={marginTop}
  style:margin-bottom={marginBottom}
>
  {#if searchable}
    <div
      style:max-width="100%"
      style:width="400px"
      style:margin-bottom="10px"
    >
      <StandardTextfield
        bind:value={searchText}
        placeholder="Cerca team ..."
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
  <div class="teams-container">
    {#if loading}
      <CircularLoader></CircularLoader>
    {:else if teams.length > 0}
      {#each filteredTeams as team}
        <div 
          style:background-color={$colors.thinContrast}
          style:padding="15px"
          style:font-weight="600"
          style:font-size="1.3rem"
          style:border-radius="5px"
          style:display="flex"
          style:cursor="pointer"
          on:click={(event) => handleTeamClick(event, team)}
        >
          <div>
            {team.name}
          </div>
          <div
            style:margin-left="10px"
          >
            <Icon
              name="mdi-arrow-right"
            ></Icon>
          </div>
        </div>
      {/each}
    {:else}
      Ops, ancora nessun team, 
      <LinkButton 
        display="inline-block"
        on:click={goToCreateTeam}
      >Creane uno</LinkButton>
    {/if}
  </div>
</div>

<style>
  .teams-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px
  }
</style>

