<script lang="ts">
  export let username: string,
    src: string
    
  import DescriptiveAvatar from '@likable-hair/svelte/media/DescriptiveAvatar.svelte'
</script>

<DescriptiveAvatar
  direction="row"
  title={username}
  src={src}
></DescriptiveAvatar>

