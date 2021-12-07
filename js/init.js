jQuery(function ($) {
  $("#rss-books").rss("https://www.techmeme.com/feed.xml", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-movies").rss("https://news.google.com/rss?hl=el&gl=GR&ceid=GR:el", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-scripts").rss("http://feeds.bbci.co.uk/news/rss.xml", 
   {
    limit: 5
  })
})
