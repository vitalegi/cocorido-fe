<template>
  <div>
    <div class="md-layout md-alignment-top-right">
      <div v-if="isBlackPlayer">
        <md-button @click="forceNextStep()">Termina turno</md-button>
      </div>
    </div>
    <!-- black card -->
    <div class="md-layout md-alignment-top-center">
      <black-card :id="blackCard.id" />
    </div>
    <!-- select winning white cards -->
    <div v-if="isBlackPlayerVoting">
      <div v-for="p in selectedWhiteCards" :key="p.player.playerId">
        <div class="md-layout md-alignment-top-center">
          <white-card
            v-for="(item, id) in p.whitecards"
            :key="id"
            :id="item"
            cardClass="md-layout-item md-size-100 md-xsmall-size-100 md-small-size-45 md-medium-size-30 md-large-size-30"
          />
          <md-button
            v-if="isBlackPlayer"
            class="md-layout-item md-size-20"
            @click="selectWinner(p.player.playerId)"
            >Vincitore</md-button
          >
        </div>
        <md-divider></md-divider>
      </div>
    </div>

    <!-- select white cards -->
    <div
      class="md-layout md-alignment-top-center"
      v-if="isWhitePlayer && isWhitePlayerPlaying"
    >
      <white-card
        :id="item"
        @select="pickWhiteCard"
        :showButton="shouldPlayMoreWhiteCards"
        v-for="(item, id) in whiteCards"
        :key="id"
      />
    </div>
    <game-status :tableId="tableId" />
  </div>
</template>

<script>
import Vue from "vue";
import WhiteCard from "./WhiteCard.vue";
import BlackCard from "./BlackCard.vue";
import GameStatus from "./GameStatus.vue";
import { gameService } from "@/services/GameService";
import {
  MdField,
  MdInput,
  MdButton,
  MdDivider
} from "vue-material/dist/components";

import { eventBus } from "@/utils/EventBus";
import { factory } from "@/services/ConfigLog4j";
import { boardShortPolling } from "@/utils/BoardShortPolling";
const logger = factory.getLogger("Components.Game");

Vue.use(MdDivider);
Vue.use(MdButton);

export default Vue.extend({
  name: "Game",
  components: {
    WhiteCard,
    BlackCard,
    GameStatus
  },
  props: {
    tableId: Number,
    playerId: Number
  },
  data: function() {
    return {
      whiteCards: [],
      gamePhase: "",
      round: {},
      blackCard: {},
      roundId: 0,
      status: "",
      players: []
    };
  },
  computed: {
    isBlackPlayer: function() {
      return this.round.blackPlayerId == this.playerId;
    },
    isWhitePlayer: function() {
      return this.round.blackPlayerId != this.playerId;
    },
    isBlackPlayerVoting: function() {
      return this.status == "BLACK_PLAYER_VOTING";
    },
    isWhitePlayerPlaying: function() {
      return this.status == "WHITE_PLAYERS_CHOOSING_CARD";
    },
    shouldPlayMoreWhiteCards: function() {
      try {
        const playedWhitecards = this.players.filter(
          p => p.player.playerId == this.playerId
        )[0].whitecards.length;

        return playedWhitecards < this.blackCard.whitecards;
      } catch (e) {
        logger.error(`Error while retrieving player: ${e}`);
      }
      return true;
    },
    selectedWhiteCards: function() {
      const cards = [];
      this.players
        .filter(p => p.player.playerId != this.round.blackPlayerId)
        .filter(p => p.whitecards.length > 0)
        .forEach(p => cards.push(p));
      return cards;
    }
  },
  methods: {
    selectWinner: function(playerId) {
      logger.info(() => `Winner of the round is ${playerId}`);
      gameService.selectWinner(this.tableId, playerId);
    },
    pickWhiteCard: async function(id) {
      logger.info(() => `Pick ${id} whitecard`);
      const out = await gameService.pickWhiteCard(
        this.tableId,
        this.playerId,
        id
      );
      logger.info(() => `pick done, ${out}`);
    },
    syncWhiteCards(whiteCards) {
      this.whiteCards.splice(0);
      whiteCards.forEach(whiteCardId => {
        this.whiteCards.push(whiteCardId);
      });
      logger.debug(() => `syncWhiteCards done: ${this.whiteCards}`);
    },
    syncLastRound(round) {
      Vue.set(this, "round", round);
      logger.debug(() => `syncLastRound done: ${this.round.roundId}`);
    },
    syncBlackCard(blackCard) {
      Vue.set(this, "blackCard", blackCard);
      logger.debug(`syncBlackCard done: ${this.blackCard.id}`);
    },
    syncGameStatus(gameStatus) {
      Vue.set(this, "status", gameStatus);
      logger.debug(`syncGameStatus done: ${this.status}`);
    },
    syncPlayers(players) {
      this.players.splice(0);
      players.forEach(player => {
        this.players.push(player);
      });
      logger.debug(`syncPlayers done: ${this.players.length}`);
    },
    forceNextStep() {
      logger.info(() => `Force next step`);
      gameService.updateStatus(this.tableId, true);
    },
    cleanupEvents() {
      logger.info("cleanup Events");
      boardShortPolling.stopPolling();
      eventBus.$off("GAME_ROUTE_LEAVE", boardShortPolling.stopPolling);
      eventBus.$off("PLAYER_WHITECARDS", this.syncWhiteCards);
      eventBus.$off("GAME_LAST_ROUND", this.syncLastRound);
      eventBus.$off("GAME_BLACKCARD", this.syncBlackCard);
      eventBus.$off("GAME_PLAYERS_STATUS", this.syncPlayers);
      eventBus.$off("GAME_STATUS", this.syncGameStatus);
    }
  },
  mounted() {
    logger.info(() => `Mounted, ${this.tableId} ${this.playerId}`);
    boardShortPolling.startPolling(this.tableId, this.playerId);
    eventBus.$on("GAME_ROUTE_LEAVE", boardShortPolling.stopPolling);
    eventBus.$on("PLAYER_WHITECARDS", this.syncWhiteCards);
    eventBus.$on("GAME_LAST_ROUND", this.syncLastRound);
    eventBus.$on("GAME_BLACKCARD", this.syncBlackCard);
    eventBus.$on("GAME_PLAYERS_STATUS", this.syncPlayers);
    eventBus.$on("GAME_STATUS", this.syncGameStatus);
  },
  unmounted() {
    logger.info("Unmounted");
    this.cleanupEvents();
  }
});
</script>

<style scoped lang="scss"></style>