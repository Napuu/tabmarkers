console.log("content script attached");
// let faviconDOM = <link rel="shortcut icon" type="image/ico" href="favicon.ico">
// document.body.appendChild(faviconDOM);

// console.log($("link").attr("href"));

let iconURL = "https://www.google.com/favicon.ico";

// let originalURL = 

let faviconDOM;
console.log(window.location.href);
let domain = "";
let slashCount = 0;
for (let i = 0; i < window.location.href.length; i++) {
    domain += window.location.href.charAt(i);
    if (window.location.href.charAt(i) == "/") slashCount++;
    if (slashCount == 3) break;
}
console.log(domain);
function toDataURL(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
              var reader = new FileReader();
              reader.onloadend = function() {
                        callback(reader.result);
                      }
              reader.readAsDataURL(xhr.response);
            };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
}

var img2 = new Image();
faviconDOM = document.querySelector("link[rel='icon']");
if (faviconDOM == undefined) {
    faviconDOM = document.querySelector("link[rel='shortcut icon']");
}
if (faviconDOM == undefined || faviconDOM == null) {
    let link = document.createElement("link");
    link.rel = "shortcut icon";
    faviconDOM = link;
    document.head.appendChild(faviconDOM);
    link.href = domain + "/favicon.ico";
    console.log("appending lköasjlk");
    console.log("appending link to head");
    
}
// console.log(faviconDOM.href);

done();
function done() {
    let ogIconURL = faviconDOM.href;

    var canvas = document.createElement("canvas");
    canvas.crossorigin = "use-credentials";
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    var iconStatus = 0;

    var ctx = canvas.getContext("2d");

    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = ogIconURL;


    var newIconURL;
    var shadedIconURL = [];
    img.onload = function() {
        console.log("img1 loaded");
        makeNewLayers(img);
            // faviconDOM.href = canvas.toDataURL("image/png");
    };
    img2.onload = () => {
        console.log("moi img 2 loaded");
        makeNewLayers(img2);
    }
    function makeNewLayers(_img) {
        console.log(_img);
        let colorOpacity = 0.5;

        canvas.width = _img.width;
        canvas.height = _img.height;
        
        ctx.fillStyle = "rgba(255, 0, 0, " + colorOpacity + ")";
        ctx.drawImage(_img, 0, 0);
        ctx.fillRect(0, 0, _img.width, _img.height);
        shadedIconURL[1] = canvas.toDataURL("image/png");
        
        ctx.clearRect(0, 0, _img.width, _img.height);

        ctx.fillStyle = "rgba(0, 255, 0, " + colorOpacity + ")";
        ctx.drawImage(_img, 0, 0);
        ctx.fillRect(0, 0, _img.width, _img.height);
        shadedIconURL[2] = canvas.toDataURL("image/png");
     
        ctx.clearRect(0, 0, _img.width, _img.height);

        ctx.fillStyle = "rgba(0, 0, 255, " + colorOpacity + ")";
        ctx.drawImage(_img, 0, 0);
        ctx.fillRect(0, 0, _img.width, _img.height);
        shadedIconURL[3] = canvas.toDataURL("image/png");


    }
    document.addEventListener("keydown", (ev) => {
    if (ev.shiftKey && ev.altKey && ev.code.includes("Digit")) {
        let newColor = ev.code.charAt(5);
        if (iconStatus) {
            faviconDOM.href = ogIconURL;
            iconStatus = 0;
        } else {
            faviconDOM.href = shadedIconURL[newColor];
            iconStatus = newColor;
        }
    }
});

}
// chrome.runtime.onMessage.addListener(
    // function(request, sender, sendResponse) {
        // let colorToToggle = -1;
        // if (request.command != undefined && request.command.includes("toggleColor")) {
            // colorToToggle = request.command.charAt(11);
        // }
        // if (iconStatus == colorToToggle) {
            // faviconDOM.href = ogIconURL;
            // iconStatus = 0;
        // } else {
            // faviconDOM.href = shadedIconURL[colorToToggle];
            // iconStatus = colorToToggle;
        // }
        // console.log("juujuu");
        // sendResponse("got it");
        // return true;
    // }
// );
