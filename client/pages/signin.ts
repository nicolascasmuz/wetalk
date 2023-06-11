import { api } from "../state";
import { state } from "../state";
import { Router } from "@vaadin/router";

customElements.define(
  "signin-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();

      const cs = state.getState();

      // DISPLAY DEL ROOM EXISTENTE
      const selectEl = this.querySelector(
        ".signin-form__select-room"
      ) as HTMLSelectElement;
      const roomExistenteEl = this.querySelector(
        ".signin-form__room-id"
      ) as HTMLElement;

      selectEl.addEventListener("change", () => {
        if (selectEl.value == "new-room") {
          roomExistenteEl.style.display = "none";
        } else {
          roomExistenteEl.style.display = "flex";
        }
      });

      // LISTENER DEL FORM
      const formEl = this.querySelector(".signin-form__form") as HTMLElement;
      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();

        // ELEMENTOS PARA COLOREAR EL BORDE DE ROJO
        // Y RUTEAR LA PÁGINA
        const inputEmailEl = this.querySelector(
          ".signin-form__input-email"
        ) as HTMLElement;
        const inputNameEl = this.querySelector(
          ".signin-form__input-nombre"
        ) as HTMLElement;
        const existingRoomInput = this.querySelector(
          ".signin-form__input-roomid"
        ) as HTMLElement;

        // SETEA EL USER
        const userEmail = e.target["email"].value;
        const userName = e.target["name"].value;

        state.setEmailAndFullname(userEmail, userName);

        // SETEA EL ROOMID
        const selectEl = e.target["room-select"].value;
        const inputRoomidVal = e.target["roomid"].value;

        if (selectEl == "existing-room") {
          state.setExistingRoomProp(inputRoomidVal).then((res) => {
            if (res.statusText == "OK") {
              Router.go("/chatroom");
            } else {
              existingRoomInput.style.border = "solid 2px red";
            }
          });
        }

        if (userEmail == "" && userName == "") {
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px red";
        } else if (userEmail == "" && userName != "") {
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px #8c8c8c";
        } else if (userEmail != "" && userName == "") {
          inputEmailEl.style.border = "solid 2px #8c8c8c";
          inputNameEl.style.border = "solid 2px red";
        } else if (
          selectEl == "existing-room" &&
          inputRoomidVal.length != 5 &&
          userEmail == "" &&
          userName == ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px red";
        } else if (
          selectEl == "existing-room" &&
          inputRoomidVal.length != 5 &&
          userEmail != "" &&
          userName == ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px #8c8c8c";
          inputNameEl.style.border = "solid 2px red";
        } else if (
          selectEl == "existing-room" &&
          inputRoomidVal.length != 5 &&
          userEmail == "" &&
          userName != ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px #8c8c8c";
        } else if (
          selectEl == "existing-room" &&
          inputRoomidVal.length != 5 &&
          userEmail != "" &&
          userName != ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px #8c8c8c";
          inputNameEl.style.border = "solid 2px #8c8c8c";
        } else if (selectEl == "new-room") {
          Router.go("/chatroom");
        }
      });
    }
    render() {
      this.innerHTML = `
            <header class="red-header"></header>
            <div class="signin-container">
              <h1 class="signin-title">Bienvenido</h1>
              <form class="signin-form__form">
                <label class="signin-form__email">Email
                  <input class="signin-form__input-email" type="text" name="email">
                </label>
                <label class="signin-form__nombre">Tu nombre
                  <input class="signin-form__input-nombre" type="text" name="name">
                </label>
                <label class="signin-form__room">Room
                  <select class="signin-form__select-room" name="room-select">
                    <option value="new-room">Nuevo room</option>
                    <option value="existing-room">Room existente</option>
                  </select>
                </label>
                <label class="signin-form__room-id">Room id
                  <input class="signin-form__input-roomid" type="text" name="roomid" placeholder="ej: AxATR1">
                </label>
                <button class="signin-form__button">Comenzar</button>
              </form>
            </div>
          `;

      const style = document.createElement("style");
      style.innerHTML = `
            .red-header {
            background-color: #FF8282;
            width: 100%;
            height: 60px;
            }
            .signin-container {
            display: grid;
            justify-content: center;
            margin: 25px 0;
            }
            .signin-title {
            font-family: 'Roboto', cursive;
            font-size: 52px;
            font-weight: 700;
            margin: 0 0 25px 0;
            }
            .signin-form__form {
            display: flex;
            flex-direction: column;
            align-items: center;
            }
            .signin-form__email {
            display: flex;
            flex-direction: column;
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 24px;
            font-weight: 500;
            color: #000000;
            margin: 0 0 13px 0;
            }
            .signin-form__nombre {
            display: flex;
            flex-direction: column;
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 24px;
            font-weight: 500;
            color: #000000;
            margin: 0 0 13px 0;
            }
            .signin-form__room {
            display: flex;
            flex-direction: column;
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 24px;
            font-weight: 500;
            color: #000000;
            margin: 0 0 13px 0;
            }
            .signin-form__room-id {
            display: none;
            flex-direction: column;
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 24px;
            font-weight: 500;
            color: #000000;
            margin: 0;
            }
            .signin-form__input-email {
            background-color: #FFFFFF;
            border: solid 2px #8c8c8c;
            border-radius: 4px;
            min-width: 312px;
            min-height: 55px;
            border: solid 2px #000000
            border-radius: 4px;
            font-family: 'Roboto';
            font-size: 25px;
            }
            .signin-form__input-nombre {
            background-color: #FFFFFF;
            border: solid 2px #8c8c8c;
            border-radius: 4px;
            min-width: 312px;
            min-height: 55px;
            border: solid 2px #000000
            border-radius: 4px;
            font-family: 'Roboto';
            font-size: 25px;
            }
            .signin-form__select-room {
            background-color: #FFFFFF;
            border: solid 2px #8c8c8c;
            border-radius: 4px;
            min-width: 312px;
            min-height: 55px;
            border: solid 2px #000000
            border-radius: 4px;
            font-family: 'Roboto';
            font-size: 25px;
            }
            .signin-form__input-roomid {
            background-color: #FFFFFF;
            border: solid 2px #8c8c8c;
            border-radius: 4px;
            min-width: 312px;
            min-height: 55px;
            border: solid 2px #000000
            border-radius: 4px;
            font-family: 'Roboto';
            font-size: 25px;
            }
            .signin-form__button {
            background-color: #9CBBE9;
            border: none;
            border-radius: 4px;
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 22px;
            min-width: 312px;
            min-height: 55px;
            margin: 25px 0 0 0;
            }
            `;

      this.appendChild(style);
    }
  }
);
