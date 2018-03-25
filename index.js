const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
  console.log('getDataFromApi ran');
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      'maxResults': '25',
      'part': 'snippet',
      'q': searchTerm,
      'type': 'video',
      'key': 'AIzaSyBhVeDVxN5VgRfxHEIQVeks5m3t-0ob6Qw'
    },
    dataType: 'json',
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
      <a class="js-result-thumbnail" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
        <img src="${result.snippet.thumbnails.medium.url}" aria-label="${result.id.videoId}"/>
        <p id="${result.id.videoId}">${result.snippet.title}</p>
      </a> 
    </div>
  `;
}

function displayYouTubeSearchData(data) {
  console.log('displayYouTubeSearchData ran');
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').prop('hidden', false)
  $('.js-search-results').html(results);
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
    getDataFromApi(query, displayYouTubeSearchData);
  });
}

$(watchSubmit);
