<template>
  <md-card v-on:click.native="submit()" :class="getCssClasses()">
    <md-card-header>
      <div class="md-title">{{ text }}</div>
    </md-card-header>
  </md-card>
</template>

<script>
import Vue from "vue";
import { MdCard, MdButton } from "vue-material/dist/components";
import { factory } from "@/services/ConfigLog4j";
import { gameService } from "@/services/GameService";

Vue.use(MdCard);
Vue.use(MdButton);

const logger = factory.getLogger("Components.WhiteCard");

export default {
  name: "WhiteCard",
  props: ["id", "showButton", "cardClass"],
  data: function() {
    return {
      text: "",
      showConfirmationDialog: false
    };
  },
  watch: {
    id: function(newId, oldId) {
      logger.info(`newId ${newId} oldId ${oldId}`);
      this.updateText();
    }
  },
  methods: {
    getCssClasses: function() {
      if (this.cardClass != null && this.cardClass != "") {
        return this.cardClass;
      }
      return "md-layout-item md-size-100 md-xsmall-size-100 md-small-size-45 md-medium-size-30 md-large-size-20";
    },
    submit: function() {
      if (!this.showButton) {
        return;
      }
      logger.info(() => `select ${this.id} white card`);
      this.$emit("select", this.id);
    },
    updateText: async function() {
      logger.info(() => `update text`);
      const card = await gameService.getWhiteCard(this.id);
      logger.debug(() => `text ${this.id} = ${card.text}`);
      this.text = card.text;
    }
  },
  mounted: function() {
    logger.info(() => `mounted: ${this.id}`);
    this.updateText();
  }
};
</script>

<style lang="scss" scoped>
$breakpoint-xsmall: 599px;

.md-card {
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

@media (min-width: $breakpoint-xsmall) {
  .md-card {
    min-height: 220px;
  }
}

@media (max-width: $breakpoint-xsmall) {
  .md-card {
    min-height: 80px;
  }
}
</style>
