import icons from 'url:../../img/icons.svg'; //import icons

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Barkhad Awil
   * @todo Finish implementation
   */

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.handlerError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newElem, i) => {
      const curElem = curElements[i];

      // 1) Updates changed TEXT
      if (
        !newElem.isEqualNode(curElem) &&
        newElem.firstChild?.nodeValue.trim() !== ''
      ) {
        curElem.textContent = newElem.textContent;
      }

      // 2) Updates changed ATTRIBUES
      if (!newElem.isEqualNode(curElem)) {
        Array.from(newElem.attributes).forEach(attr => {
          curElem.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.handlerError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
    </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  handlerError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
            <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
            <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
