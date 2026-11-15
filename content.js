// content.js — s'exécute dans l'isolated world
// Son seul rôle : injecter inject.js dans le MAIN world (contexte page)

(function () {
  const url = chrome.runtime.getURL("inject.js");
  const script = document.createElement("script");
  script.src = url;
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

  // Relaie les messages entre le popup et le script injecté
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data && event.data.__ashot === "toBackground") {
      // rien à faire pour l'instant, tout est géré dans la page
    }
  });
})();