<script lang="ts">
  export let title: string,
    marginTop: string = "",
    paddingTop: string = ""
</script>

<div
  style:font-weight="600"
  style:font-size="22pt"
  style:margin-top={marginTop}
  style:padding-top={paddingTop}
>
  {title}
</div>