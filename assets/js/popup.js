$(function() {
  const btn = '#en-dis-btn';
  const str_dis = 'Disable';
  const str_en = 'Enable';

  $(btn).click(function(e) {
    e.preventDefault();
    chrome.runtime.sendMessage({'msg' : 'bg-toggle'}, function(response) {
       console.log(response);
       $(btn).text((response.enabled) ? str_dis : str_en);
    });
  });

  const promise = chrome.extension.getBackgroundPage().getState();
  promise.then(function(state) {
    console.log(`State on open ${state.enabled}`);
    $(btn).text((state.enabled) ? str_dis : str_en);
  });
});
