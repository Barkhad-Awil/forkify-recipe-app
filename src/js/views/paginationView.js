import View from './View.js';
import icons from '../../img/icons.svg'; //import icons

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addhandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline ');
      const goToPage = Number(btn.dataset.goto);
      console.log(btn);
      handler(goToPage);
    });
  }
  _generatePrevBtn(curPage) {
    return `
    <button data-goto="${curPage - 1}"class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
           <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
   </button>`;
  }
  _generateNextBtn(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
    `;
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1
    if (curPage === 1 && numOfPages > 1) {
      return this._generateNextBtn(curPage);
    }

    //Last Page
    if (curPage === numOfPages && numOfPages > 1) {
      return this._generatePrevBtn(curPage);
    }
    //Other Pages
    if (curPage > 1 && curPage < numOfPages) {
      return [this._generatePrevBtn(curPage), this._generateNextBtn(curPage)]
        .map(btn => {
          return btn;
        })
        .join();
    }
    //in page1, and their are no other pages
    if (numOfPages === 1 && curPage === 1) {
      return '';
    }
  }
}

export default new PaginationView();
