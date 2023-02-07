customElements.define(
  "header-comp",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      const header = document.createElement("header");
      header.classList.add("header");

      const style = document.createElement("style");
      style.innerHTML = `
      .header {
        background-color: #FF8282;
        width: 100%;
        height: 60px;
        }
      `;

      this.shadow.appendChild(header);
      this.shadow.appendChild(style);
    }
  }
);
