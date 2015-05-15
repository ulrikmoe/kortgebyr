/* Script for asynchronus load of sharing buttons */


/*

Temporarily disable social buttons...

var lnkdjs = "lang: da_DK";

(function (d) {
  var js, fjs = d.getElementsByTagName('script')[0],
    frag = d.createDocumentFragment(),
    load = function (url, id, func) {
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement('script');
      js.src = url;
      js.async = 1;
      if (func !== undefined) { js.innerHTML = func; }
      id && (js.id = id);
      frag.appendChild(js);
    };

  // Facebook
  load('https://connect.facebook.net/da_DK/all.js#xfbml=1&appId=544544962293468', 'facebook-jssdk');
  // Google+
  load('https://apis.google.com/js/plusone.js', 'gpjs');
  // Twitter
  load('https://platform.twitter.com/widgets.js', 'twjs');
  // LinedIn

  fjs.parentNode.insertBefore(frag, fjs);
}(document));

*/

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-46668451-1', 'auto');
ga('send', 'pageview');
