<template>
  <div class="home">
    <login @joinTable="joinTable" />
    <available-tables @joinTable="joinTable" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Login from "@/components/Login.vue";
import AvailableTables from "@/components/AvailableTables.vue";
import { gameService } from "@/services/GameService";
import { localStorage } from "@/utils/LocalStorage";
import { factory } from "@/services/ConfigLog4j";
import router from "@/router";
const logger = factory.getLogger("Views.Home");

export default Vue.extend({
  name: "Home",
  components: {
    Login,
    AvailableTables
  },
  methods: {
    joinTable: async function(tableId: number) {
      logger.info(() => `Joining: ${tableId}`);
      const playerId = localStorage.getPlayerId();
      const tablePlayer = await gameService.joinTable(tableId, playerId);
      logger.info(
        () => `Joined: ${tablePlayer.tableId} - ${tablePlayer.playerId}`
      );

      router.push({
        name: "PlayGame",
        params: { tableId: "" + tableId, playerId: "" + playerId }
      });
    }
  }
});
</script>
