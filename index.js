function thisApp() {


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
        'requirePictures': true,
        maxResult: 144
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
      <div class="col-3">
        <div class="box">
          <a class="js-result-thumbnail" href="" >
            <img class="image" src="${result.smallImageUrls[0]}" aria-label="${result.id}"/>
            <div class="text">
              <h4 id="${result.id}">${result.recipeName} (Source: ${result.sourceDisplayName})</h4>
            </div>
          </a> 
        </div>
      </div>
    `;
  }


  function renderRecipe(recipe) {
    const ingredientListHTML = renderIngredientList(recipe);
    return `
      <div class="col-12">
        <button type="submit" class="js-back">Back to Search Results</button>
        <h3 id="${recipe.name}""><a href="${recipe.attribution.url}">${recipe.name}</a></h3>
        <img src="${recipe.images[0].hostedLargeUrl}" aria-label="${recipe.name}"/>
        <h5>Servings: ${recipe.numberOfServings}</h5>
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
      attribution = `<div class="col-12"><p>${data.attribution.html}</p></div>`;
      unhideResultsDiv();
      populateResultsToDOM(attribution, results);
      console.log(attribution);
      watchForSelection();

    } else {

      unhideResultsDiv();
      const errorMessage = "<p>There are no search results to display.</p>";
      $('.js-results').html(errorMessage);
    }
  }


  function populateResultsToDOM(attribution_1, results_1) {
    $('.js-results').html(results_1);
    
  }


  function unhideResultsDiv() {
    $('.js-results').prop('hidden', false);
  }


  function watchForSelection() {
    $("a").on( "click", function(event) {
        event.preventDefault();
        const recipeId = $(this).find('h4').attr('id');
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

thisApp();