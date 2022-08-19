<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
</script>

<script lang="ts">
  export let team: Team
  
  import DateTimeFormattor from "$lib/components/common/DateTimeFormattor.svelte";
</script>

    
<table>
  <tr class="field-row">
    <td class="field-name">Note</td>
    <td>
      <div
        style:white-space="pre-wrap"
      >{team.notes}</div>
    </td>
  </tr>
  <tr class="field-row">
    <td class="field-name">Creato il</td>
    <td>
      <DateTimeFormattor
        datetime={new Date(team.createdAt)}
      ></DateTimeFormattor>
    </td>
  </tr>
  <tr class="field-row">
    <td class="field-name">Proprietario</td>
    <td>
      {team.owner?.name}
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