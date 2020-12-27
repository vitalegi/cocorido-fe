<template>
  <div>
    <div class="md-layout md-alignment-top-center" v-if="!isLoggedIn">
      <div class="md-layout-item">
        <md-field>
          <label>Nickname</label>
          <md-input v-model="userName"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-button class="md-raised md-primary" @click="login()"
          >Scegli nickname</md-button
        >
      </div>
    </div>
    <div class="md-layout md-gutter md-alignment-top-center" v-if="isLoggedIn">
      <div class="md-layout-item">
        <md-field>
          <label>Nome della Partita</label>
          <md-input v-model="tableName"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-button class="md-raised md-primary" @click="createTable()"
          >Crea Nuova</md-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { gameService } from "@/services/GameService";
import { MdField, MdButton } from "vue-material/dist/components";
import { localStorage } from "@/utils/LocalStorage";
import { factory } from "@/services/ConfigLog4j";
import router from "@/router";

Vue.use(MdField);
Vue.use(MdButton);
const logger = factory.getLogger("Components.Login");

export default Vue.extend({
  name: "Login",
  components: {},
  props: {},
  data: function() {
    return {
      userName: "",
      tables: [],
      tableName: "",
      tableId: Number,
      playerId: -1
    };
  },
  computed: {
    isLoggedIn: function() {
      return this.playerId != -1;
    }
  },
  methods: {
    login: async function() {
      const playerId = await gameService.login(this.userName);
      logger.info(() => `Login done, ${playerId}`);
      this.playerId = playerId;
      localStorage.setPlayerId(playerId);
    },
    getTables: async function() {
      const tables = await gameService.getTables();
      logger.info(() => `Tables available, ${tables}`);
      return tables;
    },
    createTable: async function() {
      const table = await gameService.createTable(
        this.tableName,
        this.playerId
      );
      logger.info(() => `Created table: ${table.id} - ${table.name}`);
      this.$emit("joinTable", table.id);
    }
  },
  mounted() {
    const playerId = localStorage.getPlayerId();
    this.playerId = playerId;
  }
});
</script>

<style scoped lang="scss"></style>
