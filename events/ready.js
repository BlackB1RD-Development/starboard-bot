module.exports = {
  name: 'ready',
  run: (client) => {
    client.user.setActivity('test');
    console.log('ready!');
  }
};