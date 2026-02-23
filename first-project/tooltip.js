class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipContainer;
    this._tooltipIcon;
    this._tooltipVisible = false;
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

      :host-context(p){
      font-weight: bold;
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

  //!With host-context you can style the custom element based on its context, if the custom element is inside a specific element, you can target it with :host-context(selector) selector.
  /*    :host-context(p){
      font-weight: bold;
      }
 */

  /* The connectedCallback lifecycle method runs automatically 
when the custom element is added to the DOM.
We use it to initialize the component, create dynamic elements,
attach event listeners, and configure initial styles. */

  connectedCallback() {
    this._tooltipIcon = document.createElement("span");
    this._tooltipIcon.classList.add("icon");
    this._tooltipIcon.textContent = " (?)";
    this._tooltipIcon.addEventListener(
      "mouseenter",
      this._showTooltip.bind(this),
    ); //We use bind to ensure that the this keyword inside the _showTooltip method refers to the current instance of the Tooltip class, allowing us to access its properties and methods correctly.
    this._tooltipIcon.addEventListener(
      "mouseleave",
      this._hideTooltip.bind(this),
    );
    this.shadowRoot.appendChild(this._tooltipIcon);
    this.style.position = "relative"; // We set the position of the tooltip element to relative to ensure that the tooltip container is positioned correctly when it is displayed.
  }

  // The attributeChangedCallback lifecycle method is triggered
  // whenever one of the observed attributes changes.
  // It allows us to react to attribute updates and update
  // the component’s behavior or UI accordingly.

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("name", name, "oldvalue", oldValue, "newValue", newValue);
    if (oldValue === newValue) return;
    if (name === "text") {
      this._tooltipText = newValue;
    }
  }
  // The observedAttributes static getter defines which attributes we want to observe for changes. Whenever any of these attributes change, the attributeChangedCallback method will be called with the name of the attribute, its old value, and its new value.
  static get observedAttributes() {
    return ["text"];
  }

  //! The disconnectedCallback lifecycle method is called when the custom element is removed from the DOM. We can use it to clean up any resources, such as event listeners or timers, to prevent memory leaks and ensure that the component behaves correctly when it is removed from the page.
  disconnectedCallback() {
    console.log("Tooltip removed from the DOM");
    this.tooltipIcon.removeEventListener("mouseenter", this._showTooltip);
    this.tooltipIcon.removeEventListener("mouseleave", this._hideTooltip);
  }

  _render() {
    if (this._tooltipVisible) {
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
    } else {
      if (this._tooltipContainer) {
        this.shadowRoot.removeChild(this._tooltipContainer);
      }
    }
  }

  _showTooltip() {
    this._tooltipVisible = true;
    this._render();
  }

  _hideTooltip() {
    this._tooltipVisible = false;
    this._render();
  }
}

customElements.define("my-tooltip", Tooltip); // !the name must contain a dash to avoid conflicts with built-in elements
