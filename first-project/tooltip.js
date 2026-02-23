class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipContainer;
    this._tooltipText = this.getAttribute("text") || "Default tooltip text";
    this.attachShadow({ mode: "open" }); // We attach a shadow DOM to the custom element, which allows us to encapsulate the styles and structure of the tooltip, preventing them from affecting or being affected by the rest of the document.
    // const template = document.querySelector("#tooltip-template");
    // this.shadowRoot.appendChild(template.content.cloneNode(true)); // We clone the content of the template and append it to the shadow root, allowing us to use the structure defined in the template for our tooltip.
    this.shadowRoot.innerHTML = ` 
    <style>
      div {
        position: absolute;
        background-color: black;
        color: white;
        padding: 5px;
        border-radius: 5px;
        top: 20px;
        left: 0;
        z-index: 1000;
      }

      :host(.important){
      background: lightgray;
      }
        ::slotted(.highlight) {
          border-bottom: 1px dashed red;
        }
          .icon {
          background: black;
          color: white;
          padding: 0.15rem 0.5rem;
          text-align: center;
          border-radius: 50%;
          }
    </style>
    <slot>Default text </slot>
    <span> : </span>
    `;
  }

  //! With host you can style the custom element itself, if pass a class to the custom element, you can target it with :host(.className) selector.
  /*   :host(.important){
      background: lightgray;
      } */

  //!With ::slotted you can style the content that is passed to the custom element through the slot, you can target it with ::slotted(selector) selector.
  /*   ::slotted(.highlight) {
          border-bottom: 1px dashed red;
        } */

  connectedCallback() {
    const tooltipIcon = document.createElement("span");
    tooltipIcon.classList.add("icon");
    tooltipIcon.textContent = " (?)";
    tooltipIcon.addEventListener("mouseenter", this._showTooltip.bind(this)); //We use bind to ensure that the this keyword inside the _showTooltip method refers to the current instance of the Tooltip class, allowing us to access its properties and methods correctly.
    tooltipIcon.addEventListener("mouseleave", this._hideTooltip.bind(this));
    this.shadowRoot.appendChild(tooltipIcon);
    this.style.position = "relative"; // We set the position of the tooltip element to relative to ensure that the tooltip container is positioned correctly when it is displayed.
  }

  _showTooltip() {
    this._tooltipContainer = document.createElement("div");
    this._tooltipContainer.textContent = this._tooltipText;
    // this._tooltipContainer.style.position = "absolute";
    // this._tooltipContainer.style.backgroundColor = "black";
    // this._tooltipContainer.style.color = "white";
    // this._tooltipContainer.style.padding = "5px";
    // this._tooltipContainer.style.borderRadius = "5px";
    // this._tooltipContainer.style.top = "20px";
    // this._tooltipContainer.style.left = "0";
    // this._tooltipContainer.style.zIndex = "1000";
    this.shadowRoot.appendChild(this._tooltipContainer);
  }

  _hideTooltip() {
    if (this._tooltipContainer) {
      this.shadowRoot.removeChild(this._tooltipContainer);
    }
  }
}

customElements.define("my-tooltip", Tooltip); // !the name must contain a dash to avoid conflicts with built-in elements
