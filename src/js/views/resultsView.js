import View from './View.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg'; //import icons

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found for your query! Please try again`;
  _successMessage = '';

  _generateMarkup() {
    return this._data
      .map(result => {
        return previewView.render(result, false);
      })
      .join('');
  }
}
export default new ResultsView();
