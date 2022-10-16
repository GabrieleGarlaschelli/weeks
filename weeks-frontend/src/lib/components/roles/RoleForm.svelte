<script lang="ts" context="module">
  import type { RoleCans } from "$lib/services/roles/roles.service";

  export type Role = {
    name?: string,
    convocable?: boolean,
    team?: { id: number },
    cans?: RoleCans
  }
</script>

<script lang="ts">
  import LabelAndTextfield from "$lib/components/LabelAndTextfield.svelte"
  import RolesService, { resources } from "$lib/services/roles/roles.service";

  export let role: Role = {
      name: undefined,
    },
    mode: 'create' | 'update' = 'create',
    padding: string | undefined = undefined,
    margin: string | undefined = undefined,
    width: string | undefined = undefined,
    height: string | undefined = undefined

  let closureStatus: { [key: string]: boolean } = {}

  function getActions(resource: string) {
    return RolesService.getActionsForResource(resource)
  }

  function translateAction(action: string) {
    return RolesService.translateActions(action)
  }

  function handleCheckChange(resource: string, action: string, event: any) {
    // @ts-ignore
    if(!role.cans) role.cans = {}
    // @ts-ignore
    if(!role.cans[resource]) role.cans[resource] = {}
    // @ts-ignore
    role.cans[resource][action] = event.target.checked
  }

  import Subhead from "$lib/components/typography/Subhead.svelte";
  import Icon from "@likable-hair/svelte/media/Icon.svelte";
  import LabelAndCheckbox from "$lib/components/LabelAndCheckbox.svelte";
  import { slide } from "svelte/transition";
  import colors from "$lib/stores/colors";
</script>

<form
  style:padding={padding}
  style:margin={margin}
  style:width={width}
  style:height={height}
>
  <LabelAndTextfield
    label="Nome"
    name="name"
    bind:value={role.name}
  ></LabelAndTextfield>
  <Subhead>Poteri</Subhead>
  <div class="resources-container">
    {#each resources as resource}
      {#if !!getActions(resource)}
        <div class="resource">
          <div 
            class="resource-title-container" 
            on:click={() => closureStatus[resource] = !closureStatus[resource]}
          >
            <div class="resource-title">{RolesService.translateResource(resource)}</div>
            <div 
              class="expand-icon"
              class:reverse={closureStatus[resource]}
            >
              <Icon name="mdi-menu-down"></Icon>
            </div>
          </div>
          {#if closureStatus[resource]}
            <div transition:slide|local={{duration: 200}}>
              {#each getActions(resource) as action}
                <div
                  style:margin-top="10px"
                >
                  <LabelAndCheckbox
                    value={!!role.cans && !!role.cans[resource] ? role.cans[resource][action] : false}
                    label={translateAction(action)}
                    textColor={$colors.contrast}
                    id={`${resource}-${action}`}
                    on:change={(event) => handleCheckChange(resource, action, event)}
                  ></LabelAndCheckbox>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
  <div class="convocable-flag">
    <LabelAndCheckbox
      label="Convocabile"
      bind:value={role.convocable}
      id="convocable"
    ></LabelAndCheckbox>  
  </div>
</form>

<style>
  @media (max-width: 768px) {
    .resource {
      width: 100%;
    }
  }

  @media (min-width: 769px){
    .resource {
      width: 300px;
    }
  }

  .reverse {
    transform: rotate(180deg);
  }

  .expand-icon {
    transition: all .2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .resources-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }

  .convocable-flag {
    margin-top: 20px;
  }

  .resource {
    background-color: var(--global-thin-contrast-color);
    padding: 10px;
    border-radius: 5px;
    height: fit-content;
  }

  .resource-title-container {
    display: flex;  
  }

  .resource-title {
    font-weight: 700;
    font-size: 1.2rem;
    flex-grow: 1;
  }
</style>

