import { navigate } from "../router.js";
import { resetGame } from "../state.js";
import { button } from "../components/button.js";

export function renderMenu() {
  const screen = document.createElement("section");
  screen.className = "screen menu-screen";
  screen.innerHTML = `
    <div class="brand-mark">🧠</div>
    <h1><span>Abdullah</span> Memory</h1>
    <p class="lead">3 раунда. Проверь свою память!</p>
    <div class="menu-actions"></div>
  `;

  const actions = screen.querySelector(".menu-actions");
  actions.append(
    button("<span class='icon'>▶</span> Играть", "btn-primary", () => {
      resetGame();
      navigate("round1");
    }),
    button("<span class='icon'>⚙</span> Настройки", "btn-secondary", () => navigate("settings")),
    button("<span class='icon'>♛</span> Рекорды", "btn-ghost", () => navigate("result"))
  );

  return screen;
}
