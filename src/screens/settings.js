import { navigate } from "../router.js";
import { state } from "../state.js";
import { button } from "../components/button.js";
import { playTestSound } from "../sounds.js";

export function renderSettings() {
  const screen = document.createElement("section");
  screen.className = "screen settings-screen";
  screen.innerHTML = `
    <header class="topbar">
      <h2>Настройки</h2>
    </header>
    <form class="settings-form">
      <div class="panel">
        <h3>Игроки</h3>
        <label class="player-row">
          <span class="avatar blue">●</span>
          <span>Игрок 1</span>
          <input name="player1" value="${state.players[0]}" maxlength="14" />
        </label>
        <label class="player-row">
          <span class="avatar red">●</span>
          <span>Игрок 2</span>
          <input name="player2" value="${state.players[1]}" maxlength="14" />
        </label>
      </div>

      <div class="panel">
        <h3>Звук</h3>
        <label class="sound-row">
          <span>Звуковые эффекты</span>
          <input class="sound-toggle" name="soundEnabled" type="checkbox" ${state.settings.soundEnabled ? "checked" : ""} />
        </label>
        <div class="sound-test-slot"></div>
      </div>

      <div class="panel">
        <h3>Раунд 1 - Квадратики</h3>
        <label class="setting-row">
          <span>Размер поля</span>
          <select name="gridSize">
            ${[4, 6, 8, 10].map((size) => option(size, `${size} x ${size}`, state.settings.gridSize)).join("")}
          </select>
        </label>
      </div>

      <div class="panel">
        <h3>Раунд 2 - Смайлики в тарелках</h3>
        <label class="setting-row">
          <span>Количество тарелок</span>
          <select name="platesCount">
            ${[6, 8, 9, 10].map((count) => option(count, count, state.settings.platesCount)).join("")}
          </select>
        </label>
        <label class="setting-row">
          <span>Скорость перемешивания</span>
          <select name="speed">
            ${[
              ["slow", "Медленная"],
              ["medium", "Средняя"],
              ["fast", "Быстрая"]
            ].map(([value, label]) => option(value, label, state.settings.speed)).join("")}
          </select>
        </label>
      </div>

      <div class="panel">
        <h3>Раунд 3 - Пароль</h3>
        <label class="setting-row">
          <span>Количество цифр</span>
          <select name="passwordLength">
            ${[3, 4, 5, 6, 7].map((length) => option(length, length, state.settings.passwordLength)).join("")}
          </select>
        </label>
      </div>
      <div class="save-slot"></div>
    </form>
  `;

  screen.querySelector(".save-slot").append(
    button("Сохранить игру", "btn-success", () => {
      const form = new FormData(screen.querySelector("form"));
      state.players = [
        form.get("player1").trim() || "Игрок 1",
        form.get("player2").trim() || "Игрок 2"
      ];
      state.settings.gridSize = Number(form.get("gridSize"));
      state.settings.platesCount = Number(form.get("platesCount"));
      state.settings.speed = form.get("speed");
      state.settings.passwordLength = Number(form.get("passwordLength"));
      state.settings.soundEnabled = form.get("soundEnabled") === "on";
      navigate("menu");
    })
  );

  screen.querySelector(".sound-test-slot").append(
    button("Проверить звук", "btn-sound", () => {
      state.settings.soundEnabled = screen.querySelector("[name='soundEnabled']").checked;
      playTestSound();
    })
  );

  return screen;
}

function option(value, label, selected) {
  return `<option value="${value}" ${String(value) === String(selected) ? "selected" : ""}>${label}</option>`;
}
