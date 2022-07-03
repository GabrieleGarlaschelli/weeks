<script context="module" lang="ts">
  export async function load({params, session, stuff}: any) {
    return {}
  }
</script>

<script lang="ts">
  import AuthService from '$lib/services/auth/auth.service'
  import colors from '$lib/stores/colors'
  import { goto } from '$app/navigation';

  let email: string = "", password: string = "";

  function login() {
    const service = new AuthService({ fetch })
    service.login({
      data: {
        email,
        password
      }
    }).then(() => {
      goto('/')
    })
  }

  import StandardButton from '$lib/components/StandardButton.svelte';
  import LabelAndTextfield from '$lib/components/LabelAndTextfield.svelte';
  import LinkButton from '$lib/components/LinkButton.svelte';
  import LabelAndCheckbox from '$lib/components/LabelAndCheckbox.svelte';
  import Icon from "@likable-hair/svelte/media/Icon.svelte"
</script>

<div 
  class="container"
  style:background-color={$colors.thinContrast}
>
  <div 
    class="card"
    style:background-color={$colors.background}
  >
    <h2>Log in</h2>
    <div
      style:margin-top="20px"
      style:margin-bottom="20px"
    >
      <StandardButton
        type="standard"
      >
        <Icon 
          name="mdi-google" 
          color={$colors.contrast} 
          size={11}
        ></Icon>
        <span style:margin-left="10px">
          Log in with Google
        </span>
      </StandardButton>
    </div>
    <hr 
      style:background-color={$colors.thinContrast}
      style:border="none"
      style:height="1px"
    />
    <form
      style:margin-top="20px"
    >
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
      ></LabelAndTextfield>
      <div
        style:margin-top="10px"
      >
        <LabelAndCheckbox
          id="remember-me"
          label="Remember me"
        ></LabelAndCheckbox>
      </div>
    </form>
    <div
      style:margin-top="20px"
    >
      <StandardButton
        on:click={login}
      >Login</StandardButton>
    </div>
    <div 
      style:margin-top="20px"
      style:margin-bottom="20px"
      style:display="flex"
      style:justify-content="center"
    >
      <LinkButton>Forgot Password?</LinkButton>
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
      >Don't have an account?</div>
      <LinkButton>Sign up</LinkButton>
    </div>
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
      width: 300px;
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