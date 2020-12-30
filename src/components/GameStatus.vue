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

      <md-table-row
        v-for="tablePlayer in tablePlayers"
        :key="tablePlayer.playerId"
      >
        <md-table-cell>{{ playerName(tablePlayer.playerId) }}</md-table-cell>
        <md-table-cell>{{ playerScore(tablePlayer.playerId) }}</md-table-cell>
        <md-table-cell md-numeric
          >{{ cardsStatus(tablePlayer.playerId) }}
        </md-table-cell>
        <md-table-cell>{{
          lastTimeOnline(tablePlayer.lastUpdate)
        }}</md-table-cell>
        <md-table-cell>
          <md-button
            class="md-icon-button"
            v-if="
              isBoardOwner(currentPlayerId) &&
                !isBoardOwner(tablePlayer.playerId)
            "
            @click="leaveTable(tablePlayer.playerId)"
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
      playedWhiteCards: [],
      players: [],
      tablePlayers: [],
      round: {},
      board: {},
      blackCard: {}
    };
  },
  computed: {
    expectedWhiteCards: function() {
      return this.blackCard.whitecards;
    },
    currentPlayerId: function() {
      return localStorage.getPlayerId();
    }
  },
  methods: {
    cardsStatus: function(playerId) {
      if (this.isBoardMaster(playerId)) {
        return "-";
      }
      const playedWhiteCards = this.playedWhiteCards.find(
        w => w.playerId == playerId
      );
      if (playedWhiteCards == undefined) {
        return "???";
      }
      return `${playedWhiteCards.whiteCards.length} /
          ${this.expectedWhiteCards}`;
    },
    playerName: function(playerId) {
      const userType = this.userTypes(playerId);
      const player = this.players.find(p => p.playerId == playerId);
      let name = "???";
      if (player != undefined) {
        name = player.name;
      }
      if (userType != "") {
        return `${name} (${userType})`;
      }
      return name;
    },
    playerScore: function(playerId) {
      const tablePlayer = this.tablePlayers.find(p => p.playerId == playerId);
      if (tablePlayer == undefined) {
        return "???";
      }
      return tablePlayer.score;
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
      this.players.splice(0);
      players.forEach(player => {
        this.players.push(player);
      });
      logger.debug(`syncPlayers, done, ${this.players.length}`);
    },
    syncTablePlayers: function(tablePlayers) {
      tablePlayers = tablePlayers.sort((a, b) => b.score - a.score);
      this.tablePlayers.splice(0);
      tablePlayers.forEach(tablePlayer => {
        this.tablePlayers.push(tablePlayer);
      });
      logger.debug(`syncTablePlayers, done, ${this.tablePlayers.length}`);
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
    syncPlayedWhiteCards(playedWhiteCards) {
      this.playedWhiteCards.splice(0);
      playedWhiteCards.forEach(entry => this.playedWhiteCards.push(entry));
      logger.debug(
        `syncPlayedWhiteCards done: ${this.playedWhiteCards.length}`
      );
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
      eventBus.$off("GAME_PLAYERS", this.syncPlayers);
      eventBus.$off("GAME_TABLE_PLAYERS", this.syncTablePlayers);
      eventBus.$off("GAME_LAST_ROUND", this.syncLastRound);
      eventBus.$off("GAME_BOARD", this.syncBoard);
      eventBus.$off("GAME_BLACKCARD", this.syncBlackCard);
      eventBus.$off("GAME_ROUND_PLAYED_WHITECARDS", this.syncPlayedWhiteCards);
    }
  },
  mounted() {
    logger.info(() => `Mounted, ${this.tableId} ${this.currentPlayerId}`);
    boardShortPolling.startPolling(this.tableId, this.currentPlayerId);
    eventBus.$on("GAME_ROUTE_LEAVE", this.cleanupEvents);
    eventBus.$on("GAME_PLAYERS", this.syncPlayers);
    eventBus.$on("GAME_TABLE_PLAYERS", this.syncTablePlayers);
    eventBus.$on("GAME_LAST_ROUND", this.syncLastRound);
    eventBus.$on("GAME_BOARD", this.syncBoard);
    eventBus.$on("GAME_BLACKCARD", this.syncBlackCard);
    eventBus.$on("GAME_ROUND_PLAYED_WHITECARDS", this.syncPlayedWhiteCards);
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
