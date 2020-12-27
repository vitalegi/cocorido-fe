import { factory } from "@/services/ConfigLog4j";
import SockJS from "sockjs-client";
import WebSocket from "sockjs-client";
import Stomp, { Client, Message } from "webstomp-client";

const logger = factory.getLogger("Utils.WebSocket");

export class WebSocketConnector {
  private socket: WebSocket | null = null;
  private stompClient: Client | null = null;
  private connected = false;

  public connect(url = "http://localhost:8080/chat") {
    this.socket = new SockJS(url);
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect(
      {},
      frame => {
        this.connected = true;
        this.stompClient?.subscribe("/topic/messages", (msg: Message) => {
          logger.info(`Received msg on topic ${msg.headers} - ${msg.body}`);
        });
      },
      error => {
        logger.error(error.toString());
        this.connected = false;
      }
    );
  }
  public sendJson(msg: any) {
    if (this.isConnected()) {
      logger.info(JSON.stringify(msg));
      this.stompClient?.send("/app/chat", JSON.stringify(msg), {});
    }
  }
  public isConnected(): boolean {
    if (this.connected && this.stompClient?.connected) {
      return true;
    }
    return false;
  }
  public disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    this.connected = false;
  }
}
