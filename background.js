chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "addWebsite") {
    chrome.storage.sync.get({ websites: [] }, function (data) {
      let blockedWebsites = data.websites || [];

      blockedWebsites.push(message.data);

      chrome.storage.sync.set({ websites: blockedWebsites }, function () {
        if (chrome.runtime.lastError) {
          console.error(
            "Error storing array: " + chrome.runtime.lastError.message
          );
        } else {
          console.log("Website stored successfully!");
          chrome.runtime.sendMessage({ action: "updateUI" });
          chrome.tabs.query({ url: message.data.url }, function (tabs) {
            if (tabs && tabs.length > 0) {
              // Send a message to the content script of the tab
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "performActionOnDocument",
              });
            }
          });
        }
      });
    });
  } else if (message.action === "deleteWebsite") {
    chrome.storage.sync.get({ websites: [] }, function (data) {
      let blockedWebsites = data.websites || [];

      let updatedWebsites = blockedWebsites?.filter(
        (x) => x.id !== message.data
      );

      console.log(updatedWebsites, message.data);

      chrome.storage.sync.set({ websites: updatedWebsites }, function () {
        if (chrome.runtime.lastError) {
          console.error(
            "Error storing array: " + chrome.runtime.lastError.message
          );
        } else {
          console.log("Array stored successfully!");
          chrome.runtime.sendMessage({ action: "updateUI" });
        }
      });
    });
  } else if (message.action === "deleteAllWebsites") {
    chrome.storage.sync.clear(function () {
      console.log("Sync storage cleared");
      chrome.runtime.sendMessage({ action: "updateUI" });
    });
  }
});
