$(function() {
  console.log('LinkGuard Content Script Running....');
  function revealAliasedLinks() {
     // Reverse to traverse from the deepest possible anchor upwards
     $('a').toArray().reverse().map((el) => { 
       const href = el.href;
       const innards = $(el).html();
       if(href != innards) {
         $(el).before(innards);
         $(el).html(' (' + href + ') ');
       }
     });
  };

  chrome.runtime.sendMessage({'msg' : 'bg-getstate'}, function(response) {
    if(response.lg_enabled)
      revealAliasedLinks();
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.msg.toLowerCase() === 'cs-reveallinks') 
      revealAliasedLinks();
  });  

});
