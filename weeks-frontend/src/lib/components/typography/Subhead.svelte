<script lang="ts">
  export let text: string = "",
    marginTop: string = "",
    paddingTop: string = ""
</script>

<div
  style:font-weight="700"
  style:font-size="12pt"
  style:margin-top={marginTop}
  style:padding-top={paddingTop}
>
  <slot>
    {text}
  </slot>
</div>