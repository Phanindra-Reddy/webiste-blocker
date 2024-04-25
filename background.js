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
          console.log("Array stored successfully!");
          chrome.runtime.sendMessage({ action: "updateUI" });
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
