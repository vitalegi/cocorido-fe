<template>
  <md-card
    class="md-accent md-layout-item md-size-100 md-xsmall-size-100 md-small-size-45 md-medium-size-30 md-large-size-30"
  >
    <md-card-header>
      <div class="md-title">{{ text }}</div>
    </md-card-header>
  </md-card>
</template>

<script>
import Vue from "vue";
import { MdCard } from "vue-material/dist/components";
import { gameService } from "@/services/GameService";

import { factory } from "@/services/ConfigLog4j";
const logger = factory.getLogger("Components.BlackCard");

Vue.use(MdCard);

export default {
  name: "BlackCard",
  props: ["id"],
  data: () => ({ text: "" }),
  watch: {
    id: function(newId, oldId) {
      logger.info(`newId ${newId} oldId ${oldId}`);
      this.updateText();
    }
  },
  methods: {
    updateText: async function() {
      logger.info(() => `update text`);
      const card = await gameService.getBlackCard(this.id);
      logger.info(() => `text ${this.id} = ${card.text}`);
      this.text = card.text;
    }
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
