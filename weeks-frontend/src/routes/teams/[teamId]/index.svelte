<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
</script>

<script lang="ts">
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation";
  import TeamService from "$lib/services/teams/teams.service"

  let team: Team
  onMount(async () => {
    let service = new TeamService({ fetch })
    team = await service.show({ id: parseInt($page.params.teamId) })
  })

  function handleOptionClick(event: any) {
    if(event.detail?.option?.name == 'edit') {
      goto('/teams/' + team.id + '/edit')
    }
  }

  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import TeamShow from "$lib/components/teams/TeamShow.svelte";
  import OptionMenu from "$lib/components/common/OptionMenu.svelte";
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title={team?.name}
    paddingTop={mAndDown ? "15px" : "40px"}
    prependVisible={true}
  >
    <svelte:fragment slot="append">
      <OptionMenu
        options={
          [
            {
              name: 'edit', 
              label: 'Modifica',
              icon: 'mdi-pencil'
            },
            {
              name: 'delete', 
              label: 'Elimina',
              icon: 'mdi-delete',
              color: '#ad0000'
            },
          ]
        }
        on:option-click={handleOptionClick}
      ></OptionMenu>
    </svelte:fragment>
  </PageTitle>

  {#if !!team}
    <TeamShow
      team={team}
    ></TeamShow>
  {:else}

  {/if}
</MediaQuery>

