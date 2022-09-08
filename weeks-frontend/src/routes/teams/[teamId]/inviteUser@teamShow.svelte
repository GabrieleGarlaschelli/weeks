<script lang="ts" context="module">
  import type { User } from '$lib/services/users/user.service'
  import type { Item } from '@likable-hair/svelte/forms/Autocomplete.svelte';
</script>

<script lang="ts">
  import team from '$lib/stores/teams/teamsShow'
  import colors from '$lib/stores/colors'
  import UserService from '$lib/services/users/user.service'
  import InvitationsService, { type Invitation } from "$lib/services/invitations/invitations.service";
  import CansService from '$lib/services/roles/cans.service';

  let searchText: string, results: User[]
  async function searchUser() {
    userInvited = false
    let service = new UserService({ fetch })
    results = await service.search({ email: searchText })
  }

  let userInvited: boolean = false
  let selectedRoles: Item[]
  function inviteUser(user: any) {
    if(!!$team) {
      let service = new InvitationsService({ fetch })
      service.inviteUser({
        team: { id: $team.id },
        user: { email: user.email },
        role: !!selectedRoles && !!selectedRoles.length ? { id: parseInt(selectedRoles[0].value) } : undefined
      }).then((result) => {
        console.log(result)
        if(!!$team && !!$team.invitations) {
          $team.invitations = [
            ...$team.invitations,
            result
          ]
        }
        userInvited = true
      })
    }
  }

  function handleInvitationDiscard(event: CustomEvent<{ invitation: Invitation }>) {
    if(!!$team) {
      let service = new InvitationsService({ fetch })
      service.discardInvitation({
        invitation: event.detail.invitation
      }).then((newInvitation) => {
        if(!!$team) $team.invitations = $team.invitations?.filter(el => el.id != event.detail.invitation.id)
      })
    }
  }

  import StandardTextfield from '$lib/components/StandardTextfield.svelte';
  import StandardButton from '$lib/components/StandardButton.svelte';
  import Icon from '@likable-hair/svelte/media/Icon.svelte'
  import UsersList from '$lib/components/users/UsersList.svelte'
  import InvitationList from '$lib/components/invitations/InvitationList.svelte';
  import LinkButton from "$lib/components/LinkButton.svelte"
  import RolesAutocomplete from '$lib/components/roles/RolesAutocomplete.svelte';
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte"
  import Subhead from '$lib/components/typography/Subhead.svelte';
import InvitationToAccept from '$lib/components/invitations/InvitationToAccept.svelte';
</script>


{#if CansService.can('Team', 'invite')}
  <MediaQuery
    let:mAndDown
  >
    <div
      style:max-width="100%"
      style:width="700px"
      style:margin-bottom="0px"
      style:display="flex"
      style:flex-direction={mAndDown ? 'column' : 'row'}
    >
      <StandardTextfield
        bind:value={searchText}
        placeholder="Email"
      >
        <svelte:fragment
          slot="prepend-inner"
        >
          <div style:margin-right="10px">
            <Icon 
              name="mdi-email"
              color={$colors.lightContrast}
            ></Icon>
          </div>
        </svelte:fragment>
      </StandardTextfield>
      {#if !!$team} 
      <div
        style:margin-left={mAndDown ? "0px" : "10px"}
      >
        <RolesAutocomplete
          width={mAndDown ? '100%' : '300px'}
          team={$team}
          bind:values={selectedRoles}
        ></RolesAutocomplete>
      </div>
      {/if}
      <div
        style:margin-left={mAndDown ? "0px" : "10px"}
        style:margin-top={mAndDown ? "10px" : "0px"}
      >
        <StandardButton
          on:click={searchUser}
        >Cerca</StandardButton>
      </div>
    </div>


    {#if !!results && results.length > 0 && !userInvited}
      <UsersList
        users={results}
      >
        <svelte:fragment slot="appendLastColumn" let:item>
          <Icon
            name="mdi-account-plus"
            click
            on:click={() => inviteUser(item)}
          ></Icon>
        </svelte:fragment>
      </UsersList>
    {:else if !!results && results.length == 0 && !userInvited}
      <div
        style:margin-top="20px"
        style:display="flex"
        style:justify-content="center"
      >
        <div
          style:max-width="100%"
          style:width="400px"
          style:text-align="center"
        >
          Ops, sembra che la mail digitata non esista. 
          <br />
          <LinkButton 
            display="inline-block"
            on:click={() => inviteUser({
              email: searchText
            })}
          >Vuoi invitare lo stesso la mail?</LinkButton> 
          <br />
          quando l'utente si registrerà con questa mail
          visualizzerà il tuo invito.
        </div>
      </div>
    {:else if userInvited}
      <div
        style:margin-top="20px"
        style:display="flex"
        style:justify-content="center"
        style:align-items="center"
        style:flex-direction="column"
      >
        <div
          style:max-width="100%"
          style:width="400px"
          style:text-align="center"
        >Untente invitato, in attesa della sua conferma</div>
        <div 
          style:margin-top="10px"
        >
          <Icon
            size={40}
            name="mdi-party-popper"
          ></Icon>
        </div>
      </div>
    {/if}

    <div style:margin-top="20px">
      <Subhead text="Inviti in attesa"></Subhead>
    </div>
    <div style:margin-top="10px">
      <InvitationList
        invitations={$team?.invitations}
        on:discard={handleInvitationDiscard}
      ></InvitationList>
    </div>
  </MediaQuery>
{:else}
  Non puoi accedere a questa pagina :(
{/if}

