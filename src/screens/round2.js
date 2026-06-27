import { navigate } from "../router.js";
import { addPoint, nextPlayerOrRound, state } from "../state.js";
import { playCorrectSound, playWrongSound } from "../sounds.js";
import { gameScreen, hint, playerBadge, resultOverlay, timerBar } from "./round1.js";

const EMOJIS = ["😎", "😊", "😜", "😍", "🤔", "😇", "🙂", "😵", "😡", "🥳"];
const SPEED_DELAY = {
  slow: 1200,
  medium: 760,
  fast: 420
};

const SPEED_DURATION = {
  slow: 820,
  medium: 520,
  fast: 300
};

export function renderRound2() {
  const count = state.settings.platesCount;
  const targetIndex = Math.floor(Math.random() * count);
  const targetEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  let canChoose = false;
  let finished = false;

  const screen = gameScreen("Раунд 2 из 3", "Смайлики в тарелках", "Запомните свой смайлик и следите за тарелкой!", "Показ 10 секунд");
  const targetCard = document.createElement("div");
  targetCard.className = "target-emoji";
  targetCard.innerHTML = `<span>Ваш смайлик</span><strong>${targetEmoji}</strong>`;

  const plates = document.createElement("div");
  plates.className = "plates";
  plates.style.setProperty("--plate-count", count);

  for (let index = 0; index < count; index += 1) {
    const plate = document.createElement("button");
    plate.type = "button";
    plate.className = "plate";
    plate.dataset.target = index === targetIndex ? "true" : "false";
    const emoji = index === targetIndex ? targetEmoji : nextDecoyEmoji(index, targetEmoji);
    plate.innerHTML = `<span class="plate-face">${emoji}</span>`;
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
      plate.classList.add("hidden-emoji");
    });
    screen.querySelector(".hint-title").textContent = "Следите за перемещением тарелки.";
    shufflePlates(plates, state.settings.speed, () => {
      canChoose = true;
      screen.querySelector(".hint-title").textContent = "Выберите свою тарелку.";
    });
  });

  screen.querySelector(".content").append(playerBadge(), targetCard, plates, timer, hint("После переворота тарелки перемешаются. Следите за своей тарелкой."));
  return screen;
}

function nextDecoyEmoji(index, targetEmoji) {
  const decoys = EMOJIS.filter((emoji) => emoji !== targetEmoji);
  return decoys[index % decoys.length];
}

function shufflePlates(container, speed, done) {
  let moves = 0;
  const delay = SPEED_DELAY[speed];
  const duration = SPEED_DURATION[speed];
  const interval = setInterval(() => {
    const items = [...container.children];
    const a = Math.floor(Math.random() * items.length);
    const b = Math.floor(Math.random() * items.length);

    if (a !== b) {
      animateSwap(container, items[a], items[b], duration);
    }

    moves += 1;
    if (moves > 10) {
      clearInterval(interval);
      setTimeout(done, duration);
    }
  }, delay);
}

function animateSwap(container, first, second, duration) {
  const firstBox = first.getBoundingClientRect();
  const secondBox = second.getBoundingClientRect();
  const marker = document.createComment("swap");

  container.insertBefore(marker, first);
  container.insertBefore(first, second);
  container.insertBefore(second, marker);
  marker.remove();

  const nextFirstBox = first.getBoundingClientRect();
  const nextSecondBox = second.getBoundingClientRect();

  animateMove(first, firstBox, nextFirstBox, duration);
  animateMove(second, secondBox, nextSecondBox, duration);
}

function animateMove(element, from, to, duration) {
  element.animate(
    [
      { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` },
      { transform: "translate(0, 0)" }
    ],
    {
      duration,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
    }
  );
}
