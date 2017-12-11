if ('serviceWorker' in navigator) {
  navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
}

$(window).load(function(){
  function e(){function e(e){
    var i="8081",a=new WebSocket("ws://"+e+":"+i);
    a.onopen=function(){
      $("<a></a>",{
        "class":"list-group-item",href:"/joy.html?websocketServer="+e+":"+i,text:e
        }
      ).appendTo("#available_IP"),a.close(),o++
    }
  }
  $("#scanning-ip-item").removeClass("hide"),$("#no-avaliable-ip-item").addClass("hide");
  for(var i="192.168.1.",a=0;100>a;a++){
    var n=i+a;console.log(n),e(n)
  }
  var o=0;setTimeout(function(){
    0==o&&$("#no-avaliable-ip-item").removeClass("hide"),$("#scanning-ip-item").addClass("hide")
  },5e3)
}
$("#refresh").click(function(){e()}),e()
});