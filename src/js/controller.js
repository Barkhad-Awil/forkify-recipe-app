import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable'; //pollyfiling every old JS features
import 'regenerator-runtime/runtime'; // pollyfiling async/await

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0) call spiner method
    recipeView.renderSpinner();

    // 1) Update results view to mark selected research result
    resultsView.update(model.getSearchResultsPage());

    // 2) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 3) loading a recipe
    await model.loadRecipe(id);

    // 4) Rendering a recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.handlerError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 0) Get search query.
    const query = searchView.getQuery();
    if (!query) return;

    // 1) Load search results.
    await model.loadSearchResults(query);

    // 2) Render search results.
    resultsView.render(model.getSearchResultsPage(1));

    // 3) Render pagination buttons.
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new result view.
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) render New pagination buttons.
  paginationView.render(model.state.search);
};

const constrolServings = function (newServings) {
  // 0) Update the recipe servings in state
  model.updateServings(newServings);

  // 1) Update the recipe view.
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 0) Add/Remove bookmark.
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 1) Update recipe view.
  recipeView.update(model.state.recipe);

  // 2) Render bookmark;
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 0) Render spinner
    addRecipeView.renderSpinner();

    // 1) Upload the newRecipe data;
    await model.uploadRecipe(newRecipe);

    // 2) Render recipe;
    recipeView.render(model.state.recipe);

    // 3) Success messae
    addRecipeView.renderMessage();

    // 4) Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // 5) Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 6) Close window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.handlerError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandelRender(controlRecipe);
  recipeView.addHandlerUpdateServings(constrolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearchSubmit(controlSearchResults);
  paginationView.addhandlerClick(controlPagination);
  addRecipeView.addhandlerUpload(controlAddRecipe);
};
init();
