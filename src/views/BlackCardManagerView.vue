<template>
  <div class="black-card-manager">
    <black-card-manager />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BlackCardManager from "@/components/BlackCardManager.vue";

export default Vue.extend({
  name: "BlackCardManagerView",
  components: {
    BlackCardManager
  }
});
</script>
