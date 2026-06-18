class MagicCard extends HTMLElement {
  static get observedAttributes() {
    return ['image', 'title'];
  }

  private _slotContent: string = '';
  private _renderScheduled: boolean = false;
  private _initialized: boolean = false;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this._slotContent) {
      this._slotContent = this.textContent?.trim() ?? '';
    }
    this.classList.add('bento-card');

    if (!this._initialized) {
      this._initialized = true;
      this._scheduleRender();
    }
  }

 attributeChangedCallback(_name: string, old: string, value: string) {
  if (!this._initialized) return;  
  if (old !== value && this.isConnected) {
    this._scheduleRender();
  }
}

  private _scheduleRender() {
    if (this._renderScheduled) return;
    this._renderScheduled = true;
    setTimeout(() => {
      this._renderScheduled = false;
      this.render();
    }, 0);
  }

  render() {
  const image = this.getAttribute('image') ?? '';
  const title = this.getAttribute('title') ?? '';

  // Elimina TODO excepto magic-error
  Array.from(this.childNodes).forEach(node => {
    if ((node as Element).tagName !== 'MAGIC-ERROR') {
      node.remove();
    }
  });

  const titleEl = document.createElement('p');
  titleEl.className = 'card-title';
  titleEl.textContent = title;

  const bodyEl = document.createElement('p');
  bodyEl.className = 'card-body';
  bodyEl.textContent = this._slotContent;

  const errorEl = this.querySelector('magic-error');

  if (image) {
    const imgEl = document.createElement('img');
    imgEl.src = image;
    imgEl.alt = title;
    errorEl ? this.insertBefore(imgEl, errorEl) : this.appendChild(imgEl);
  }

  errorEl ? this.insertBefore(titleEl, errorEl) : this.appendChild(titleEl);
  errorEl ? this.insertBefore(bodyEl, errorEl) : this.appendChild(bodyEl);
}
}

customElements.define('magic-card', MagicCard);