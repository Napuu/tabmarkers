chrome.tabs.query({}, function (tabs) {
    // for (i in tabs) {
        // console.log("tab");
        // console.log(tabs[i].favIconUrl);
        // tabs[i].favIconUrl = "https://www.google.fi/favicon.ico";
        // chrome.tabs.executeScript({
            // code: "document.title='eyy'" 
        // });
    // }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
    console.log('Turning ' + tab.url + ' red!');
    
});

chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({active: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: command}, function (resp) {
            console.log(resp); 
        }); 
    });
});

