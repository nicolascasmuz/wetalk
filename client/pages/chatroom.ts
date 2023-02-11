import { state } from "../state";

customElements.define(
  "chatroom-page",
  class extends HTMLElement {
    roomidText: string;
    messages: [] = [];

    connectedCallback() {
      state.subscribe(() => {
        const currentState = state.getState();
        this.roomidText = currentState.roomId;
        this.messages = currentState.messages;
        this.render();
        this.addListeners();
      });

      state.signIn(() => {
        state.askNewRoom(() => {
          state.listenToRoom();
        });
      });

      this.render();
      this.addListeners();
    }
    render() {
      const currentState = state.getState();

      this.innerHTML = `
        <header class="red-header"></header>
        <div class="chatroom-container">
          <h1 class="chatroom-title">Chat</h1>
          <h2 class="chatroom-roomid">Room id: ${
            this.roomidText ? this.roomidText : "cargando..."
          }</h1>
          <div class="chatroom-div">
            <section class="chat-box__section">
                ${this.messages
                  .map((m: any) => {
                    if (m.from == currentState.fullname) {
                      return `<div class="user1__message-box"><p class="user1__message-text"><span class="user1__message-span">${m.from}</span>${m.message}</p></div>`;
                    } else {
                      return `<div class="user2__message-box"><p class="user2__message-text"><span class="user2__message-span">${m.from}</span>${m.message}</p></div>`;
                    }
                  })
                  .join("")}
            </section>
            <form class="chatroom-form__form">
              <input class="chatroom-form__input" type="text" name="new-message">
              <button class="chatroom-form__button">Enviar</button>
            </form>
          </div>
        </div>
        `;

      const style = document.createElement("style");
      style.innerHTML = `
            .red-header {
            background-color: #FF8282;
            height: 60px;
            }
            .chatroom-container {
            display: grid;
            justify-content: center;
            margin: 25px 0;
            }
            .chatroom-title {
            font-family: 'Roboto', cursive;
            font-size: 52px;
            font-weight: 700;
            margin: 0;
            }
            .chatroom-roomid {
            font-family: 'Roboto', cursive;
            font-size: 28px;
            font-weight: 500;
            margin: 0 0 25px 0;
            }
            .chatroom-div {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            }
            .chat-box__section {
            display: flex;
            flex-direction: column;
            gap: 6px;
            font-family: 'Roboto';
            width: 312px;
            min-height: 312px;
            max-height: 312px;
            border: solid 4px #9CBBE9;
            border-radius: 4px;
            overflow: auto;
            padding: 10px 6px 10px 6px;
            }
            .user1__message-box {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            align-self: flex-end;
            width: fit-content;
            max-width: 250px;
            height: fit-content;
            background-color: #78e08f;
            border-radius: 4px;
            padding: 6px 6px 6px 6px;
            }
            .user1__message-text {
            text-align: right;
            margin: 0;
            }
            .user1__message-span {
            display: block;
            font-size: 12px;
            font-weight: 600;
            text-align: right;
            }
            .user2__message-box {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            align-self: flex-start;
            width: fit-content;
            max-width: 250px;
            height: fit-content;
            background-color: #CAD3C8;
            border-radius: 4px;
            padding: 6px 6px 6px 6px;
            }
            .user2__message-text {
            text-align: left;
            margin: 0;
            }
            .user2__message-span {
            display: block;
            font-size: 12px;
            font-weight: 600;
            text-align: left;
            }
            .chatroom-form__form {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            }
            .chatroom-form__input {
            min-width: 312px;
            min-height: 55px;
            border: solid 2px #8c8c8c;
            border-radius: 4px;
            font-family: 'Roboto';
            font-size: 25px;
            }
            .chatroom-form__button {
            background-color: #9CBBE9;
            border: none;
            border-radius: 4px;
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 22px;
            min-width: 312px;
            min-height: 55px;
            }
              `;

      this.appendChild(style);
    }
    addListeners() {
      const boxSectionEl = this.querySelector(
        ".chat-box__section"
      ) as HTMLElement;
      boxSectionEl.scrollTop = boxSectionEl.scrollHeight;

      const formEl = this.querySelector(".chatroom-form__form") as HTMLElement;

      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const message = e.target["new-message"].value;
        if (message == "") {
          null;
        } else {
          state.pushMessage(message);
        }
      });
    }
  }
);
