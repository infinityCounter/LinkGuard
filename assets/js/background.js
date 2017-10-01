"use strict";

const asPromised = (block) => {
    return new Promise((resolve, reject) => {
        block((...results) => {
            if (chrome.runtime.lastError) {
                reject(chrome.extension.lastError);
            } else {
                resolve(...results);
            }
        });
    });
};

const storage = {
    set(items) {
        return asPromised((callback) => {
            chrome.storage.sync.set(items, callback);
        });
    },

    get(keys) {
        return asPromised((callback) => {
            chrome.storage.sync.get(keys, callback);
        });
    },

    remove(keys) {
        return asPromised((callback) => {
            chrome.storage.sync.remove(keys, callback);
        });
    }
};

const key = 'lg_enabled';

const setStorage = (key, newState) =>  
{
  return storage.set({[key] : newState});
};

const getFromStorage = (key) =>  
{
  return new Promise(function(resolve, reject) {
    storage.get(key).then(function(currState) {
      if(typeof currState == 'undefined' || !currState.hasOwnProperty(key))
        currState = {[key] : 0};
      resolve(currState);
    });
  });
};

const toggleEnableStore = () => 
{
  return new Promise((resolve, reject) =>
  {
    getFromStorage(key)
     .then((currentState) => setStorage(key, (currentState[key] === 1)? 0 : 1))
     .then(() => getFromStorage(key))
     .then(resolve);
  });    
}

/*function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}*/

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);  
    if(request.msg.toLowerCase() === 'bg-toggle') 
      toggleEnableStore().then(function(result) {
        sendResponse(result);
        console.log('Result sent!');
        if(result[key])
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {'msg' : 'cs-reveallinks'}, function(response) {});  
          });
      });
    else if(request.msg.toLowerCase() === 'bg-getstate')
      getFromStorage(key).then(sendResponse);
    // Indicates that the handler will response asynchronously
    return true;
  }
);
