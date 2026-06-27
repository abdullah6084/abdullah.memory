import { navigate } from "../router.js";
import { addPoint, nextPlayerOrRound, state } from "../state.js";
import { playCorrectSound, playWrongSound } from "../sounds.js";
import { gameScreen, hint, playerBadge, resultOverlay, timerBar } from "./round1.js";

const EMOJIS = ["😎", "😊", "😜", "😍", "🤔", "😇", "🙂", "😵", "😡", "🥳"];
const SPEED_DELAY = {
  slow: 900,
  medium: 560,
  fast: 320
};

export function renderRound2() {
  const count = state.settings.platesCount;
  const targetIndex = Math.floor(Math.random() * count);
  const targetEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  let canChoose = false;
  let finished = false;

  const screen = gameScreen("Раунд 2 из 3", "Смайлики в тарелках", "Запомните, в какой тарелке ваш смайлик!", "Показ 10 секунд");
  const plates = document.createElement("div");
  plates.className = "plates";
  plates.style.setProperty("--plate-count", count);

  for (let index = 0; index < count; index += 1) {
    const plate = document.createElement("button");
    plate.type = "button";
    plate.className = "plate";
    plate.dataset.target = index === targetIndex ? "true" : "false";
    plate.textContent = index === targetIndex ? targetEmoji : EMOJIS[index % EMOJIS.length];
    plate.addEventListener("click", () => {
      if (!canChoose || finished) return;
      finished = true;
      const success = plate.dataset.target === "true";
      if (success) {
        addPoint();
        playCorrectSound();
      } else {
        playWrongSound();
      }
      plate.classList.add(success ? "correct" : "wrong");
      screen.append(resultOverlay(success, () => {
        const next = nextPlayerOrRound("round3");
        navigate(next, { replace: next === "round2" });
      }));
    });
    plates.append(plate);
  }

  const timer = timerBar(10, () => {
    plates.querySelectorAll(".plate").forEach((plate) => {
      plate.textContent = "🍽";
      plate.classList.add("hidden-emoji");
    });
    shufflePlates(plates, SPEED_DELAY[state.settings.speed], () => {
      canChoose = true;
      screen.querySelector(".hint-title").textContent = "Выберите свою тарелку.";
    });
  });

  screen.querySelector(".content").append(playerBadge(), plates, timer, hint("Потом тарелки перемешаются! Выберите свою тарелку."));
  return screen;
}

function shufflePlates(container, delay, done) {
  let moves = 0;
  const interval = setInterval(() => {
    const items = [...container.children];
    const a = Math.floor(Math.random() * items.length);
    const b = Math.floor(Math.random() * items.length);
    container.insertBefore(items[a], items[b]);
    moves += 1;
    if (moves > 12) {
      clearInterval(interval);
      done();
    }
  }, delay);
}
