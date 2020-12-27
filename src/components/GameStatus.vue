<template>
  <div class="md-layout md-alignment-top-center">
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <md-table class="md-layout-item">
      <md-table-row>
        <md-table-head>Nickname</md-table-head>
        <md-table-head>Punti</md-table-head>
        <md-table-head md-numeric>Carte</md-table-head>
        <md-table-head>Online</md-table-head>
        <md-table-head>Azioni</md-table-head>
      </md-table-row>

      <md-table-row v-for="player in players" :key="player.player.playerId">
        <md-table-cell>{{ playerName(player) }}</md-table-cell>
        <md-table-cell>{{ player.tablePlayer.score }}</md-table-cell>
        <md-table-cell md-numeric>{{ cardsStatus(player) }} </md-table-cell>
        <md-table-cell>{{
          lastTimeOnline(player.tablePlayer.lastUpdate)
        }}</md-table-cell>
        <md-table-cell>
          <md-button
            class="md-icon-button"
            v-if="
              isBoardOwner(playerId) && !isBoardOwner(player.player.playerId)
            "
            @click="leaveTable(player.player.playerId)"
            ><md-icon>delete</md-icon></md-button
          >
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Vue from "vue";
import { gameService } from "@/services/GameService";
import {
  MdTable,
  MdContent,
  MdButton,
  MdIcon
} from "vue-material/dist/components";
import { eventBus } from "@/utils/EventBus";
import { boardShortPolling } from "@/utils/BoardShortPolling";
import { localStorage } from "@/utils/LocalStorage";
import { TimeUtil } from "@/utils/TimeUtil";
import { factory } from "@/services/ConfigLog4j";
const logger = factory.getLogger("Components.GameStatus");

Vue.use(MdTable);
Vue.use(MdContent);
Vue.use(MdButton);
Vue.use(MdIcon);

export default Vue.extend({
  name: "GameStatus",
  props: {
    tableId: Number
  },
  data: function() {
    return {
      players: [],
      round: {},
      board: {},
      blackCard: {}
    };
  },
  computed: {
    expectedWhiteCards: function() {
      return this.blackCard.whitecards;
    },
    playerId: function() {
      return localStorage.getPlayerId();
    }
  },
  methods: {
    cardsStatus: function(player) {
      if (this.isBoardMaster(player.player.playerId)) {
        return "-";
      }
      return `${player.whitecards.length} /
          ${this.expectedWhiteCards}`;
    },
    playerName: function(player) {
      if (this.userTypes(player.player.playerId) != "") {
        return `${player.player.name} (${this.userTypes(
          player.player.playerId
        )})`;
      }
      return player.player.name;
    },
    lastTimeOnline: function(date) {
      const now = TimeUtil.now();
      const time1 = TimeUtil.parse(date);
      return TimeUtil.formattedOnlineTime(now, time1);
    },
    userTypes: function(playerId) {
      const types = [];
      if (this.isBoardMaster(playerId)) {
        types.push("Master");
      }
      if (this.isBoardOwner(playerId)) {
        types.push("Owner");
      }
      return types.join(", ");
    },
    syncPlayers: function(players) {
      players = players.sort(
        (a, b) => b.tablePlayer.score - a.tablePlayer.score
      );
      this.players.splice(0);
      players.forEach(player => {
        this.players.push(player);
      });
      logger.debug(`syncPlayers, done, ${this.players.length}`);
    },
    syncLastRound(round) {
      Vue.set(this, "round", round);
      logger.debug(() => `syncLastRound done: ${this.round.roundId}`);
    },
    syncBoard: async function(board) {
      this.board = board;
      logger.debug(`syncBoard done: ${this.board.id}`);
    },
    syncBlackCard(blackCard) {
      Vue.set(this, "blackCard", blackCard);
      logger.debug(`syncBlackCard done: ${this.blackCard.id}`);
    },
    leaveTable(playerId) {
      logger.info(`Delete Player ${playerId}`);
      gameService.leaveTable(this.tableId, playerId);
    },
    isBoardOwner(playerId) {
      return this.board.boardOwnerId == playerId;
    },
    isBoardMaster(playerId) {
      return this.round.blackPlayerId == playerId;
    },
    cleanupEvents() {
      logger.info("cleanup Events");
      boardShortPolling.stopPolling();
      eventBus.$off("GAME_ROUTE_LEAVE", boardShortPolling.stopPolling);
      eventBus.$off("GAME_PLAYERS_STATUS", this.syncPlayers);
      eventBus.$off("GAME_LAST_ROUND", this.syncLastRound);
      eventBus.$off("GAME_BOARD", this.syncBoard);
      eventBus.$off("GAME_BLACKCARD", this.syncBlackCard);
    }
  },
  mounted() {
    logger.info(() => `Mounted, ${this.tableId} ${this.playerId}`);
    boardShortPolling.startPolling(this.tableId, this.playerId);
    eventBus.$on("GAME_ROUTE_LEAVE", this.cleanupEvents);
    eventBus.$on("GAME_PLAYERS_STATUS", this.syncPlayers);
    eventBus.$on("GAME_LAST_ROUND", this.syncLastRound);
    eventBus.$on("GAME_BOARD", this.syncBoard);
    eventBus.$on("GAME_BLACKCARD", this.syncBlackCard);
  },
  unmounted() {
    logger.info("Unmounted");
    boardShortPolling.stopPolling();
    eventBus.$off("GAME_ROUTE_LEAVE", this.cleanupEvents);
    this.cleanupEvents();
  }
});
</script>

<style scoped lang="scss"></style>
