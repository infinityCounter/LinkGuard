$(function() {
  const btn = '#en-dis-btn';
  $(btn).click(function(e){
    e.preventDefault();
    chrome.runtime.sendMessage({'msg' : 'bg-toggle'}, function(response) {
       console.log(response);
    });
  });
});

console.log(chrome.extension.getBackgroundPage().test);
