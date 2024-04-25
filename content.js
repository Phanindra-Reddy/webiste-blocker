chrome.storage.sync.get("websites", function (data) {
  let blockedWebsites = data.websites || [];
  console.log("conten", blockedWebsites);

  for (let i = 0; i < blockedWebsites.length; i++) {
    if (window.location.href === blockedWebsites[i].url) {
      document.documentElement.innerHTML = "Hello world!!";
    }
  }
});
