module.exports = {

  onlogError: async (clientSocket, data, callback) => {
    // console.log('SAVE ERROR onlogError', clientSocket)
    console.log('SAVE ERROR onlogError', data);
    console.log('SAVE ERROR onlogError', callback);
    clientSocket.emit('dataFromServer', Math.random())
  },

  onConnection: async (clientSocket) => {
    console.log('Connected Client Socket Id:', clientSocket['id']);
  },

  onDisconnect: async (clientSocket) => {
  clientSocket.disconnect(true);
  console.log('A Client Disconnected');
 }
};