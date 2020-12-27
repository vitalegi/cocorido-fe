<template>
  <div class="white-card-manager">
    <white-card-manager />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import WhiteCardManager from "@/components/WhiteCardManager.vue";

export default Vue.extend({
  name: "WhiteCardManagerView",
  components: {
    WhiteCardManager
  }
});
</script>
