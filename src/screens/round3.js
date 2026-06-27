import { navigate } from "../router.js";
import { addPoint, nextPlayerOrRound, state } from "../state.js";
import { button } from "../components/button.js";
import { playCorrectSound, playWrongSound } from "../sounds.js";
import { gameScreen, hint, playerBadge, resultOverlay } from "./round1.js";

export function renderRound3() {
  const password = Array.from({ length: state.settings.passwordLength }, () => Math.floor(Math.random() * 10)).join("");
  let index = 0;

  const screen = gameScreen("Раунд 3 из 3", "Пароль", "Запомните цифры!", "Каждая цифра показывается 1 секунду");
  const display = document.createElement("div");
  display.className = "digit-display";
  display.textContent = password[index];

  const progress = document.createElement("div");
  progress.className = "dots";
  progress.innerHTML = password.split("").map((_, dot) => `<span class="${dot === 0 ? "active" : ""}"></span>`).join("");

  const form = document.createElement("form");
  form.className = "password-form hidden";
  form.innerHTML = `
    <input inputmode="numeric" pattern="[0-9]*" maxlength="${password.length}" placeholder="Введите пароль" />
    <div class="check-slot"></div>
  `;
  form.querySelector(".check-slot").append(button("Проверить", "btn-primary", () => {}, "submit"));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = form.querySelector("input").value === password;
    if (success) {
      addPoint();
      playCorrectSound();
    } else {
      playWrongSound();
    }
    screen.append(resultOverlay(success, () => {
      const next = nextPlayerOrRound("result");
      navigate(next, { replace: next === "round3" });
    }));
  });

  const interval = setInterval(() => {
    index += 1;
    if (index >= password.length) {
      clearInterval(interval);
      display.textContent = "•";
      form.classList.remove("hidden");
      form.querySelector("input").focus();
      screen.querySelector(".hint-title").textContent = "Введите пароль.";
      return;
    }
    display.textContent = password[index];
    progress.querySelectorAll("span").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex <= index));
  }, 1000);

  screen.querySelector(".content").append(playerBadge(), display, progress, form, hint("После показа всех цифр введите пароль."));
  return screen;
}
