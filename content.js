// content.js

// Retrieve the HTML document
//var htmlDocument = document.documentElement.outerHTML;

// Send the HTML document to the background script
//chrome.runtime.sendMessage({ html: htmlDocument });

// content.js

// Listen for a message from the popup or background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getData") {
    // Extract data from the HTML document or perform other actions
    //var data = document.body.innerText;

    var htmlDocument = document.documentElement.outerHTML;

    // Send the extracted data to the background script
    chrome.runtime.sendMessage({ html: htmlDocument });
  }
});
