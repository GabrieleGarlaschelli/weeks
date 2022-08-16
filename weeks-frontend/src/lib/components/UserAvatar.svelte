<script lang="ts">
  export let username: string,
    src: string
    
  import DescriptiveAvatar from '@likable-hair/svelte/media/DescriptiveAvatar.svelte'
  import MediaQuery from '@likable-hair/svelte/common/MediaQuery.svelte'
</script>

<MediaQuery
  let:mAndUp
>
  <DescriptiveAvatar
    direction="row"
    title={username}
    src={src}
    width={mAndUp ? undefined : "30px"}
    height={mAndUp ? undefined : "30px"}
  ></DescriptiveAvatar>
</MediaQuery>

