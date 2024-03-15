<script lang="ts" context="module">

</script>

<script lang="ts">
	import { Icon } from "@likable-hair/svelte"

  export let steps: {
      name: string | number,
      title: string,
      data?: any,
      completed?: boolean
    }[] = [],
    autonomusCompleted: boolean = false,
    currentStep: string | undefined = undefined


  function handleStepClick(step: typeof steps[number]) {
    step.completed = true
    steps = [...steps]
  }
</script>

<ol class="stepper-container">
  {#each steps as step, i}
    <button
      class="step" 
      class:linked={i !== steps.length - 1}
      class:completed={step.completed}
      class:link-completed={i !== steps.length - 1 && steps[i + 1]?.completed}
      on:click={() => handleStepClick(step)}
    >
      {#if step.completed}
        <div class="completed-label-chip">
          <Icon name="mdi-check" --icon-color="rgb(var(--global-color-grey-50))"></Icon>
        </div>
      {/if}
      {#each step.title.split(' ') as word}
        <span class="step-content">{word}</span>  
      {/each}
    </button>
  {/each}
</ol>

<style>
  .stepper-container {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }

  .step-content {
    display: inline-flex;
    text-align: center;
    display: block;
  }

  .step.completed {
    color: rgb(var(--global-color-primary-500));
  }

  .completed-label-chip {
    border-radius: 9999px;
    background-color: rgb(var(--global-color-primary-500));
    height: 20px;
    width: 20px;
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }

  .link-completed::after {
    border-color: rgb(var(--global-color-primary-500)) !important;
  }

  .linked {
    width: 100%;
  }

  .linked::after {
    content: '';
    display: inline-block;
    height: 0.25rem;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    border-bottom-width: 1px;
    border-color: rgb(var(--global-color-contrast-400), .3);
    width: 100%;
  }
</style>