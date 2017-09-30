"use strict";

const key = 'enabled';

chrome.state.onChange.addListener(function(change, namespace) {
    if(changes[key] !== undefined)
    {
      console.log(`The value of ${key} is ${changes[key]}`);
    }
});

const setState = function(newState) {
    chrome.storage.sync.set({key});
};

const toggleState = () => {
    console.log('hola');
};
