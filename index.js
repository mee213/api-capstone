const YUMMLY_SEARCHRECIPES_URL = 'https://api.yummly.com/v1/api/recipes';
const YUMMLY_GETRECIPE_URL = 'https://api.yummly.com/v1/api/recipe/recipe-id';

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
 
function getDataFromYummlyGetRecipeApi(searchTerm, callback) {
  console.log('getDataFromYummlyGetRecipeApi ran');
  const settings = {
    url: YUMMLY_GETRECIPE_URL,
    data: {
      '_app_key': '98d5f50b76c55e907326e264c73e2b06',
      '_app_id': 'fb07a227',
      'q': searchTerm,
      'requirePictures': true
    },
    dataType: 'jsonp',
    type: 'GET',
    success: callback
  };

  console.log(settings);

  $.ajax(settings);
}

function renderResult(result) {
  console.log('renderResult ran');
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

function displayYummlySearchData(data) {
  console.log('displayYummlySearchData ran');
  console.log(data);
  const results = data.matches.map((item, index) => renderResult(item));
  const attribution = data.attribution.html;
  $('.js-search-results').prop('hidden', false)
  $('.js-search-results').html(attribution)
  $('.js-search-results').append(results);
}

function watchSubmit() {
  console.log('watchSubmit ran');
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

$(watchSubmit);
