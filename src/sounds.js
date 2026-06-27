import { state } from "./state.js";

let audioContext;

export function unlockAudio() {
  getAudioContext();
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  audioContext ||= new AudioContextClass();
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function tone({ frequency, start, duration, type, gain }) {
  if (!state.settings.soundEnabled) return;

  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const volume = context.createGain();
  const time = context.currentTime + start;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);
  volume.gain.setValueAtTime(0.0001, time);
  volume.gain.exponentialRampToValueAtTime(gain, time + 0.02);
  volume.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  oscillator.connect(volume);
  volume.connect(context.destination);
  oscillator.start(time);
  oscillator.stop(time + duration + 0.03);
}

export function playCorrectSound() {
  tone({ frequency: 660, start: 0, duration: 0.12, type: "sine", gain: 0.18 });
  tone({ frequency: 880, start: 0.1, duration: 0.14, type: "sine", gain: 0.16 });
  tone({ frequency: 1320, start: 0.22, duration: 0.16, type: "triangle", gain: 0.12 });
}

export function playTestSound() {
  playCorrectSound();
}

export function playWrongSound() {
  tone({ frequency: 180, start: 0, duration: 0.2, type: "sawtooth", gain: 0.12 });
  tone({ frequency: 110, start: 0.12, duration: 0.28, type: "square", gain: 0.09 });
}
