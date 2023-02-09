import { Router } from "@vaadin/router";

const wrapper = document.querySelector(".wrapper") as HTMLElement;

const router = new Router(wrapper);
router.setRoutes([
  { path: "/", component: "signin-page" },
  { path: "/signin", component: "signin-page" },
  { path: "/chatroom", component: "chatroom-page" },
  { path: "(.*)", redirect: "/signin" },
]);
