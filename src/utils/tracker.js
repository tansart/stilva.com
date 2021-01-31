const uuid = `${Math.random().toString(36).substr(2, 5) + Math.random().toString(36).substr(2, 5)}`;

export function trackPage(path) {
  fetch(`/t.js?u=${uuid}&p=${path}`);
}
