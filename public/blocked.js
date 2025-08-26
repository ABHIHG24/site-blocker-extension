chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateRules") {
    const sites = message.sites; // e.g., ["*.instagram.com", "facebook.com", ...]
    // Remove previously added dynamic rules (IDs 1000-1999)
    const ruleIdsToRemove = [];
    for (let i = 1000; i < 2000; i++) {
      ruleIdsToRemove.push(i);
    }
    // Option 1: Use chrome.runtime.id (should work if resolved correctly)
    const extensionId = chrome.runtime.id;
    // Option 2: Hard-code your extension's ID (for testing only)
    // const extensionId = "ecnbajcfbknnkjhchajkhmobmdagpdak";

    const newRules = sites.map((site, index) => {
      // Use regexFilter for Facebook as an example
      if (site.toLowerCase().includes("facebook.com")) {
        return {
          id: 1000 + index,
          priority: 1,
          action: {
            type: "redirect",
            redirect: { extensionPath: "/blocked.html" },
          },
          condition: {
            regexFilter: "^https?://(www\\.)?facebook\\.com/.*",
            resourceTypes: ["main_frame"],
            excludedInitiatorDomains: [extensionId],
          },
        };
      } else {
        return {
          id: 1000 + index,
          priority: 1,
          action: {
            type: "redirect",
            redirect: { extensionPath: "/blocked.html" },
          },
          condition: {
            urlFilter: site,
            resourceTypes: ["main_frame"],
            excludedInitiatorDomains: [extensionId],
          },
        };
      }
    });

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
    return true; // For asynchronous sendResponse
  }
});
