import { state } from "./state.js";
import { renderMenu } from "./screens/menu.js";
import { renderSettings } from "./screens/settings.js";
import { renderRound1 } from "./screens/round1.js";
import { renderRound2 } from "./screens/round2.js";
import { renderRound3 } from "./screens/round3.js";
import { renderResult } from "./screens/result.js";
import { renderBackButton } from "./components/backButton.js";

const routes = {
  menu: renderMenu,
  settings: renderSettings,
  round1: renderRound1,
  round2: renderRound2,
  round3: renderRound3,
  result: renderResult
};

export function navigate(screen, options = {}) {
  if (!options.replace && state.currentScreen !== screen) {
    state.history.push(state.currentScreen);
  }

  state.currentScreen = screen;
  render();
}

export function goBack() {
  if (state.currentScreen === "menu") return;

  if (state.currentScreen === "settings") {
    state.history = [];
    state.currentScreen = "menu";
    render();
    return;
  }

  const previous = state.history.pop() || "menu";
  state.currentScreen = previous;
  render();
}

export function render() {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  app.append(routes[state.currentScreen]());
  renderBackButton();
}
