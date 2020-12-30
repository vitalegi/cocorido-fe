<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <div class="md-layout-item md-size-10">
        <md-button class="md-raised md-primary" @click="disconnect()"
          >Disconnect</md-button
        >
      </div>
    </div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <div class="md-layout-item md-size-40">
        <md-field>
          <label>Destination</label>
          <md-input v-model="destination"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-size-40">
        <md-field>
          <label>Text</label>
          <md-input v-model="text"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-size-10">
        <md-button class="md-raised md-primary" @click="send()">Invia</md-button
        ><md-button class="md-raised md-primary" @click="subscribe()"
          >Iscriviti</md-button
        >
      </div>
    </div>
    <div class="md-layout md-gutter md-alignment-top-center">
      messages: {{ messages.length }}
      <div
        class="md-layout-item md-size-60"
        v-for="(message, id) in messages"
        :key="id"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { MdField, MdButton } from "vue-material/dist/components";
import { factory } from "@/services/ConfigLog4j";
import SockJS, { Message } from "sockjs-client";
import Stomp from "webstomp-client";
import { websocket, WebSocketConnector } from "@/utils/WebSocket";

Vue.use(MdField);
Vue.use(MdButton);
const logger = factory.getLogger("Components.WebSocketTest");

export default Vue.extend({
  name: "WebSocketTest",
  components: {},
  props: {},
  data: function() {
    return { text: "", messages: [], destination: "/app/chat" };
  },
  computed: {},
  methods: {
    send: function() {
      const msg = { text: this.text, from: "me" };
      logger.info(`Send message ${msg}`);
      websocket.sendJson(this.destination, msg);
      logger.info(`Sent`);
    },
    disconnect: function() {
      websocket.disconnect();
    },
    subscribed: function(tick) {
      logger.info(`tick body ${tick.body}`);
      this.messages.push(JSON.parse(tick.body).text);
    },
    subscribe: function() {
      websocket.subscribe("/topic/messages", msg => {
        logger.info(`Received msg on topic ${msg.headers} - ${msg.body}`);
        this.subscribed(msg);
      });
    }
  }
});
</script>

<style scoped lang="scss"></style>
