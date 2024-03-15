<script lang="ts">
	import type { PageData } from './$types'
  import { SelectableVerticalList } from '@likable-hair/svelte';
  import { goto } from '$app/navigation'

	export let data: PageData

  function handleTeamSelection(event: CustomEvent<{ element: { name: string | number }}>) {
    let teamId = event.detail.element.name
    goto('/teams/' + teamId + '/scout/new')
  }
</script>

<div 
  class="flex items-center justify-center flex-col"
  style:height="calc(100dvh - 3.5rem - 32px)"
>
  <div class="text-4xl font-black">Scouting 🏆</div>
  <div class="text-center mt-10">Per quale team vuoi iniziare lo scout?</div>

  <div class="w-[400px] max-w-[90dvw] mt-4 bg-[rgb(var(--global-color-background-200))] rounded-md">
    <SelectableVerticalList
      elements={data.paginatedTeams.data.map((team) => {
        return {
          name: team.id,
          title: team.name,
          description: team.teammates.length == 1 ? '1 membro' : team.teammates.length + ' membri'
        }
      })}
      on:select={handleTeamSelection}
    ></SelectableVerticalList>
  </div>
  <div class="mt-4">oppure <a class="underline text-[rgb(var(--global-color-primary-500))]" href="/scout/new">creane uno senza</a></div>
</div>
