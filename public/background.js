// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateRules") {
    const sites = message.sites; // an array of website patterns, e.g., ["*.instagram.com", "*.example.com"]
    // We'll remove all dynamic rules we previously added (IDs 1000-1999) and add new ones.
    const ruleIdsToRemove = [];
    for (let i = 1000; i < 2000; i++) {
      ruleIdsToRemove.push(i);
    }
    const newRules = sites.map((site, index) => ({
      id: 1000 + index,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { extensionPath: "/blocked.html" },
      },
      condition: {
        urlFilter: site,
        resourceTypes: ["main_frame"],
      },
    }));
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: ruleIdsToRemove,
        addRules: newRules,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          sendResponse({
            status: "error",
            error: chrome.runtime.lastError.message,
          });
        } else {
          console.log("Dynamic rules updated", newRules);
          sendResponse({ status: "ok" });
        }
      }
    );
    return true; // Indicates that sendResponse will be called asynchronously.
  }
});
