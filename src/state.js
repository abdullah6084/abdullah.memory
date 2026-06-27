export const state = {
  currentScreen: "menu",
  history: [],
  players: ["Абдуллах", "Исмаил"],
  scores: [0, 0],
  currentPlayer: 0,
  round: 1,
  settings: {
    gridSize: 6,
    platesCount: 8,
    speed: "medium",
    passwordLength: 5,
    soundEnabled: true
  }
};

export function resetGame() {
  state.scores = [0, 0];
  state.currentPlayer = 0;
  state.round = 1;
  state.history = ["menu"];
}

export function nextPlayerOrRound(nextRoundScreen) {
  if (state.currentPlayer === 0) {
    state.currentPlayer = 1;
    return state.currentScreen;
  }

  state.currentPlayer = 0;
  state.round += 1;
  return nextRoundScreen;
}

export function addPoint() {
  state.scores[state.currentPlayer] += 1;
}
