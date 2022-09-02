<script lang="ts" context="module">
  import type { Event } from "$lib/services/events/events.service"
</script>

<script lang="ts">
  export let event: Event
  
  import DateTimeFormattor from "$lib/components/common/DateTimeFormattor.svelte";
</script>

    
<table>
  <tr class="field-row">
    <td class="field-name">Descrizione</td>
    <td>
      <div
        style:white-space="pre-wrap"
      >{event.description}</div>
    </td>
  </tr>
  <tr class="field-row">
    <td class="field-name">Inizio</td>
    <td>
      <DateTimeFormattor
        datetime={new Date(event.start)}
      ></DateTimeFormattor>
    </td>
  </tr>
  <tr class="field-row">
    <td class="field-name">Fine</td>
    <td>
      <DateTimeFormattor
        datetime={new Date(event.end)}
      ></DateTimeFormattor>
    </td>
  </tr>
  <tr class="field-row">
    <td class="field-name">Creato da</td>
    <td>
      {event.createdBy.name}
    </td>
  </tr>
  <tr class="field-row">
    <td class="field-name">Creato il</td>
    <td>
      <DateTimeFormattor
        datetime={new Date(event.createdAt)}
      ></DateTimeFormattor>
    </td>
  </tr>
</table>



<style>
  table {
    border-collapse:separate; 
    border-spacing: 0 1em;
  }

  .field-name {
    font-weight: 900;
    padding-right: 15px;
    vertical-align: top;
    white-space: nowrap;
  }
</style>