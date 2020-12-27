<template>
  <div class="game">
    <game v-if="this.tableId >= 0" :tableId="tableId" :playerId="playerId" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Game from "@/components/Game.vue";
import router from "@/router";
import { eventBus } from "@/utils/EventBus";
import { factory } from "@/services/ConfigLog4j";
const logger = factory.getLogger("Views.PlayGame");

export default Vue.extend({
  name: "PlayGame",
  props: {
    tableId: Number,
    playerId: Number
  },
  components: {
    Game
  },
  created: function() {
    if (this.tableId >= 0) {
      return;
    }
    logger.info(`tableId is not yet defined, redirect to homepage`);
    router.push({
      name: "Home"
    });
  },
  beforeRouteLeave(to, from, next) {
    logger.info(`Leaving route`);
    eventBus.$emit("GAME_ROUTE_LEAVE");
    next();
  }
});
</script>
