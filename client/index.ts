import "./components/header";

import "./pages/signin";
import "./pages/chatroom";

import "../server/router";

import { state } from "./state";

(function () {
  state.init();
})();
