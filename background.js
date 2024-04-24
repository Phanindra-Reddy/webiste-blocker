

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Check if the message contains HTML content
    if (message.html) {
        // Handle the received HTML document
        console.log("HTML document of active tab:", message.html);
        
        // Now you can further process or use the HTML document as needed
    }
});
