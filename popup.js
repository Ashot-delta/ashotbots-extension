document.addEventListener("DOMContentLoaded", async () => {
  const nameEl = document.getElementById("botName");
  const qtyEl = document.getElementById("botQty");
  const statusText = document.getElementById("statusText");
  const dot = document.getElementById("dot");

  // Charger les paramètres
  chrome.storage.local.get(["ashotBotName", "ashotBotQty"], (data) => {
    if (data.ashotBotName) nameEl.value = data.ashotBotName;
    if (data.ashotBotQty) qtyEl.value = data.ashotBotQty;
  });

  document.getElementById("save").addEventListener("click", async () => {
    const name = nameEl.value.trim() || "AshotBots";
    let qty = parseInt(qtyEl.value) || 200;
    qty = Math.max(1, Math.min(200, qty));

    // 1. Sauvegarder dans chrome.storage
    await chrome.storage.local.set({ ashotBotName: name, ashotBotQty: qty });

    // 2. Écrire AUSSI dans le localStorage de l'onglet agar.io
    const tabs = await chrome.tabs.query({ url: ["*://agar.io/*", "*://*.agar.io/*"] });
    for (const tab of tabs) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (n, q) => {
            localStorage.setItem("ashot-bot-tag", n);
            localStorage.setItem("ashot-bot-qty", String(q));
          },
          args: [name, qty]
        });
      } catch (e) {
        console.warn("Impossible d'écrire dans l'onglet", tab.id, e);
      }
    }

    statusText.textContent = "Saved ✓ (recharge agar.io)";
    dot.classList.add("on");
    setTimeout(() => { statusText.textContent = "Ready"; }, 2000);
  });

  document.getElementById("openAgar").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://agar.io" });
    window.close();
  });
});