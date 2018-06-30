console.log("content script attached");
// let faviconDOM = <link rel="shortcut icon" type="image/ico" href="favicon.ico">
// document.body.appendChild(faviconDOM);

// console.log($("link").attr("href"));

let iconURL = "https://www.google.com/favicon.ico";

// let originalURL = 

let faviconDOM = document.querySelector("link[rel*='icon']");
console.log(faviconDOM.href);

let ogIconURL = faviconDOM.href;
// document.querySelector("link[rel='shortcut icon']").href = iconURL;


// document.querySelector("link[rel*='icon']").href = iconURL;
//
//

var canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "0px";
canvas.style.zIndex = "9999";
document.body.appendChild(canvas);

var img = new Image();
img.crossOrigin = "Anonymous";
img.src = ogIconURL;

var ctx = canvas.getContext("2d");

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.drawImage(img, 0, 0);
    ctx.fillRect(0, 0, img.width, img.height);
    faviconDOM.href = canvas.toDataURL("image/png");
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if (faviconDOM.href == iconURL) {
            faviconDOM.href = ogIconURL;
        } else {
            faviconDOM.href = iconURL;
        }
        sendResponse("got it");
    }
);
