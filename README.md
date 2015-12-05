# Kortgebyr.dk

<a href="https://kortgebyr.dk">Kortgebyr</a> (*danish: card fee*) is a price comparison website for online payment solutions. The project started in 2012 and it is still very much a work in progress. The purpose of the site is to make the market for payment solutions more transparent and startup-friendly.

**Note:** The site is in danish, but by the end of 2015 we will translate it to English. We hope that someone can help us with the following languages:
```text
Swedish
Norwegian [✓]
Suomi [✓]
Estonian
Latvian
Lithuanian
```

![Alt text](/screenshot.png?raw=true "kortgebyr screenshot")

## Contributing

So, you are interested in contributing? Welcome! Every single contribution is very much encouraged and appreciated. If you find a bug, typo or something that could be improved, please create an issue on the GitHub <a href="https://github.com/ulrikmoe/kortgebyr/issues">issue tracker</a>. Some of us are on IRC, you can find us on ```#kortgebyr``` at irc.freenode.net.

## Build locally

To build the website locally, you will need to install [Node.js](https://nodejs.org/en/) and [Gulp.js](http://gulpjs.com). We use Gulp.js to build the website and host it on `localhost:8080`. You can enable development mode with the `--dev` flag, which will enable live-reload and disable code minifiers.

```bash
git clone git@github.com:ulrikmoe/kortgebyr.git
cd kortgebyr
npm install
gulp --dev
```
**Note:** You need Gulp.js >= v.4.0 for this to work:

## License

Everything in this repository is licensed under the GNU General Public License v3.0 (GPLv3). Feel free to use, study, share, copy, sell or modify it.

[LICENSE](LICENSE).
