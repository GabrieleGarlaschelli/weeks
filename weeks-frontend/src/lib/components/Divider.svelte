<script lang="ts">
  import colors from "$lib/stores/colors";
  export let color: string | undefined = undefined,
    weight = "1px",
    radius = "0.5px",
    marginTop: string | undefined = "10px",
    marginBottom: string | undefined = "10px",
    marginLeft: string  | undefined = "5px",
    marginRight: string | undefined = "5px"
</script>

<div
  style:background-color={color || $colors.thinContrast}
  style:border-radius={radius}
  style:height={weight}
  style:margin-top={marginTop}
  style:margin-bottom={marginBottom}
  style:margin-right={marginRight}
  style:margin-left={marginLeft}
/>