<script lang="ts">
	import { Switch } from '@likable-hair/svelte'
	export let value: boolean
</script>

<Switch bind:value on:change />
