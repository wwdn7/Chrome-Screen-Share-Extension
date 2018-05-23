// this background script is used to invoke desktopCapture API.此背景脚本用于调用desktopCapture API。
// to capture screen-MediaStream.为了捕捉screen-MediaStream。

var screenOptions = ['screen', 'window'];
console.log(chrome);

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(portOnMessageHanlder);
    
    // this one is called for each message from "content-script.js"这一个是从“content-script.js”中调用的消息。
    function portOnMessageHanlder(message) {
        if(message == 'get-sourceId') {
            chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
        }

        if(message == 'audio-plus-tab') {
            screenOptions = ['screen', 'window', 'audio', 'tab'];
            chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
        }
    }

    // on getting sourceId.
    // "sourceId" will be empty if permission is denied.
    // 当获取sourceId时，如果被拒绝，“sourceId”将是空的。
    function onAccessApproved(sourceId, opts) {
        // if "cancel" button is clicked.如果点击取消按钮。
        if(!sourceId || !sourceId.length) {
            return port.postMessage('PermissionDeniedError');
        }
        
        // "ok" button is clicked; share "sourceId" with the
        // content-script which will forward it to the webpage
        // 点击“ok”按钮;与内容脚本共享“sourceId”，并将其转发到网页。
        port.postMessage({
            sourceId: sourceId,
            canRequestAudioTrack: !!opts.canRequestAudioTrack
        });
    }
});
