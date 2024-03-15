<script lang="ts">
	import Stepper from "../common/Stepper.svelte"

</script>

<Stepper
  steps={[
    { name: 'step1', title: 'Step 1', completed: true },
    { name: 'step2', title: 'Step 2', completed: true  },
    { name: 'step3', title: 'Step con titolo più lungo' },
  ]}
></Stepper>