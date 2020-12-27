import { factory } from "@/services/ConfigLog4j";

export const PLAYER_ID = "playerId";

const logger = factory.getLogger("Utils.LocalStorage");

class LocalStorage {
  public setValue(key: string, value: string) {
    logger.debug(() => `set ${key} = ${value}`);
    window.localStorage.setItem(key, value);
  }
  public getValue(key: string, defaultValue: string): string {
    logger.debug(() => `get ${key}`);
    const value = window.localStorage.getItem(key);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
  public getValueNumber(key: string, defaultValue: number): number {
    const value = this.getValue(key, "" + defaultValue);
    return parseInt(value);
  }
  public getPlayerId(): number {
    return this.getValueNumber(PLAYER_ID, -1);
  }
  public setPlayerId(id: number) {
    this.setValue(PLAYER_ID, "" + id);
  }
}

export const localStorage = new LocalStorage();
