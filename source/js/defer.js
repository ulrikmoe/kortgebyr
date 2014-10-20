/* Script for asynchronus load of sharing buttons */

var gajs = "ga('create', 'UA-46668451-1', 'kortgebyr.dk'); ga('send', 'pageview')";
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
  load('https://platform.linkedin.com/in.js', 'lnkdjs', lnkdjs);
  // Google Analytics, skal implementeres ved lejlighed
  load('https:////www.google-analytics.com/analytics.js', 'gajs', gajs);

  fjs.parentNode.insertBefore(frag, fjs);
}(document));
