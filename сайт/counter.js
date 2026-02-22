const KEY = "wok_online_tabs";

// уникальный id вкладки
const TAB_ID = Date.now() + "_" + Math.random();

function getTabs() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

function setTabs(tabs) {
    // Чистим "мёртвые" вкладки (старше 10 секунд)
    const now = Date.now();
    const aliveTabs = tabs.filter(id => {
        const tabTime = parseInt(id.split("_")[0]);
        return now - tabTime < 10000; // 10 секунд
    });
    localStorage.setItem(KEY, JSON.stringify(aliveTabs));
    return aliveTabs;
}

function updateCounter() {
    const tabs = getTabs();
    const aliveTabs = setTabs(tabs); // сразу чистим при обновлении
    document.getElementById("onlineCount").textContent = aliveTabs.length;
}

// при открытии вкладки
(function addTab() {
    const tabs = getTabs();
    tabs.push(TAB_ID);
    setTabs(tabs);
    updateCounter();
})();

// при закрытии вкладки
window.addEventListener("beforeunload", () => {
    let tabs = getTabs();
    tabs = tabs.filter(id => id !== TAB_ID);
    setTabs(tabs);
});

// синхронизация между вкладками
window.addEventListener("storage", (e) => {
    if (e.key === KEY) updateCounter();
});

// Дополнительно: проверяем каждые 3 секунды и чистим мёртвые
setInterval(() => {
    updateCounter();
}, 3000);