<script lang="ts">
  export let subtitle: string = "",
    marginTop: string = "",
    paddingTop: string = ""
</script>

<div
  style:font-weight="400"
  style:font-size="16pt"
  style:margin-top={marginTop}
  style:padding-top={paddingTop}
>
  <slot>
    {subtitle}
  </slot>
</div>