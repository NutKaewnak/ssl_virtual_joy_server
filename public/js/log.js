function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var server = getParameterByName('websocketServer')
var ws = new WebSocket('ws://' + server);
// var ws = new WebSocket('ws://' + server + "/?permission=admin");

ws.onopen = function() {
  // Web Socket is connected, send data using send()
  // ws.send("Message to send");
  // alert("Message is sent...");
  $("#chatbox").append("<div class='msgln'>"+ "Connected: " + getParameterByName('websocketServer') + "</div>")
  $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight+ 20);
  ping(0);
};

ws.onmessage = function (evt) {
  var received_msg = evt.data;
  $("#chatbox").append("<div class='msgln'>"+ "Received: " + received_msg + "</div>")
  $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight+ 20);

  data = JSON.parse(evt.data);
  if(data['type'] == 0){
    pings[data['ping_id']].stop = new Date().getTime();
    computeLatency();
  }
};

ws.onerror = function(evt) {
  console.log(evt);
};

ws.onclose = function() {
  // websocket is closed.
  $("#chatbox").append("<div class='msgln'>"+ "Disconnected: " + getParameterByName('websocketServer') + "</div>")
  $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight+ 20);
};

var pings = [];
function ping(num) {
  pings[num] = {start:0, stop: 0};
  pings[num].start = new Date().getTime();
  data = {ping_id: num, type: 0};
  ws.send(JSON.stringify(data));
  setTimeout(function(){ ping(++num) }, 100);
}

function computeLatency(){
  var latencies = pings.map(function(data){
      return data.stop - data.start;
  });
  var min = latencies.reduce(function(a, b) { return Math.min(a,b); });
  var max = latencies.reduce(function(a, b) { return Math.max(a,b); });
  var sum = latencies.reduce(function(a, b) { return a + b; });
  var avg = sum / latencies.length;
  var currentLatency = latencies[latencies.length - 1];
  $("#ping").text(currentLatency);
  $("#avgPing").text(avg);
}
