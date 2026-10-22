import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { generate } from "random-words";
import { paragraph_Generator } from "./controllers/wordControllers.js";

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Typing Game Backend Running");
});

app.get("/paragraph", paragraph_Generator);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Distinct player colors for real-time cursors
const PLAYER_COLORS = [
  "#38bdf8", // Sky Cyan
  "#a855f7", // Neon Violet
  "#fbbf24", // Electric Amber
  "#f43f5e", // Hot Coral
  "#34d399"  // Emerald
];

// In-memory rooms store
const rooms = new Map();

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getRoomData(room) {
  return {
    id: room.id,
    hostId: room.hostId,
    status: room.status,
    paragraph: room.paragraph,
    startTime: room.startTime,
    players: Array.from(room.players.values())
  };
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // 1. Create Room
  socket.on("create_room", ({ playerName }, callback) => {
    let roomId = generateRoomCode();
    while (rooms.has(roomId)) {
      roomId = generateRoomCode();
    }

    const hostPlayer = {
      id: socket.id,
      name: playerName || "Host",
      color: PLAYER_COLORS[0],
      cursorIndex: 0,
      wpm: 0,
      accuracy: 100,
      isHost: true,
      hasFinished: false,
      finishRank: null,
      finishTime: null
    };

    const newRoom = {
      id: roomId,
      hostId: socket.id,
      status: "lobby", // "lobby" | "countdown" | "racing" | "finished"
      paragraph: "",
      startTime: null,
      countdown: 3,
      players: new Map([[socket.id, hostPlayer]])
    };

    rooms.set(roomId, newRoom);
    socket.join(roomId);

    if (callback) {
      callback({ success: true, room: getRoomData(newRoom), playerId: socket.id });
    }
  });

  // 2. Join Room
  socket.on("join_room", ({ roomId, playerName }, callback) => {
    const cleanRoomId = roomId ? roomId.trim().toUpperCase() : "";
    const room = rooms.get(cleanRoomId);

    if (!room) {
      if (callback) callback({ success: false, message: "Room not found" });
      return;
    }

    if (room.players.size >= 5) {
      if (callback) callback({ success: false, message: "Room is full (max 5 players)" });
      return;
    }

    if (room.status !== "lobby") {
      if (callback) callback({ success: false, message: "Race already in progress" });
      return;
    }

    // Pick an unused color from the palette
    const usedColors = new Set(Array.from(room.players.values()).map(p => p.color));
    const availableColor = PLAYER_COLORS.find(c => !usedColors.has(c)) || PLAYER_COLORS[room.players.size % PLAYER_COLORS.length];

    const newPlayer = {
      id: socket.id,
      name: playerName || `Racer ${room.players.size + 1}`,
      color: availableColor,
      cursorIndex: 0,
      wpm: 0,
      accuracy: 100,
      isHost: false,
      hasFinished: false,
      finishRank: null,
      finishTime: null
    };

    room.players.set(socket.id, newPlayer);
    socket.join(cleanRoomId);

    if (callback) {
      callback({ success: true, room: getRoomData(room), playerId: socket.id });
    }

    io.to(cleanRoomId).emit("room_updated", getRoomData(room));
  });

  // 3. Start Race (Host only)
  socket.on("start_race", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.hostId !== socket.id) return;

    // Generate shared words for all competitors
    const randomWords = generate({ min: 30, max: 40 });
    room.paragraph = randomWords.join(" ");
    room.status = "countdown";
    room.countdown = 3;

    // Reset player race stats
    room.players.forEach((player) => {
      player.cursorIndex = 0;
      player.wpm = 0;
      player.accuracy = 100;
      player.hasFinished = false;
      player.finishRank = null;
      player.finishTime = null;
    });

    io.to(roomId).emit("countdown_started", {
      countdown: room.countdown,
      paragraph: room.paragraph
    });

    // 3.. 2.. 1.. GO!
    const countdownInterval = setInterval(() => {
      room.countdown -= 1;

      if (room.countdown > 0) {
        io.to(roomId).emit("countdown_tick", { countdown: room.countdown });
      } else {
        clearInterval(countdownInterval);
        room.status = "racing";
        room.startTime = Date.now();

        io.to(roomId).emit("race_started", {
          startTime: room.startTime,
          paragraph: room.paragraph,
          room: getRoomData(room)
        });
      }
    }, 1000);
  });

  // 4. Update Typing Progress (Transmits cursor position & live WPM)
  socket.on("update_progress", ({ roomId, cursorIndex, wpm, accuracy }) => {
    const room = rooms.get(roomId);
    if (!room || room.status !== "racing") return;

    const player = room.players.get(socket.id);
    if (!player || player.hasFinished) return;

    player.cursorIndex = cursorIndex;
    player.wpm = wpm;
    if (accuracy !== undefined) player.accuracy = accuracy;

    // Broadcast cursor position to opponents in the same room
    socket.to(roomId).emit("competitor_progress", {
      playerId: socket.id,
      cursorIndex,
      wpm,
      accuracy
    });

    // Check if player completed the paragraph
    if (cursorIndex >= room.paragraph.length && !player.hasFinished) {
      player.hasFinished = true;
      player.finishTime = Date.now();

      // Determine rank (1st, 2nd, etc.)
      const finishedCount = Array.from(room.players.values()).filter(p => p.hasFinished).length;
      player.finishRank = finishedCount;

      io.to(roomId).emit("player_finished", {
        playerId: socket.id,
        rank: player.finishRank,
        wpm: player.wpm,
        time: Math.max(1, Math.round((player.finishTime - room.startTime) / 1000))
      });

      // If all players in room are done, conclude the match
      const allDone = Array.from(room.players.values()).every(p => p.hasFinished);
      if (allDone) {
        room.status = "finished";
        io.to(roomId).emit("race_finished", getRoomData(room));
      }
    }
  });

  // 5. Play Again / Restart Room (Host only)
  socket.on("restart_race", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.hostId !== socket.id) return;

    room.status = "lobby";
    room.paragraph = "";
    room.startTime = null;
    room.players.forEach((p) => {
      p.cursorIndex = 0;
      p.wpm = 0;
      p.hasFinished = false;
      p.finishRank = null;
      p.finishTime = null;
    });

    io.to(roomId).emit("room_updated", getRoomData(room));
  });

  // 6. Leave Room / Disconnect
  const handleLeave = () => {
    rooms.forEach((room, roomId) => {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);

        if (room.players.size === 0) {
          rooms.delete(roomId);
        } else {
          // If the host disconnected, pass host role to the next player
          if (room.hostId === socket.id) {
            const nextHost = room.players.keys().next().value;
            room.hostId = nextHost;
            room.players.get(nextHost).isHost = true;
          }
          io.to(roomId).emit("room_updated", getRoomData(room));
        }
      }
    });
  };

  socket.on("leave_room", handleLeave);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    handleLeave();
  });
});

server.listen(port, () => {
  console.log(`Server & Socket.IO running on port ${port}`);
});
