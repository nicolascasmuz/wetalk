const API_BASE_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import { map } from "lodash";

type msg = {
  from: string;
  message: string;
};

const state = {
  data: {
    email: "",
    fullname: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    existingRoom: false,
    messages: [],
  },
  listeners: [],
  init() {
    const emptyData = {
      email: "",
      fullname: "",
      userId: "",
      roomId: "",
      rtdbRoomId: "",
      existingRoom: "",
      messages: [],
    };

    const lastStorageState: any = localStorage.getItem("state");
    if (!lastStorageState) {
      return;
    } else if (location.pathname == "/chatroom") {
      this.setState(JSON.parse(lastStorageState));
    } else if (location.pathname == "/signin" || location.pathname == "/") {
      this.setState(emptyData);
    }
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }

    // save msgs in state
    const chatroomsRef = rtdb.ref("/rooms/" + newState.rtdbRoomId);
    chatroomsRef.on("value", (snapshot) => {
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);

      const msgArray: msg[] = [];

      for (const i of messagesList) {
        msgArray.push(i);
      }
      newState.messages = msgArray;
    });

    localStorage.setItem("state", JSON.stringify(newState));
    console.log("Soy el state, he cambiado: ", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setEmailAndFullname(email: string, fullname: string) {
    const cs = this.getState();

    cs.email = email;
    cs.fullname = fullname;

    this.setState(cs);
  },
  signIn(callback) {
    const cs = this.getState();

    if (cs.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: cs.email, fullname: cs.fullname }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay un email en el state");
      callback(true);
    }
  },
  /* setExistingRoomProp(roomIdFromInput) {
    const cs = this.getState();

    fetch(API_BASE_URL + "/room/" + roomIdFromInput).then((r) => {
      const contentLength = Number(r.headers.get("content-length"));
      if (contentLength != 0) {
        cs.roomId = roomIdFromInput;
        cs.existingRoom = true;
      } else {
        cs.existingRoom = false;
      }
      this.setState(cs);
    });
  }, */
  askNewRoom(callback?) {
    const cs = this.getState();

    if (cs.userId && cs.existingRoom == false && !cs.roomId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          cs.rtdbRoomId = data.fullId;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else if (
      (cs.userId && cs.existingRoom == true) ||
      (cs.userId && cs.existingRoom == false)
    ) {
      fetch(API_BASE_URL + "/rooms/" + cs.roomId + "?userId=" + cs.userId)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.rtdbRoomId = data.rtdbRoomId;
          this.setState(cs);
          this.listenToRoom();
        });
    } else {
      console.error("No hay userId");
    }
  },
  listenToRoom() {
    const cs = this.getState();

    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    chatroomsRef.on("value", (snapshot) => {
      const currentState = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);

      const msgArray: msg[] = [];

      for (const i of messagesList) {
        msgArray.push(i);
      }
      currentState.messages = msgArray;

      this.setState(currentState);
    });
  },
  pushMessage(message: string) {
    const currentState = this.getState();
    const ownerName = currentState.fullname;

    fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: currentState.rtdbRoomId,
        owner: ownerName,
        message: message,
        from: currentState.fullname,
      }),
    }).then((msg) => {
      console.log("msg: ", msg);
    });

    this.setState(currentState);
  },
};

export { state };
