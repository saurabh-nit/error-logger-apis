let socket_constants = require("./socketEvents");
let SocketActions  = require("./socketActions");


let socket = {
  action(socketMethod){
    return function socketHandler(...data) {
      return socketMethod(...data);
    }
  }
};

module.exports = {
  ActionsToBind : [
    {name: socket_constants.CONNECT, action: socket.action(SocketActions.onConnection)},
    // {name: socket_constants.DISCONNECT, action: socket.action(SocketActions.onDisconnect)}
    {name: socket_constants.LOG_ERROR, action: socket.action(SocketActions.onlogError)}
  ]
};