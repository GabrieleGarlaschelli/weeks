<script context="module" lang="ts">
  export async function load({params, session, stuff}: any) {
    return {}
  }
</script>

<script lang="ts">
  import AuthService from '$lib/services/auth/auth.service'
  import colors from '$lib/stores/colors'
  import { goto } from '$app/navigation';

  let email: string = "", 
    password: string = "",
    passwordConfirmation: string = "",
    firstname: string = "",
    lastname: string = "",
    userCreated: boolean = false,
    acceptPrivacy: boolean = false,
    loading: boolean = false

  function signup() {
    if(disabled) return
    loading = true

    setTimeout(() => {
      loading = false
      userCreated = true
    }, 1000);

    const service = new AuthService({ fetch })
    service.signup({
      data: {
        email,
        password,
        name: `${firstname} ${lastname}`
      }
    }).then(() => {
      loading = false
      userCreated = true
    })
  }

  function goToLogin() {
    goto('/auth/Login')
  }

  $: passValid = !!password && !!passwordConfirmation && password == passwordConfirmation
  $: disabled = !passValid || !lastname || !firstname || !email || !acceptPrivacy

  import StandardButton from '$lib/components/StandardButton.svelte';
  import LabelAndTextfield from '$lib/components/LabelAndTextfield.svelte';
  import LabelAndCheckbox from '$lib/components/LabelAndCheckbox.svelte';
  import LinkButton from '$lib/components/LinkButton.svelte';

</script>

<div 
  class="container"
  style:background-color={$colors.thinContrast}
>
  <div 
    class="card"
    style:background-color={$colors.background}
  >
    <h2>Sign up</h2>
    <hr 
      style:background-color={$colors.thinContrast}
      style:border="none"
      style:height="1px"
    />
    {#if userCreated}
      <div 
        style:margin-top="20px"
        style:margin-bottom="20px"
        style:display="flex"
        style:align-items="center"
        style:flex-direction="column"
      >
        <div
          style:color={$colors.lightContrast}
          style:margin-bottom="15px"
        >L'utente è stato creato con successo, ora puoi eseguire il login.</div>
        <LinkButton on:click={() => goto('/auth/Login')}>Log in</LinkButton>
      </div>
    {:else}
      <div>
        <form
          style:margin-top="20px"
        >
          <div
            style:display="flex"
            style:gap="10px"
          >
            <div 
              style:width="calc(50% - 5px)"
            >
              <LabelAndTextfield
                label="Nome"
                placeholder="Nome"
                name="firstname"
                bind:value={firstname}
              ></LabelAndTextfield>
            </div>
            <div 
              style:width="calc(50% - 5px)"
            >
              <LabelAndTextfield
                label="Cognome"
                placeholder="Cognome"
                name="lastname"
                bind:value={lastname}
              ></LabelAndTextfield>
            </div>
          </div>
          <LabelAndTextfield
            label="Email"
            placeholder="email"
            name="email"
            bind:value={email}
          ></LabelAndTextfield>
          <LabelAndTextfield
            label="Password"
            name="password"
            type="password"
            bind:value={password}
            error={!passValid && !!password && !!passwordConfirmation}
          ></LabelAndTextfield>
          <LabelAndTextfield
            label="Conferma password"
            name="password-confirmation"
            type="password"
            bind:value={passwordConfirmation}
            error={!passValid && !!password && !!passwordConfirmation}
          ></LabelAndTextfield>
          <div
            style:margin-top="10px"
          >
            <LabelAndCheckbox
              bind:value={acceptPrivacy}
              id="accept-privacy"
              label="Accetto i termini della privacy"
            ></LabelAndCheckbox>
          </div>
        </form>
        <div
          style:margin-top="20px"
          style:margin-bottom="20px"
        >
          <StandardButton
            on:click={signup}
            disabled={disabled}
            loading={loading}
          >Signup</StandardButton>
        </div>
        <hr 
          style:background-color={$colors.thinContrast}
          style:border="none"
          style:height="1px"
        />
        <div 
          style:margin-top="20px"
          style:margin-bottom="20px"
          style:display="flex"
          style:align-items="center"
          style:flex-direction="column"
        >
          <div
            style:color={$colors.lightContrast}
            style:margin-bottom="5px"
          >Already have an account?</div>
          <LinkButton on:click={goToLogin}>Log in</LinkButton>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .card {
    padding: 10px 20px 10px 20px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 10px;
    box-sizing: border-box;
  }

  h2 {
    font-weight: 500;
  }

  @media (min-width: 425px) {
    .card {
      max-width: 90vw;
      width: 500px;
    }
  }

  @media (max-width: 424.98px){
    .card {
      width: 100vw;
      height: 100vh;
      border-radius: 0px;
      overflow: auto;
    }
  }
</style>