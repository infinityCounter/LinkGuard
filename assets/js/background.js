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


const key = 'enabled';

const setStorage = (key, newState) =>  
{
  return storage.set({[key] : newState});
};

const getFromStorage = (key) => 
{
  return storage.get(key);
};

function toggleEnableStore() 
{
  return new Promise((resolve, reject) =>
  {
    getFromStorage(key).then(function(currentState) {
      if(typeof currentState == 'undefined' || currentState == null)
        currentState = 1;
      return new Promise(function(resolve, reject) {
        console.log('resolving....');
        resolve(currentState);
       });  
     })
     .then((currentState) => setStorage(key, (currentState.enabled === 1)? 0 : 1))
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
    if(request.msg.toLowerCase()  === "bg-toggle") 
      toggleEnableStore().then(function(result) {
        console.log(result);
        sendResponse(result);
        console.log('Result sent!');
      });
    // Indicates that the handler will response asynchronously
    return true;
  }
);
