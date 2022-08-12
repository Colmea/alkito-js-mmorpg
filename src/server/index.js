const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const CONFIG = require("../gameConfig.json");
const worldData = require("../../public/assets/map/world.json");
const resourcesData = require("../data/resources.json");
const PORT = process.env.PORT || 3000;
const MAX_CHAT_HISTORY = 100;
const RESOURCE_MAX_LEVEL = 4;

const avatars = [
  "https://react.semantic-ui.com/images/avatar/small/tom.jpg",
  "https://react.semantic-ui.com/images/avatar/small/matt.jpg",
  "https://react.semantic-ui.com/images/avatar/small/matthew.png",
  "https://react.semantic-ui.com/images/avatar/small/rachel.png",
  "https://react.semantic-ui.com/images/avatar/small/lindsay.png",
  "https://react.semantic-ui.com/images/avatar/small/jenny.jpg",
  "https://react.semantic-ui.com/images/avatar/small/veronika.jpg",
];

// Game state
const state = {
  players: {},
  chatMessages: [],
  resources: worldData.layers[4].objects.reduce(
    (resources, resourceData) => ({
      ...resources,
      [resourceData.id]: {
        ...resourceData,
        level: 1,
        lastTimeGrown: Date.now(),
        x: resourceData.x + (resourceData.width || CONFIG.TILE_SIZE) / 2,
        y: resourceData.y - CONFIG.TILE_SIZE,
      },
    }),
    {}
  ),
};

console.log("Alkito Server - Starting...");
console.log("Resources populated: ", state.resources.length);

server.listen(PORT, () => {
  console.log(`Alkito Server - Ready (port ${PORT})`);
});

const distPath = path.join(__dirname, "../../dist");

app.use(express.static(distPath));

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on("connection", function (socket) {
  const newPlayer = {
    id: socket.id,
    name: "Player #" + Math.floor(Math.random() * 1000),
    avatar: avatars[Math.floor(Math.random() * 7)],
    x: CONFIG.PLAYER_SPAWN_POINT.x,
    y: CONFIG.PLAYER_SPAWN_POINT.y,
  };

  state.players[socket.id] = newPlayer;

  console.log("User connected: ", newPlayer.name, newPlayer.id);

  // Emit player newly created and current game state
  socket.emit("playerCreated", state.players[socket.id]);
  socket.emit("currentPlayers", state.players);
  socket.emit("currentResources", state.resources);

  // Send chat history after 1 second
  setTimeout(() => {
    const welcomeMessage = {
      author: "Alkito",
      message:
        "Welcome to Alkito ! A web based MMORPG in Javascript and Node.js",
      creationDate: new Date(),
    };

    socket.emit("chat.newMessage", [...state.chatMessages, welcomeMessage]);
  }, 1000);
  // Broadcast the new player to other players
  socket.broadcast.emit("newPlayer", state.players[socket.id]);

  socket.on("playerMove", (x, y) => {
    state.players[socket.id].x = x;
    state.players[socket.id].y = y;

    socket.broadcast.emit("playerMoved", state.players[socket.id]);
  });

  socket.on("resource.collect", (id) => {
    console.log("Resource", id, "collected");
    const newResource = {
      ...state.resources[id],
      level: 1,
      lastTimeGrown: Date.now(),
    };

    state.resources[id] = newResource;

    io.emit("resource.grown", newResource.id, newResource.level);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("playerDisconnected", state.players[socket.id]);

    delete state.players[socket.id];
  });

  socket.on("chat.sendNewMessage", (newMessage) => {
    console.log(`> [${newMessage.author}] ${newMessage.message}`);
    io.emit("chat.newMessage", [newMessage]);

    state.chatMessages.push(newMessage);

    // Keep only MAX_CHAT_HISTORY messages
    if (state.chatMessages.length > MAX_CHAT_HISTORY) {
      const indexToCut = state.chatMessages.length - MAX_CHAT_HISTORY;
      state.chatMessages = state.chatMessages.slice(indexToCut);
    }
  });
});

// Resources lifecycle
setInterval(() => {
  const now = Date.now();

  Object.values(state.resources).forEach((resource) => {
    const resourceRef = resourcesData[resource.type];

    if (!resourceRef || resource.level >= RESOURCE_MAX_LEVEL) return;

    if (
      now - resource.lastTimeGrown >=
      resourcesData[resource.type].timeToGrowLevel
    ) {
      const newResource = {
        ...resource,
        level: resource.level + 1,
        lastTimeGrown: now,
      };

      state.resources[resource.id] = newResource;

      io.emit("resource.grown", newResource.id, newResource.level);
    }
  });
}, 1000);
