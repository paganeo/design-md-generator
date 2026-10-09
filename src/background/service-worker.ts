// Background Service Worker for Design.MD Generator (Manifest V3)

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Design.MD Generator extension successfully installed.');
  } else if (details.reason === 'update') {
    console.log('Design.MD Generator extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Optional message bridge if background processing is requested
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG', version: chrome.runtime.getManifest().version });
  }
  return true;
});
