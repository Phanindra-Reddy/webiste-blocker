let blockThisSiteBtn = document.querySelector("#blockThisSite");
let clearAllBlockedSitesBtn = document.querySelector("#clearAllBlockedSites");
let listOfBlockedSitesDiv = document.querySelector("#listOfBlockedSites");
let noBlockedSitesFoundDiv = document.querySelector("#noBlockedSitesFound");
let blockedSitesHeading = document.querySelector("#blockedSitesHeading");

document.addEventListener("DOMContentLoaded", () => {
  blockThisSiteBtn.addEventListener("click", (e) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let currentTab = tabs[0];
      let currentUrl = currentTab?.url;

      function generateUniqueId() {
        const randomPart = Math.random().toString(36).substring(2, 9);
        const timePart = Date.now().toString(36);
        return timePart + randomPart;
      }

      let newWebsite = {
        id: generateUniqueId(),
        url: currentUrl,
        urlData: tabs[0],
      };

      chrome.storage.sync.get({ websites: [] }, function (data) {
        let blockedWebsites = data.websites || [];

        let alreadyExisted = blockedWebsites.filter(
          (x) => x.url === currentUrl
        );
        if (alreadyExisted?.length > 0) {
          document.querySelector("#alreadyExisted").classList.remove("hidden");
          document.querySelector("#alreadyExisted").classList.add("block");
          setTimeout(() => {
            document.querySelector("#alreadyExisted").classList.add("hidden");
          }, 2000);
        } else {
          chrome.runtime.sendMessage({
            action: "addWebsite",
            data: newWebsite,
          });
        }
      });
    });
  });

  //load all the blocked websites

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.action === "updateUI") {
      updatePopupUI();
    }
  });

  function updatePopupUI() {
    chrome.storage.sync.get("websites", function (data) {
      const blockedWebsites = data?.websites || [];
      console.log(blockedWebsites?.length);

      if (blockedWebsites?.length > 0) {
        listOfBlockedSitesDiv.innerHTML = "";
        const htmlContent = blockedWebsites?.map(
          (website) =>
            `
            <div class="flex items-center justify-between px-2 py-1 rounded-md ease-in duration-300 hover:bg-gray-100" key=${
              website?.urlData?.id
            }>
                <div class="flex items-center gap-2">
                    <img
                        src=${website?.urlData?.favIconUrl || "web.png"}
                        alt=${website?.urlData?.title}
                        class="w-8"
                    />
                    <h3 class="font-semibold">${website?.urlData?.title}</h3>
                </div>
                <button data-tab-id=${
                  website.id
                } class="rounded-md p-1 text-red-500 hover:bg-red-500 hover:text-white ease-linear duration-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-4 h-4"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        `
        );
        listOfBlockedSitesDiv.innerHTML = htmlContent;
        noBlockedSitesFoundDiv.classList.add("hidden");
        blockedSitesHeading.classList.add("block");
        blockedSitesHeading.classList.remove("hidden");
      } else {
        listOfBlockedSitesDiv.innerHTML = "";
        noBlockedSitesFoundDiv.classList.remove("hidden");
        blockedSitesHeading.classList.remove("block");
        blockedSitesHeading.classList.add("hidden");
      }
    });
  }
  updatePopupUI();

  //unblock clicked website
  listOfBlockedSitesDiv.addEventListener("click", (e) => {
    const targetDiv = e.target;
    const btn = targetDiv.closest("button");
    const tabId = btn.dataset.tabId;

    if (tabId) {
      console.log("clicked", tabId);
      chrome.runtime.sendMessage({
        action: "deleteWebsite",
        data: tabId,
      });
    }
  });

  //clear all blocked websites
  clearAllBlockedSitesBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "deleteAllWebsites",
    });
  });
});
