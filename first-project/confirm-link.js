class ConfirmLink extends HTMLAnchorElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", this._confirmClick.bind(this));
  }

  _confirmClick(event) {
    if (!confirm("Are you sure you want to navigate to this link?")) {
      event.preventDefault();
    }
  }
}

customElements.define("confirm-link", ConfirmLink, { extends: "a" }); // We define the custom element with the name "confirm-link" and specify that it extends the built-in "a" (anchor) element, allowing us to use it as a custom link element in our HTML.
