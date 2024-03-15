<script lang="ts">
  import PageTitle from '$lib/components/common/PageTitle.svelte'
	import ScoutStepper from '$lib/components/scout/ScoutStepper.svelte'
  import type { PageData } from './$types';
  
  export let data: PageData;
</script>

<PageTitle
  title="Nuovo scout"
  subtitle={data.team.name}
  prependVisible
></PageTitle>

<div class="mt-3">
  <ScoutStepper></ScoutStepper>
</div>