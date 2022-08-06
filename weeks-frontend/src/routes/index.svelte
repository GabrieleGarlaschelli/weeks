<script lang="ts">
  import LinkButton from "$lib/components/LinkButton.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import Subhead from "$lib/components/typography/Subhead.svelte";

  function goToCreateTeam() {

  }
</script>

<PageTitle
  title="Home"
  paddingTop="40px"
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