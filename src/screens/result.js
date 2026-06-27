import { navigate } from "../router.js";
import { resetGame, state } from "../state.js";
import { button } from "../components/button.js";

export function renderResult() {
  const [score1, score2] = state.scores;
  const draw = score1 === score2;
  const winnerIndex = score1 > score2 ? 0 : 1;

  const screen = document.createElement("section");
  screen.className = "screen result-screen";
  screen.innerHTML = `
    <h2>Итог игры</h2>
    <div class="trophy">🏆</div>
    <h3>${draw ? "Ничья!" : "Победитель!"}</h3>
    <p class="winner">${draw ? "Оба игрока" : state.players[winnerIndex]}</p>
    <div class="score-board">
      <div class="score-card blue-score">
        <span>${state.players[0]}</span>
        <strong>${score1}</strong>
      </div>
      <b>:</b>
      <div class="score-card red-score">
        <span>${state.players[1]}</span>
        <strong>${score2}</strong>
      </div>
    </div>
    <div class="result-actions"></div>
  `;

  const actions = screen.querySelector(".result-actions");
  actions.append(
    button("↻ Играть ещё раз", "btn-primary", () => {
      resetGame();
      navigate("round1", { replace: true });
    }),
    button("⌂ В главное меню", "btn-dark", () => navigate("menu", { replace: true }))
  );

  return screen;
}
