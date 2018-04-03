function greenSmoothieApp() {


  const YUMMLY_SEARCHRECIPES_URL = 'https://api.yummly.com/v1/api/recipes';
  const YUMMLY_GETRECIPE_BASE_URL = 'https://api.yummly.com/v1/api/recipe/';
  let results;
  let attribution;


  function getDataFromYummlySearchRecipesApi(searchTerm, callback) {
    
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

    $.ajax(settings);
  }
   

  function getDataFromYummlyGetRecipeApi(recipeId, callback) {
    
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

    $.ajax(settings);
  }


  function renderSearchResult(result) {
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
    const ingredientListHTML = renderIngredientList(recipe);
    return `
      <div>
        <button type="submit" class="js-back">Back to Search Results</button>
        <h3>${recipe.attribution.html}</h3>
        <img src="${recipe.images[0].hostedLargeUrl}"/>
        <h4>Servings: ${recipe.numberOfServings}</h4>
        ${ingredientListHTML}
        <p>Source: <a href="${recipe.source.sourceRecipeUrl}" target="_blank">${recipe.source.sourceDisplayName}</a></p>
        <button type="submit" class="js-back">Back to Search Results</button>
      </div>
    `;
  }


  function renderIngredientList(recipe) {
    
    let ingrListHTML = "";
    
    for (let i = 0; i < recipe.ingredientLines.length; i++) {
      ingrListHTML += `<p>${recipe.ingredientLines[i]}</p>`;
    }

    return ingrListHTML;
  }


  function displayYummlySearchData(data) {
    
    if (data.totalMatchCount>0) { 
      
      results = data.matches.map((item, index) => renderSearchResult(item));
      attribution = data.attribution.html;
      unhideResultsDiv();
      populateResultsToDOM(attribution, results);
      watchForSelection();

    } else {

      unhideResultsDiv();
      const errorMessage = "<p>There are no search results to display.</p>";
      $('.js-results').html(errorMessage);
    }
  }


  function populateResultsToDOM(attribution_1, results_1) {
    $('.js-results').html(attribution_1);
    $('.js-results').append(results_1);
  }


  function unhideResultsDiv() {
    $('.js-results').prop('hidden', false);
  }


  function watchForSelection() {
    $("a").on( "click", function(event) {
        event.preventDefault();
        console.log('recipe clicked');
        const recipeId = $(this).children('p').attr('id');
        getDataFromYummlyGetRecipeApi(recipeId, displayYummlyRecipe);
      });
  }


  function displayYummlyRecipe(data) {
    const recipeHTML = renderRecipe(data);
    $('.js-results').html(recipeHTML);
    $('h3 a').attr('target','_blank');
    $('.js-back').click(event => {
      event.preventDefault();
      populateResultsToDOM(attribution, results);
      watchForSelection();
    })
  }


  function watchSubmitSearch() {
    
    clearInput();

    $('.js-search-form').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      getDataFromYummlySearchRecipesApi(query, displayYummlySearchData);
    });
  }


  function clearInput() {
    $('.js-query').val("");
  }


  $(watchSubmitSearch);

}

greenSmoothieApp();