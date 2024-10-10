jQuery(function ($) {
  $("#rss-news").rss("https://hellaz.net/freshrss/p/api/query.php?user=hellaz&t=09e4265e0c54a95855af01acf19c074c&f=rss", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-greece").rss("https://hellaz.net/freshrss/p/api/query.php?user=hellaz&t=cddbcfbd6dd23c009c93721060d358f2&f=rss", 
   {
    limit: 5
  })
})

jQuery(function ($) {
  $("#rss-sports").rss("https://hellaz.net/freshrss/p/api/query.php?user=hellaz&t=ac3684161f5d666c3a93ca24fd094224&f=rss", 
   {
    limit: 5
  })
})
