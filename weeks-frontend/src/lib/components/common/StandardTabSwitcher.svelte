<script lang="ts" context="module">
  import type { Tab } from "@likable-hair/svelte/navigation/TabSwitcher.svelte"
</script>

<script lang="ts">
  export let tabs: Tab[] = [],
    selected: string,
    marginTop: string | undefined = undefined,
    marginBottom: string | undefined = undefined

  import colors from "$lib/stores/colors"
  import TabSwitcher from "@likable-hair/svelte/navigation/TabSwitcher.svelte"
</script>

<div
  style:margin-top={marginTop}
  style:margin-bottom={marginBottom}
>
  <TabSwitcher
    color={$colors.primary}
    bookmarkColor={$colors.primary}
    horizontalGuideColor={$colors.lightContrast}
    tabs={tabs}
    margin="4px"
    width="100%"
    bind:selected={selected}
    on:tab-click
  ></TabSwitcher>
</div>