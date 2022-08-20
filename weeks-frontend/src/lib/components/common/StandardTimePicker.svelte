<script lang="ts">
  export let value: string = '',
    placeholder: string = "Ora",
    label: string = "Ora",
    name: string

  import colors from "$lib/stores/colors";
</script>


<!-- <TimePickerTextField
  placeholder={placeholder}
  text={value}
></TimePickerTextField> -->

<label
  style:font-weight="500"
  style:margin-left="3px"
  for={name}
>{label}</label>
<div>
  <input 
    bind:value={value}
    style:border-color={$colors.thinContrast}
    style:color={$colors.contrast}
    type="time" 
    class="time-picker" 
  />
</div>

<style>
  .time-picker {
    background-color: transparent;
    border: 1px solid;
    border-radius: 5px;
    height: 35px;
    margin-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }

  .time-picker:focus {
    outline: none;
  }
</style>