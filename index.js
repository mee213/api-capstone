const YUMMLY_SEARCHRECIPES_URL = 'https://api.yummly.com/v1/api/recipes';
const YUMMLY_GETRECIPE_BASE_URL = 'https://api.yummly.com/v1/api/recipe/';

function getDataFromYummlySearchRecipesApi(searchTerm, callback) {
  console.log('getDataFromYummlySearchRecipesApi ran');
  const settings = {
    url: YUMMLY_SEARCHRECIPES_URL,
    data: {
      '_app_key': '98d5f50b76c55e907326e264c73e2b06',
      '_app_id': 'fb07a227',
      'q': `green smoothie ${searchTerm}`,
      'requirePictures': true
    },
    dataType: 'jsonp',
    type: 'GET',
    success: callback
  };

  console.log(settings);

  $.ajax(settings);
}
 
function getDataFromYummlyGetRecipeApi(recipeId, callback) {
  console.log('getDataFromYummlyGetRecipeApi ran');
  const settings = {
    url: `${YUMMLY_GETRECIPE_BASE_URL}${recipeId}`,
    data: {
      '_app_key': '98d5f50b76c55e907326e264c73e2b06',
      '_app_id': 'fb07a227',
      'q': recipeId
    },
    dataType: 'jsonp',
    type: 'GET',
    success: callback
  };

  console.log(settings);

  $.ajax(settings);
}

function renderSearchResult(result) {
  console.log('renderSearchResult ran');
  console.log(result);
  return `
    <div>
      <a class="js-result-thumbnail" href="https://www.yummly.com/#recipe/${result.id}" target="_blank">
        <img src="${result.smallImageUrls[0]}" aria-label="${result.id}"/>
        <p id="${result.id}">${result.recipeName} (Source: ${result.sourceDisplayName})</p>
      </a> 
    </div>
  `;
}

function renderRecipe(recipe) {
  console.log('renderRecipe ran');
  console.log(recipe);
  const ingredientListHTML = renderIngredientList(recipe);
  return `
    <div>
      <h3>${recipe.attribution.html}</h3>
      <img src="${recipe.images[0].hostedLargeUrl}"/>
      <h4>Servings: ${recipe.numberOfServings}</h4>
      ${ingredientListHTML}
      <p>Source: <a href="${recipe.source.sourceRecipeUrl}">${recipe.source.sourceDisplayName}</a></p>
    </div>
  `;
}

function renderIngredientList(recipe) {
  console.log('renderIngredientList ran');
  let ingrListHTML = "";
  for (let i = 0; i < recipe.ingredientLines.length; i++) {
    ingrListHTML += `<p>${recipe.ingredientLines[i]}</p>`;
  }
  return ingrListHTML;
}

function displayYummlySearchData(data) {
  console.log('displayYummlySearchData ran');
  console.log(data);
  const results = data.matches.map((item, index) => renderSearchResult(item));
  const attribution = data.attribution.html;
  $('.js-search-results').prop('hidden', false)
  $('.js-search-results').html(attribution)
  $('.js-search-results').append(results);

  // watch for user to click on a recipe & display the recipe
  $("a").on( "click", function(event) {
    event.preventDefault();
    console.log('recipe clicked');
    const recipeId = $(this).children('p').attr('id');
    getDataFromYummlyGetRecipeApi(recipeId, displayYummlyRecipe);
  });
}

function displayYummlyRecipe(data) {
  console.log('displayYummlyRecipe ran');
  console.log(data);
  const recipeDisplay = renderRecipe(data);
  $('.js-search-results').html(recipeDisplay);
}

function watchSubmitSearch() {
  console.log('watchSubmitSearch ran');
  $('.js-search-form').submit(event => {
    event.preventDefault();
    console.log('Submit button clicked');
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    console.log(`The search term is ${query}`);
    getDataFromYummlySearchRecipesApi(query, displayYummlySearchData);
  });
}

$(watchSubmitSearch);
