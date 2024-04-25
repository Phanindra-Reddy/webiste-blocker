chrome.storage.sync.get("websites", function (data) {
  let blockedWebsites = data.websites || [];
  console.log("conten", blockedWebsites);

  for (let i = 0; i < blockedWebsites.length; i++) {
    if (window.location.href === blockedWebsites[i].url) {
      document.documentElement.innerHTML = "Hello world!!";
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "changeContent") {
    document.body.innerHTML = "<h1>Hello World!</h1>";
    sendResponse({ message: "Content changed" });
  }
});
