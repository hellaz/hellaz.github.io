jQuery(function ($) {
  $("#rss-books").rss("http://feeds.feedburner.com/HellazBooks", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-movies").rss("http://feeds.feedburner.com/HellazMovies", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-scripts").rss("http://feeds.feedburner.com/HellazScripts", 
   {
    limit: 5
  })
})
