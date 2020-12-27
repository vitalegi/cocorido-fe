<template>
  <div class="md-layout md-alignment-top-center">
    <md-table>
      <md-table-row>
        <md-table-head>Nome Partita</md-table-head>
        <md-table-head>Online</md-table-head>
        <md-table-head>Azioni</md-table-head>
      </md-table-row>

      <md-table-row v-for="table in tables" :key="table.id">
        <md-table-cell>{{ table.name }}</md-table-cell>
        <md-table-cell>{{ lastTimeOnline(table.lastUpdate) }}</md-table-cell>
        <md-table-cell>
          <md-button class="md-primary md-raised" @click="joinTable(table.id)"
            >Unisciti</md-button
          >

          <md-button
            v-if="canDeleteTable(table.id)"
            class="md-accent md-raised"
            @click="
              selectedBoard = table.id;
              showConfirmationDialog = true;
            "
            >Elimina</md-button
          >
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog-confirm
      :md-active.sync="showConfirmationDialog"
      md-title="Conferma operazione"
      md-content="Azione non revertibile. Confermi di voler eliminare la partita?"
      md-confirm-text="Confermo"
      md-cancel-text="Annulla"
      @md-confirm="deleteTable(selectedBoard)"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { gameService } from "@/services/GameService";
import {
  MdTable,
  MdContent,
  MdDialogConfirm,
  MdDialog
} from "vue-material/dist/components";
import { localStorage } from "@/utils/LocalStorage";
import { TimeUtil } from "@/utils/TimeUtil";

import { factory } from "@/services/ConfigLog4j";
const logger = factory.getLogger("Components.AvailableTables");

Vue.use(MdTable);
Vue.use(MdContent);
Vue.use(MdDialogConfirm);
Vue.use(MdDialog);

export default Vue.extend({
  name: "AvailableTables",
  props: {},
  data: function() {
    return {
      tables: [],
      showConfirmationDialog: false,
      selectedBoard: -1
    };
  },
  computed: {},
  methods: {
    joinTable: function(tableId) {
      this.$emit("joinTable", tableId);
    },
    canDeleteTable: function(tableId) {
      const table = this.tables.filter(t => t.id == tableId)[0];
      return (
        table.boardOwnerId == null ||
        table.boardOwnerId == localStorage.getPlayerId()
      );
    },
    deleteTable: async function(tableId) {
      logger.info(`deleteTable ${tableId}`);
      await gameService.deleteTable(tableId);
      this.updateTables();
    },
    updateTables: async function() {
      logger.debug("getTables");
      let tables = await gameService.getTables();
      tables = tables
        .sort((a, b) => {
          const v1 = a.lastUpdate == null ? "" : a.lastUpdate;
          const v2 = b.lastUpdate == null ? "" : b.lastUpdate;
          return v1 - v2;
        })
        .reverse();
      this.tables.splice(0);
      tables.forEach(table => {
        this.tables.push(table);
      });
    },
    lastTimeOnline: function(date) {
      const now = TimeUtil.now();
      const time1 = TimeUtil.parse(date);
      return TimeUtil.formattedOnlineTime(now, time1);
    }
  },
  mounted() {
    logger.info("Mounted");
    this.updateTables();
  }
});
</script>

<style scoped lang="scss"></style>
