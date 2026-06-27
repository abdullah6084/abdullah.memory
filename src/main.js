import { render } from "./router.js";
import { unlockAudio } from "./sounds.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

window.addEventListener("pointerdown", unlockAudio, { once: true });

render();
