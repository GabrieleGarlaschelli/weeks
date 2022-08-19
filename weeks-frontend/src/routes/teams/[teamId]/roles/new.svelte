<script lang="ts" context="module">
  import type Role from '$lib/services/roles/roles.service'
</script>

<script lang="ts">
  import RolesService from '$lib/services/roles/roles.service'
  import { goto } from '$app/navigation';

  let role: {
    name?: string,
  } = {}
  let loading = false

  function handleSubmit() {
  }

  function handleCancel() {
  }

  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title="Nuovo ruolo"
    paddingTop={mAndDown ? "15px" : "40px"}
    prependVisible={true}
  ></PageTitle>

  <div 
    style:margin-top="20px"
  >
    nuovo ruolo
  </div>
</MediaQuery>