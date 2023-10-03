jQuery(function ($) {
  $("#rss-news").rss("https://portal.hellaz.eu/rss.xml?category=14", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-greece").rss("https://portal.hellaz.eu/rss.xml?category=2", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-sports").rss("https://portal.hellaz.eu/rss.xml?category=5", 
   {
    limit: 5
  })
})
