<template>
  <div class="hello">
    <ul>
      <li>
        <WhiteCard id="1" msg="Loren ipsum Loren ipsum Loren ipsum" />
        <WhiteCard
          id="2"
          msg="Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum"
        />
        <WhiteCard
          id="3"
          msg="Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum "
        />
        <black-card id="5" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import WhiteCard from "./WhiteCard.vue";
import BlackCard from "./BlackCard.vue";

export default Vue.extend({
  name: "HelloWorld",
  components: {
    WhiteCard,
    BlackCard
  },
  props: {
    msg: String
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
