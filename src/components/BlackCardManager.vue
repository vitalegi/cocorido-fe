<template>
  <div>
    <div class="md-layout md-alignment-top-right md-gutter">
      <div>
        <md-button @click="createCards()" class="md-primary md-raised"
          >Inserisci</md-button
        >
      </div>
      <div>
        <md-button @click="exportCards()" class="md-layout-item md-raised"
          >Export</md-button
        >
      </div>
      <div>
        <md-button
          @click="showConfirmationDialog = true"
          class="md-accent md-raised"
          >Cancella tutto</md-button
        >
        <md-dialog-confirm
          :md-active.sync="showConfirmationDialog"
          md-title="Conferma operazione"
          md-content="Azione non revertibile. Confermi di voler eliminare tutte le carte?"
          md-confirm-text="Confermo"
          md-cancel-text="Annulla"
          @md-confirm="deleteCards()"
        />
      </div>
    </div>
    <div class="md-layout md-alignment-top-center">
      <md-field>
        <label>Nuove card</label>
        <md-textarea v-model="newCard"></md-textarea>
      </md-field>
    </div>
    <div class="md-layout md-alignment-top-center">
      <md-table class="md-layout-item">
        <md-table-row>
          <md-table-head md-numeric>ID</md-table-head>
          <md-table-head>Text</md-table-head>
        </md-table-row>

        <md-table-row v-for="card in cards" :key="card.id">
          <md-table-cell md-numeric>{{ card.id }}</md-table-cell>
          <md-table-cell class="md-alignment-top-left">{{
            card.text
          }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { gameService } from "@/services/GameService";
import {
  MdTable,
  MdContent,
  MdButton,
  MdDialogConfirm,
  MdDialog
} from "vue-material/dist/components";
import { saveAs } from "file-saver";
import { factory } from "@/services/ConfigLog4j";
const logger = factory.getLogger("Components.BlackCardManager");

Vue.use(MdTable);
Vue.use(MdContent);
Vue.use(MdButton);
Vue.use(MdDialogConfirm);
Vue.use(MdDialog);

export default {
  name: "BlackCardManager",
  props: [],
  data: () => ({
    cards: [],
    newCard: "",
    showConfirmationDialog: false
  }),
  methods: {
    updateCards: async function() {
      let cards = await gameService.getAllBlackCards();
      cards = cards.sort((a, b) => b.id - a.id);
      this.cards.splice(0);
      cards.forEach(card => {
        this.cards.push(card);
      });
    },
    createCards: async function() {
      const cards = this.newCard.split("\n");
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        try {
          await gameService.createBlackCard(card);
          logger.info(`Inserted new black card: ${card}`);
        } catch (e) {
          logger.error(`Failed to insert ${card}, ${e}`);
        }
      }
      this.newCard = "";
      this.updateCards();
    },
    exportCards: async function() {
      logger.info(() => `Export`);
      const content = await gameService.exportBlackCards();
      const blob = new Blob([content]);
      saveAs(blob, "blackcards.txt");
    },
    deleteCards: async function() {
      logger.info(() => `Delete cards`);
      await gameService.deleteBlackCards();
      this.updateCards();
    }
  },
  mounted() {
    this.updateCards();
  }
};
</script>

<style lang="scss" scoped></style>
