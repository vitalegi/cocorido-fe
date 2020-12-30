import { gameService } from "@/services/GameService";
import { eventBus } from "@/utils/EventBus";
import { factory } from "@/services/ConfigLog4j";
const logger = factory.getLogger("Utils.BoardShortPolling");

const POLLING_INTERVAL = 1000;

class BoardShortPolling {
  public timerInterval: number | null = null;

  public startPolling = (boardId: number, playerId: number) => {
    logger.info(`Start polling for ${boardId} ${playerId}`);
    this.releaseResources();
    this.timerInterval = setInterval(() => {
      this.sync(boardId, playerId);
    }, POLLING_INTERVAL);
    this.sync(boardId, playerId);
  };

  public stopPolling = () => {
    logger.info(`Stop polling`);
    this.releaseResources();
  };

  protected releaseResources = () => {
    if (this.timerInterval != null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      logger.info(`Timer is released`);
    }
  };

  public async sync(boardId: number, playerId: number) {
    logger.info(`Sync for ${boardId} ${playerId}`);

    const whiteCards = await gameService.getWhiteCards(boardId, playerId);
    logger.debug(() => `getWhiteCards done ${whiteCards}`);
    eventBus.$emit("PLAYER_WHITECARDS", whiteCards);

    const newStatus = await gameService.updateStatus(boardId, false);
    logger.debug(() => `updateStatus done, ${newStatus}`);
    eventBus.$emit("GAME_NEW_STATUS", newStatus);

    const round = await gameService.getLastRound(boardId);
    logger.debug(`getLastRound done ${round.roundId}`);
    eventBus.$emit("GAME_LAST_ROUND", round);

    const tablePlayers = await gameService.getTablePlayers(boardId);
    logger.debug(`getTablePlayers done ${tablePlayers.length}`);
    eventBus.$emit("GAME_TABLE_PLAYERS", tablePlayers);

    const players = await gameService.getPlayers(boardId);
    logger.debug(`getPlayers done ${players.length}`);
    eventBus.$emit("GAME_PLAYERS", players);

    const playedWhiteCards = await gameService.getPlayedWhiteCards(boardId);
    logger.debug(`getPlayedWhiteCards done ${playedWhiteCards}`);
    eventBus.$emit("GAME_ROUND_PLAYED_WHITECARDS", playedWhiteCards);

    const blackCard = await gameService.getBlackCard(round.blackCardId);
    logger.debug(`getBlackCard done ${blackCard.id}`);
    eventBus.$emit("GAME_BLACKCARD", blackCard);

    const status = await gameService.getGameStatus(boardId);
    logger.debug(`getGameStatus done: ${status}`);
    eventBus.$emit("GAME_STATUS", status);

    const board = await gameService.getTableById(boardId);
    logger.debug(`getTableById done ${board.id}`);
    eventBus.$emit("GAME_BOARD", board);
  }
}

export const boardShortPolling = new BoardShortPolling();
