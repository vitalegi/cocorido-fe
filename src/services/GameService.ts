import { BackendWebService } from "@/services/WebService";
import {
  Table,
  TablePlayer,
  Player,
  PlayerStatus,
  Round,
  BlackCardObj,
  WhiteCardObj
} from "@/model/Model";
import { localStorage } from "@/utils/LocalStorage";

export class GameService {
  public async pickWhiteCard(
    tableId: number,
    playerId: number,
    whiteCardId: number
  ) {
    return new BackendWebService()
      .url(`/rest/round/${tableId}/${playerId}/play/${whiteCardId}`)
      .responseType("json")
      .post()
      .headerJson()
      .call();
  }
  public async getWhiteCards(tableId: number, playerId: number) {
    return new BackendWebService()
      .url(`/rest/tablePlayerWhiteCard/${tableId}/${playerId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getWhiteCard(whiteCardId: number) {
    return new BackendWebService()
      .url(`/rest/whiteCard/${whiteCardId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getBlackCard(blackCardId: number) {
    return new BackendWebService()
      .url(`/rest/blackCard/${blackCardId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getAllBlackCards(): Promise<Array<BlackCardObj>> {
    return new BackendWebService()
      .url(`/rest/blackCards`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async exportBlackCards(): Promise<string> {
    return new BackendWebService()
      .url(`/rest/blackCards/txt`)
      .responseType("text")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async deleteBlackCards(): Promise<string> {
    return new BackendWebService()
      .url(`/rest/blackCards`)
      .responseType("json")
      .delete()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async createBlackCard(text: string) {
    return new BackendWebService()
      .url(`/rest/blackCard/`)
      .responseType("json")
      .put()
      .headerJson()
      .call({ text: text })
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async createWhiteCard(text: string) {
    return new BackendWebService()
      .url(`/rest/whiteCard/`)
      .responseType("json")
      .put()
      .headerJson()
      .call({ text: text })
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getAllWhiteCards(): Promise<Array<WhiteCardObj>> {
    return new BackendWebService()
      .url(`/rest/whiteCards`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async exportWhiteCards(): Promise<string> {
    return new BackendWebService()
      .url(`/rest/whiteCards/txt`)
      .responseType("text")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async deleteWhiteCards(): Promise<string> {
    return new BackendWebService()
      .url(`/rest/whiteCards`)
      .responseType("json")
      .delete()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async login(name: string): Promise<number> {
    return new BackendWebService()
      .url(`/rest/player`)
      .responseType("json")
      .put()
      .headerJson()
      .call({ name: name })
      .then(response => {
        return Promise.resolve(response.data.playerId);
      });
  }
  public async getTables(): Promise<Array<Table>> {
    return new BackendWebService()
      .url(`/rest/tables`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getTable(name: string): Promise<Table> {
    const tables = await this.getTables();
    const filtered = tables.filter(table => table.name == name);
    if (filtered.length == 0) {
      return Promise.reject(`Table ${name} does not exist`);
    }
    return Promise.resolve(filtered[0]);
  }
  public async getTableById(tableId: number): Promise<Table> {
    return new BackendWebService()
      .url(`/rest/table/${tableId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async createTable(name: string, playerId: number): Promise<Table> {
    return new BackendWebService()
      .url(`/rest/round/${playerId}`)
      .responseType("json")
      .post()
      .headerJson()
      .call({ name: name })
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async joinTable(
    tableId: number,
    playerId: number
  ): Promise<TablePlayer> {
    return new BackendWebService()
      .url(`/rest/tablePlayer/${tableId}/${playerId}`)
      .responseType("json")
      .put()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async deleteTable(tableId: number): Promise<TablePlayer> {
    return new BackendWebService()
      .url(`/rest/table/${tableId}`)
      .responseType("json")
      .delete()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async leaveTable(tableId: number, playerId: number): Promise<void> {
    return new BackendWebService()
      .url(`/rest/tablePlayer/${tableId}/${playerId}`)
      .delete()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve();
      });
  }
  public async getRoundStatus(tableId: number): Promise<Array<PlayerStatus>> {
    return new BackendWebService()
      .url(`/rest/roundStatus/${tableId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getPlayedWhiteCards(
    tableId: number
  ): Promise<Map<number, Array<number>>> {
    return new BackendWebService()
      .url(`/rest/roundStatus/${tableId}/whiteCards`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getGameStatus(tableId: number): Promise<string> {
    return new BackendWebService()
      .url(`/rest/round/${tableId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getLastRound(tableId: number): Promise<Round> {
    return new BackendWebService()
      .url(`/rest/round/${tableId}/latest`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }

  public async getTablePlayers(tableId: number): Promise<Array<TablePlayer>> {
    return new BackendWebService()
      .url(`/rest/tablePlayers/${tableId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async getPlayers(tableId: number): Promise<Array<TablePlayer>> {
    return new BackendWebService()
      .url(`/rest/players/${tableId}`)
      .responseType("json")
      .get()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public async updateStatus(tableId: number, force: boolean): Promise<string> {
    return new BackendWebService()
      .url(`/rest/round/${tableId}/${force}`)
      .responseType("json")
      .post()
      .headerJson()
      .call()
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
  public selectWinner(tableId: number, winnerPlayerId: number) {
    return new BackendWebService()
      .url(`/rest/round/${tableId}/winner/${winnerPlayerId}`)
      .responseType("json")
      .post()
      .headerJson()
      .call();
  }
  public changeBlackCard(tableId: number) {
    return new BackendWebService()
      .url(`/rest/round/${tableId}/blackCard/change`)
      .responseType("json")
      .patch()
      .headerJson()
      .call();
  }
}

export const gameService = new GameService();
