// this content-script plays role of medium to publish/subscribe messages from webpage to the background script.这个内容脚本扮演了媒介的角色，从网页发布/订阅消息到后台脚本。

// this object is used to make sure our extension isn't conflicted with irrelevant messages!此对象用于确保我们的扩展与无关的消息不冲突!
var rtcmulticonnectionMessages = {
    'are-you-there': true,
    'get-sourceId':  true,
    'audio-plus-tab': true
};

// this port connects with background script.这个端口与后台脚本连接。
var port = chrome.runtime.connect();

// if background script sent a message.当背景脚本发送了一条消息。
port.onMessage.addListener(function (message) {
    // get message from background script and forward to the webpage.从后台脚本获取消息并转发到网页。
    window.postMessage(message, '*');
});

// this event handler watches for messages sent from the webpage.此事件处理程序监视从网页发送的消息。
// it receives those messages and forwards to background script
window.addEventListener('message', function (event) {
    // if invalid source.如果是无效的源。
    if (event.source != window)
        return;
        
    // it is 3rd party message.这是第三方的信息。
    if(!rtcmulticonnectionMessages[event.data]) return;
        
    // if browser is asking whether extension is available.如果浏览器询问扩展是否可用。
    if(event.data == 'are-you-there') {
        window.postMessage('rtcmulticonnection-extension-loaded', '*');
    }

    // if it is something that need to be shared with background script.如果它需要与后台脚本共享。
    if(event.data == 'get-sourceId' || event.data === 'audio-plus-tab') {
        // forward message to background script
        port.postMessage(event.data);
    }
});

// inform browser that you're available!通知浏览器已经准备好了。
window.postMessage('rtcmulticonnection-extension-loaded', '*');
