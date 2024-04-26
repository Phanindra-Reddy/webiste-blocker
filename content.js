chrome.storage.sync.get("websites", function (data) {
  let blockedWebsites = data.websites || [];
  console.log("conten", blockedWebsites);

  for (let i = 0; i < blockedWebsites.length; i++) {
    if (window.location.href === blockedWebsites[i].url) {
      document.documentElement.innerHTML = `
      <div>  
        <img src="https://phanindra-reddy.github.io/webiste-blocker/dom_img.png" alt="stay_focused" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      `;
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "changeContent") {
    document.body.innerHTML = `
       <div>  
        <img src="https://phanindra-reddy.github.io/webiste-blocker/dom_img.png" alt="stay_focused"  style="width: 100%; height: 100%; object-fit: cover;"/>
      </div>
    `;
    sendResponse({ message: "Content changed" });
  }
});
