// console.log("content script attached");

getIconStatus(init);
function init(status) {
    let faviconDOM;
    let domain = "";
    let slashCount = 0;
    for (let i = 0; i < window.location.href.length; i++) {
        domain += window.location.href.charAt(i);
        if (window.location.href.charAt(i) == "/") slashCount++;
        if (slashCount == 3) break;
    }

    faviconDOM = document.querySelector("link[rel='icon']");
    let all = document.querySelectorAll("link[rel='icon']");
    if (all.length > 1) {
        for (var i = 1; i < all.length; i++) {
            faviconDOM.parentNode.removeChild(all[i]); 
        }
    }
    // for some reason <link> element is found inside body->p in some pages ???
    if (faviconDOM != undefined && faviconDOM.parentNode.tagName != "HEAD") {
        faviconDOM.parentNode.removeChild(faviconDOM);
        document.head.appendChild(faviconDOM);
    }
    if (faviconDOM == undefined) faviconDOM = document.querySelector("link[rel='shortcut icon']");
    if (faviconDOM == undefined || faviconDOM == null) {
        faviconDOM = document.createElement("link");
        faviconDOM.crossOrigin = "Anonymous";
        faviconDOM.rel = "shortcut icon";
        // console.log("inserting");
        document.head.appendChild(faviconDOM);
        faviconDOM.href = domain + "favicon.ico";
    }
    // console.log(faviconDOM.href);

    let ogIconURL = faviconDOM.href;

    var iconStatus = status;


    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.crossorigin = "anonymous";
    img.src = faviconDOM.href;
    // console.log(img.src);
    if (!img.src.includes(domain) && !img.src.includes("base64")) {
        // console.log("fetching");
        let req = new Request(domain + "favicon.ico");
        fetch(req)
        .then(function(resp) {
            return resp.blob();
        })
        .then(function(blob) { 
            // console.log("datareceivedE#");
            let dataURL = URL.createObjectURL(blob);
            img.src = dataURL;
        });
    }

    var newIconURL;
    var shadedIconURL = [];
    img.onload = function() {
        // setTimeout(() => {makeNewLayers(img)}, 100);
        makeNewLayers(img);
    };
    function makeNewLayers(_img) {
        let canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        canvas.style.zIndex = "9999";
        // document.body.appendChild(canvas);

        let ctx = canvas.getContext("2d");
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

        if (status) {
           faviconDOM.href = shadedIconURL[status]; 
        }

    }


    document.addEventListener("keydown", (ev) => {
        if (ev.shiftKey && ev.altKey && ev.code.includes("Digit")) {
            let newColor = ev.code.charAt(5);
            if (newColor > 3) {
                //not valid
                return;
            }
            if (iconStatus == newColor) {
                faviconDOM.href = ogIconURL;
                // console.log("to original color!");
                iconStatus = 0;
            } else {
                faviconDOM.href = shadedIconURL[newColor];
                // console.log("to color " + newColor);
                iconStatus = newColor;
            }
            setIconStatus(iconStatus, () => {});
        }
    });
}
function getIconStatus(callback) {
    chrome.runtime.sendMessage({tabs: true, get: true}, function(response) {
        callback(response.status);
    });
}
function setIconStatus(_status, callback) {
    chrome.runtime.sendMessage({tabs: true, status: _status}, function (resp) {
        callback(); 
    });
}
