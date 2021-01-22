const { io }= require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('The Beatles'));
bands.addBand(new Band('Queen'));
bands.addBand(new Band('The Rolling Stones'));
bands.addBand(new Band('Pink Floyd'));


// Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  client.emit('active-bands', bands.getBands());

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  client.on("mensaje", (payload) => {
    console.log("mensaje!!!", payload);

    io.emit("mensaje", {
      admin: "Nuevo mensaje",
    });
  });

  client.on('emitir-mensaje', (payload) => {
    // io.emit('nuevo-mensaje', payload); // mandar a todos
    console.log(payload);
    client.broadcast.emit('emitir-mensaje', payload); // mandar a todos menos al que lo emitió
  });

  client.on('vote-band', (payload) => {
    console.log(payload);
    // function to vote for the band
    bands.voteBand(payload.id);
    // let everyone know that the array of bands has changed (even the client that sent the message)
    io.emit('active-bands', bands.getBands());
  })

  client.on('add-band', (payload) => {
    const name = payload.name
    console.log(name);
    // function to add band
    const newBand = new Band(name)
    bands.addBand(newBand);
    // let everyone know that the array of bands has changed (even the client that sent the message)
    io.emit('active-bands', bands.getBands());
  })

  client.on('delete-band', (payload) => {
    console.log(payload);
    // function to delete one band
    bands.deleteBand(payload.id)
    // let everyone know that the array of bands has changed (even the client that sent the message)
    io.emit('active-bands', bands.getBands());
  })
});
