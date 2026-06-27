import { state } from "../state.js";
import { goBack } from "../router.js";

export function renderBackButton() {
  document.querySelector(".back-fab")?.remove();

  if (state.currentScreen === "menu") return;

  const back = document.createElement("button");
  back.className = "back-fab";
  back.type = "button";
  back.setAttribute("aria-label", "Назад");
  back.textContent = "←";
  back.addEventListener("click", goBack);
  document.body.append(back);
}
