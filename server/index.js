"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const nanoid_1 = require("nanoid");
const express = require("express");
const process = require("process");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
const usersCollection = db_1.firestore.collection("users");
const roomsCollection = db_1.firestore.collection("rooms");
app.post("/auth", (req, res) => {
    const { email } = req.body;
    const { fullname } = req.body;
    usersCollection
        .where("email", "==", email)
        .get()
        .then((searchResponse) => {
        if (searchResponse.empty) {
            const fullUserId = (0, nanoid_1.nanoid)();
            const userId = fullUserId.slice(16);
            usersCollection
                .doc(userId.toString())
                .set({ email: email, fullname: fullname, userId: fullUserId })
                .then(() => {
                res.json({ id: userId.toString() });
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id,
            });
        }
    });
});
app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    usersCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
        if (doc.exists) {
            const roomRef = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef
                .set({
                messages: [],
                owner: userId,
            })
                .then(() => {
                const fullRoomId = roomRef.key;
                const roomId = fullRoomId.slice(16);
                roomsCollection
                    .doc(roomId.toString())
                    .set({ rtdbRoomId: fullRoomId })
                    .then(() => {
                    res.json({
                        id: roomId.toString(),
                        fullId: fullRoomId.toString(),
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "doesn't exist",
            });
        }
    });
});
app.get("/rooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    usersCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
        if (doc.exists) {
            roomsCollection
                .doc(roomId)
                .get()
                .then((snap) => {
                const data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                message: "doesn't exist",
            });
        }
    });
});
app.get("/room/:roomId", async (req, res) => {
    const { roomId } = req.params;
    const roomDoc = await roomsCollection.doc(roomId.toString()).get();
    if (!roomDoc.exists) {
        res.status(404).json({ error: "Room not found" });
    }
    else {
        const roomData = roomDoc.data();
        res.status(200).json({ rtdbRoomId: roomData?.rtdbRoomId });
    }
});
app.post("/messages", (req, res) => {
    const { rtdbRoomId } = req.body;
    const { message } = req.body;
    const { from } = req.body;
    const roomMessagesRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/messages`);
    roomMessagesRef
        .push({ message: message, from: from })
        .then((r) => res.json(r));
});
app.delete("/deleteroom", (req, res) => {
    const { roomId } = req.body;
    roomsCollection
        .doc(roomId.toString())
        .delete()
        .then(() => {
        res.json("Document successfully deleted!");
    })
        .catch((error) => {
        res.json("Error removing document");
    });
});
app.delete("/deleteuser", (req, res) => {
    const { userId } = req.body;
    usersCollection
        .doc(userId.toString())
        .delete()
        .then(() => {
        res.json("Document successfully deleted!");
    })
        .catch((error) => {
        res.json("Error removing document");
    });
});
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});
app.listen(PORT, () => {
    console.log(`iniciado en http://localhost:${PORT}`);
});
