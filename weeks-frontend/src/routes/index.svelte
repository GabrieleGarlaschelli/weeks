<script lang="ts">
  import { goto } from "$app/navigation";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import Subhead from "$lib/components/typography/Subhead.svelte";
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";

  function goToCreateTeam() {
    goto('/teams/new')
  }
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title="Home"
    paddingTop={mAndDown ? "15px" : "40px"}
  ></PageTitle>
  <Subhead
    text="I miei team"
    marginTop="30px"
  ></Subhead>
  <div
    style:margin-top="10px"
  >
    Ops, ancora nessun team, 
    <LinkButton 
      display="inline-block"
      on:click={goToCreateTeam}
    >Creane uno</LinkButton>
  </div>
  <Subhead
    text="Prossimi appuntamenti"
    marginTop="30px"
  ></Subhead>
  <div
    style:margin-top="10px"
  >
    Ops, ancora nessun appuntamento 
  </div>
</MediaQuery>