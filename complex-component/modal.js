class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this.shadowRoot.innerHTML = `
        <style>
        #backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            z-index: 10;
            opacity: 0;
            pointer-events: none;
        }

        :host([opened]) #backdrop,:host([opened]) #modal {
            opacity: 1;
            pointer-events: all;
        }

        :host([opened]) #modal {
        top: 50%;
        }

        ::slotted(h1) {
font-size: 1.25rem;
color: lightblue;  
margin: 0; 
        }


        header {
        padding: 1rem;
        border-bottom: 1px solid #ccc;
        }

        #main {
        padding: 1rem;
        }

        #modal {
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 3px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        padding: 1rem;
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 30vh;
        width: 40vw;
        max-width: 40rem;
        opacity: 0;
            pointer-events: none;
            transitions: all 0.3s ease-out;
        }

        #actions {
        border-top: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
        }


        #actions button {
        margin: 0 0.25rem;
        }

        </style>
        <div id="backdrop"></div>
        <div id="modal">
        <header>
            <slot name="title"></slot>
        </header>
        <section id="main">
            <slot></slot>
        </section>
        <section id="actions">
            <button id="cancel-btn">Cancel</button>
            <button id="confirm-btn">Confirm</button>
        </section>
        </div>
        `;

    //
    const slots = this.shadowRoot.querySelectorAll("slot");
    slots.forEach((slot) => {
      slot.addEventListener("slotchange", () => {
        console.dir(slot.assignedNodes());
      });
    });

    const backdrop = this.shadowRoot.getElementById("backdrop");
    backdrop.addEventListener("click", this._hide.bind(this));
    const cancelBtn = this.shadowRoot.getElementById("cancel-btn");
    const confirmBtn = this.shadowRoot.getElementById("confirm-btn");

    cancelBtn.addEventListener("click", this._cancel.bind(this));
    confirmBtn.addEventListener("click", this._confirm.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //! This is not the best way to handle this, but it works for demonstration purposes. A better way would be to use a class to toggle the visibility of the modal and backdrop, and then use CSS to handle the transitions.
    // if (name === "opened") {
    //   if (this.hasAttribute("opened")) {
    //     this.shadowRoot.getElementById("backdrop").style.opacity = "1";
    //     this.shadowRoot.getElementById("backdrop").style.pointerEvents = "all";
    //     this.shadowRoot.getElementById("modal").style.opacity = "1";
    //     this.shadowRoot.getElementById("modal").style.pointerEvents = "all";
    //   } else {
    //     this.shadowRoot.getElementById("backdrop").style.opacity = "0";
    //     this.shadowRoot.getElementById("backdrop").style.pointerEvents = "none";
    //     this.shadowRoot.getElementById("modal").style.opacity = "0";
    //     this.shadowRoot.getElementById("modal").style.pointerEvents = "none";
    //   }
    // }

    if (this.hasAttribute("opened")) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  static get observedAttributes() {
    return ["opened"];
  }

  open() {
    this.setAttribute("opened", "");
    this.isOpen = true;
  }

  _hide() {
    this.removeAttribute("opened");
    this.isOpen = false;
  }

  _cancel(event) {
    this._hide();
    const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
    event.target.dispatchEvent(cancelEvent);
  }

  _confirm() {
    this._hide();
    const confirmEvent = new Event("confirm");
    this.dispatchEvent(confirmEvent);
  }
}

customElements.define("uc-modal", Modal);
