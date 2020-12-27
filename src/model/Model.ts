export class Table {
  public id = 0;
  public name = "";
  public lastUpdate = "";
  public boardOwnerId = 0;
}

export class TablePlayer {
  public playerId = 0;
  public tableId = 0;
  public score = 0;
  public lastUpdate = "";
}

export class Player {
  public playerId = 0;
  public name = "";
}

export class PlayerStatus {
  public tablePlayer = new TablePlayer();
  public player = new Player();
  public whitecards = [];
}

export class Round {
  public roundId = 0;
  public tableId = 0;
  public status = 0;
  public blackCardId = 0;
  public blackPlayerId = 0;
}

export class BlackCardObj {
  public id = 0;
  public text = "";
  public whitecards = 0;
}

export class WhiteCardObj {
  public id = 0;
  public text = "";
}
