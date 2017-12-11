/***********************
 INITIALIZE THE JOYSTICK
 **********************/
var setDirection = function() {};
var phi = 0;
var x_rotation = 0;
var y_rotation = 0;

var id = "02";
// TODO change debug here.
var debug = true;

var BIAS_X1 = 0
var BIAS_Y1 = 0
var BIAS_X2 = 0.1
var BIAS_Y2 = 0
var BIAS_X3 = 0.125
var BIAS_Y3 = 0
var BIAS_X4 = 0
var BIAS_Y4 = 0

var GAIN_X_WHEEL1 = (0.361454 + BIAS_X1)
var GAIN_Y_WHEEL1 = (0.272298 + BIAS_Y1)
var GAIN_W_WHEEL1 = 0.196848
//var GAIN_W_WHEEL1  0.196848 * 2

var GAIN_X_WHEEL2 = (-0.361454 + BIAS_X2)
var GAIN_Y_WHEEL2 = (0.419347 + BIAS_Y2)
var GAIN_W_WHEEL2 = 0.303152
//var GAIN_W_WHEEL2  0.303152 * 2

var GAIN_X_WHEEL3 = (-0.361454 + BIAS_X3)
var GAIN_Y_WHEEL3 = (-0.419347 + BIAS_Y3)
var GAIN_W_WHEEL3 = 0.303152
//var GAIN_W_WHEEL3  0.303152 * 2

var GAIN_X_WHEEL4 = (0.361454 + BIAS_X4)
var GAIN_Y_WHEEL4 = (-0.272298 + BIAS_Y4)
var GAIN_W_WHEEL4 = 0.196848

var initJoystick = function () {
  var dirCursor = document.getElementById("dirCenter");
  var container = document.getElementById("dirContainer");
  var joystickBoundLimit = document.getElementById("path3212");

  var joystick = new VirtualJoystick({
    mouseSupport: true,
    stationaryBase: true,
    baseX: $(dirCursor).position().left,
    baseY: $(dirCursor).position().top,
    limitStickTravel: true,
    stickRadius: 50,
    baseElement: dirCursor,
    container: container,
    strokeStyle: '#777f82'
  });

  var lastDirection = "none";
  setInterval(function(){
    /************
    JOYSTICK MODE
      ***********/
    /*
    if (joystick.left() || joystick.right() | joystick.up() || joystick.down()) {
        lastDirection = "dir";
        setDirection({x: parseInt(32767*joystick.deltaX()/50), y: parseInt(32767*joystick.deltaY()/50)});
    } else if (lastDirection != "none"){
        lastDirection = "none";
        setDirection({x: 0, y: 0});
    }
    */
    /************
     DIRECTIONAL PAD MODE
     ***********/
    if(joystick.isPressed()){
      setDirection({direction: "vector", x_translation: Math.round(joystick.deltaX() / 50 * 100) / 100 ,y_translation: -Math.round(joystick.deltaY() / 50 * 100) / 100 });
    // }
    // if(joystick.left()) {
    //     if (lastDirection != "left") {
    //         lastDirection = "left";
    //         setDirection({direction: "left"});
    //     }
    // } else if(joystick.right()) {
    //     if (lastDirection != "right") {
    //         lastDirection = "right";
    //         setDirection({direction: "right"});
    //     }
    // } else if(joystick.up()) {
    //     if (lastDirection != "up") {
    //         lastDirection = "up";
    //         setDirection({direction: "up"});
    //     }
    // } else if(joystick.down()) {
    //     if (lastDirection != "down") {
    //         lastDirection = "down";
    //         setDirection({direction: "down"});
    //     }
    } else if(phi > 15 || phi < -15) {
      setDirection({direction: "rotate", phi: phi});
    } else if (lastDirection != "none") {
      lastDirection = "none";
      setDirection({direction: "none"});
    } else {
      setDirection({direction: "vector", x_translation: 0, y_translation: 0})
    }
  }, 1/10 * 1000);
  
};

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

function generateID() {
  return id;
}

function omni_direction_vel_transform (x, y, w){
  var speed_wheel1;
  var speed_wheel2;
  var speed_wheel3;
  var speed_wheel4;

  var wheel1 = (GAIN_X_WHEEL1 * x) + (GAIN_Y_WHEEL1 * y) + (GAIN_W_WHEEL1 * w);
  var wheel2 = (GAIN_X_WHEEL2 * x) + (GAIN_Y_WHEEL2 * y) + (GAIN_W_WHEEL2 * w);
  var wheel3 = (GAIN_X_WHEEL3 * x) + (GAIN_Y_WHEEL3 * y) + (GAIN_W_WHEEL3 * w);
  var wheel4 = (GAIN_X_WHEEL4 * x) + (GAIN_Y_WHEEL4 * y) + (GAIN_W_WHEEL4 * w);
  
  wheel1 = wheel1 / 0.8306;  //mapping to max value(1)
  wheel2 = wheel2 / 0.8306;  
  wheel3 = wheel3 / 0.8306;
  wheel4 = wheel4 / 0.8306;

  if(wheel1 > 1.0)
    speed_wheel1 = 255;
  else if(wheel1 < -1.0)
    speed_wheel1 = 1;
  else
    speed_wheel1 = wheel1 * 127 + 128;

  if(wheel2 > 1.0)
    speed_wheel2 = 255;
  else if(wheel2 < -1.0)
    speed_wheel2 = 1;
  else
    speed_wheel2 = wheel2 * 127 + 128;

  if(wheel3 > 1.0)
    speed_wheel3 = 255;
  else if(wheel3 < -1.0)
    speed_wheel3 = 1;
  else
    speed_wheel3 = wheel3 * 127 + 128;

  if(wheel4 > 1.0)
    speed_wheel4 = 255;
  else if(wheel4 < -1.0)
    speed_wheel4 = 1;
  else
    speed_wheel4 = wheel4 * 127 + 128;
  
  return convert_3_digit(Math.floor(speed_wheel1)) + convert_3_digit(Math.floor(speed_wheel2)) + convert_3_digit(Math.floor(speed_wheel3)) + convert_3_digit(Math.floor(speed_wheel4));
}

function convert_3_digit(str) {
    return String("000" + str).slice(-3); 
}

/*************************
 INITIALIZE SLOT INDICATOR
 ************************/
var indicatorOn;
var slotNumber;
var initSlotIndicator = function () {
  indicatorOn = false;
  var slotAnimationLoop = function () {
    if (slotNumber != undefined) {
      $(".indicator").removeClass("indicatorInvaild");
      $("#indicator_"+(1)).addClass("indicatorSelected");
      setTimeout(slotAnimationLoop, 500);
    } else {
      $("#indicator_"+(1)).removeClass("indicatorSelected");
      if(indicatorOn) {
          $(".indicator").removeClass("indicatorInvaild");
      } else {
          $(".indicator").addClass("indicatorInvaild");
      }
      indicatorOn = !indicatorOn;
      setTimeout(slotAnimationLoop, 500);
    }
  }
  slotAnimationLoop();
}

/**********************
 HAPTIC CALLBACK METHOD
 *********************/
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
var hapticCallback = function () {
    if (navigator.vibrate) {
        navigator.vibrate(1);
    }
}

/****************
 MAIN ENTRY POINT
 ***************/
$( window ).load(function() {
  initJoystick();
  initSlotIndicator();
  // var socket = io();

  // var parser = document.createElement('a');
  // parser.href = window.location;
  // var ws = new WebSocket('ws://' + parser.hostname + ':8081');
  var server = getParameterByName('websocketServer')
  var ws = new WebSocket('ws://' + server);

  ws.onopen = function() {
      console.log("Connected!")
      slotNumber = 0;
      alert("Connected!");
  };
  
  ws.onclose = function() {
      slotNumber = undefined;
      alert("Disconnected!");
  };

  ws.onmessage = function (evt) {
    data = JSON.parse(evt.data);
    console.log(data);
  };

// socket.on("gamepadConnected", function(data) {
    // slotNumber = 0;
// });
  $(".btn").off("touchstart touchend");
  setDirection = function(){};

  // Just press the button
  // $(".btn").on("touchstart", function() {
  //     btnId = $(this).data("btn");
  //     $("#"+btnId).attr("class", "btnSelected");
  //     data = {id: generateID(), type: $(this).data("code"), value: 1};
  //     // socket.emit("padEvent", {type: 0x01, code: $(this).data("code"), value: 1});
  //     ws.send(JSON.stringify(data));
  //     hapticCallback();
  // });

  $(".btn").on("touchend", function() {
      btnId = $(this).data("btn");
      $("#"+btnId).attr("class", "");
      var code = $(this).data("code");
      if (debug){
          data = {id: generateID(), type: code, data: 49};
      }
      else {
          data = generateID() + code + 49;
      }
      // socket.emit("padEvent", {type: 0x01, code: $(this).data("code"), value: 0});

      // TODO: Implement kick and chip here!!
      if (code === 1) {
          // kick();
          // Do Something

      } else if (code === 2) {
          // chip();
          // Do Something
      }

      ws.send(JSON.stringify(data));
      hapticCallback();
  });

  // NOTE: Joy input here.
  setDirection = function(direction) {
    switch (direction.direction) {
      case "vector" :
        // data = {id: generateID(), type: 3, code: 0, x: direction.x , y: direction.y, phi: Math.round(phi * Math.PI / 180 * 100) /100, percent: 100, timestamp: generateTimestamp()}
        wheel_data = omni_direction_vel_transform(direction.x_translation, direction.y_translation, y_rotation);
        if (debug) {
            //data = {id: generateID(), type: 3, code: 0, x_translation: 0 , y_translation: 0, x_rotation: x_rotation, y_rotation: y_rotation, percent: 100};
            data = {id: generateID(), type: 3, data: wheel_data};
        } else {
            data = generateID() + 3 + wheel_data;
        }
        // socket.emit("padEvent", {type: 0x03, code: 0x00, x: direction.x , y: direction.y,phi: phi});
        // socket.emit("padEvent", {type: 0x03, code: 0x01, y: direction.y });
        ws.send(JSON.stringify(data));
        break;

      case "rotate" :
        wheel_data = omni_direction_vel_transform(direction.x_translation, direction.y_translation, y_rotation);
        if (debug) {
            //data = {id: generateID(), type: 3, code: 0, x_translation: 0 , y_translation: 0, x_rotation: x_rotation, y_rotation: y_rotation, percent: 100};
            data = {id: generateID(), type: 3, data: wheel_data};
        } else {
            data = generateID() + 3 + wheel_data;
        }
        ws.send(JSON.stringify(data));
        // // socket.emit("padEvent", {type: 0x03, code: 0x00, x: 0 , y: 0,phi: phi});
        // // socket.emit("padEvent", {type: 0x03, code: 0x01, y: direction.y });
        break;
      case "left" :
        // socket.emit("padEvent", {type: 0x03, code: 0x00, value: 0});
        // socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
        break;
      case "right" :
        // socket.emit("padEvent", {type: 0x03, code: 0x00, value: 255});
        // socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
        break;
      case "up" :
        // socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
        // socket.emit("padEvent", {type: 0x03, code: 0x01, value: 0});
        break;
      case "down" :
        // socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
        // socket.emit("padEvent", {type: 0x03, code: 0x01, value: 255});
        break;
      case "none" :
        // socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
        // socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
        break;
      default :
        // socket.emit("padEvent", {type: 0x03, code: 0x00, value: direction.x});
        // socket.emit("padEvent", {type: 0x03, code: 0x01, value: direction.y});
        if (debug) {
            //data = {id: generateID(), type: 3, code: 0, x_translation: 0 , y_translation: 0, x_rotation: x_rotation, y_rotation: y_rotation, percent: 100};
            data = {id: generateID(), type: 0};
        } else {
            data = generateID() + 0;
        }
        ws.send(JSON.stringify(data));
        break;
    }
  };
  setDirection({direction: "none"});

  gyro.startTracking(function(o) {
    // o.x, o.y, o.z for accelerometer
    // o.alpha, o.beta, o.gamma for gyro
    //    phi = Math.round(o.beta * 100) / 100;
    _phi = o.beta;
    if(_phi > - 20 && _phi < 20){
        _phi = 0;
    }
    phi = _phi * Math.PI / 180;
    x_rotation = Math.round(Math.cos(phi) * 10000) / 10000;
    y_rotation = Math.round(Math.sin(phi) * 10000) / 10000;
    //  console.log({1:o.alpha, 2:o.beta, 3:o.gamma});
  });

  // socket.on("connect", function() {
  //     socket.emit("connectGamepad", null);
  // });
  //
  // socket.on("disconnect", function() {
  //     location.reload();
  // });

} );
