import { navigate } from "../router.js";
import { addPoint, nextPlayerOrRound, state } from "../state.js";
import { button } from "../components/button.js";
import { playCorrectSound, playWrongSound } from "../sounds.js";

export function renderRound1() {
  const size = state.settings.gridSize;
  const targetCount = Math.max(4, Math.round(size * size * 0.18));
  const targets = randomIndexes(size * size, targetCount);
  let showing = true;
  let won = false;
  const picked = new Set();

  const screen = gameScreen("Раунд 1 из 3", "Квадратики", "Запомните цветные квадратики!", "Показ 10 секунд");
  const player = playerBadge();
  const grid = document.createElement("div");
  grid.className = "memory-grid";
  grid.style.setProperty("--grid-size", size);

  for (let index = 0; index < size * size; index += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    if (targets.has(index)) cell.classList.add("target");
    cell.addEventListener("click", () => {
      if (showing || won) return;
      if (!targets.has(index)) {
        finish(false);
        return;
      }
      picked.add(index);
      cell.classList.add("picked");
      if (picked.size === targets.size) finish(true);
    });
    grid.append(cell);
  }

  const timer = timerBar(10, () => {
    showing = false;
    grid.querySelectorAll(".target").forEach((cell) => cell.classList.remove("target"));
    screen.querySelector(".hint-title").textContent = "Выберите все цветные квадратики.";
  });

  screen.querySelector(".content").append(player, grid, timer, hint("Если выберете белый - вы проиграли!"));

  function finish(success) {
    won = true;
    if (success) {
      addPoint();
      playCorrectSound();
    } else {
      playWrongSound();
    }
    screen.append(resultOverlay(success, () => {
      const next = nextPlayerOrRound("round2");
      navigate(next, { replace: next === "round1" });
    }));
  }

  return screen;
}

export function gameScreen(kicker, title, text, subtext) {
  const screen = document.createElement("section");
  screen.className = "screen game-screen";
  screen.innerHTML = `
    <header class="round-head">
      <span class="pill">${kicker}</span>
      <button class="round-gear" type="button" aria-label="Настройки">⚙</button>
    </header>
    <div class="content">
      <h2>${title}</h2>
      <p class="hint-title">${text}</p>
      <p class="subtle">${subtext}</p>
    </div>
  `;
  screen.querySelector(".round-gear").addEventListener("click", () => navigate("settings"));
  return screen;
}

export function playerBadge() {
  const badge = document.createElement("div");
  badge.className = "player-badge";
  badge.textContent = `Ход: ${state.players[state.currentPlayer]}`;
  return badge;
}

export function timerBar(seconds, done) {
  const wrap = document.createElement("div");
  wrap.className = "timer";
  wrap.innerHTML = `<span></span><b>${seconds} сек</b>`;
  const fill = wrap.querySelector("span");
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / (seconds * 1000), 1);
    fill.style.transform = `scaleX(${1 - progress})`;
    if (progress < 1) requestAnimationFrame(tick);
    else done();
  }

  requestAnimationFrame(tick);
  return wrap;
}

export function hint(text) {
  const box = document.createElement("div");
  box.className = "hint-box";
  box.innerHTML = `<span>💡</span><p>${text}</p>`;
  return box;
}

export function resultOverlay(success, onNext) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="modal">
      <h3>${success ? "Верно!" : "Ошибка"}</h3>
      <p>${state.players[state.currentPlayer]} ${success ? "получает 1 очко" : "получает 0 очков"}</p>
      <div class="next-slot"></div>
    </div>
  `;
  overlay.querySelector(".next-slot").append(button("Продолжить", "btn-primary", onNext));
  return overlay;
}

function randomIndexes(max, count) {
  const indexes = [...Array(max).keys()];
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return new Set(indexes.slice(0, count));
}
