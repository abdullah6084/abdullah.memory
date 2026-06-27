export function button(label, className, onClick, type = "button") {
  const element = document.createElement("button");
  element.type = type;
  element.className = `btn ${className || ""}`;
  element.innerHTML = label;
  element.addEventListener("click", onClick);
  return element;
}
