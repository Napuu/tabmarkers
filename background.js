var iconStatuses = {};
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.tabs) {
            let tabID = sender.tab.id;
            if (request.get) {
                let tabStatus = iconStatuses.tabID;
                // console.log("tab status of " + tabID + ": " + tabStatus);
                sendResponse({status: tabStatus});
            } else {
                let tabStatus = request.status;
                // console.log("tab status of " + tabID + " set to " + tabStatus);
                iconStatuses.tabID = tabStatus;
                sendResponse({});
            }
        }
    }
);

