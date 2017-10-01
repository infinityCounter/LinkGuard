$(function() {
  const btn = '#en-dis-btn';
  const str_dis = 'Disable';
  const str_en = 'Enable';

  $(btn).click(function(e) {
    e.preventDefault();
    chrome.runtime.sendMessage({'msg' : 'bg-toggle'}, function(response) {
       console.log(response);
       $(btn).text((response.lg_enabled) ? str_dis : str_en);
    });
  });

  chrome.runtime.sendMessage({'msg' : 'bg-getstate'}, function(response) {
    console.log(`State on open... ${response.lg_enabled}`);
    $(btn).text((response.lg_enabled) ? str_dis : str_en);
  });
});
