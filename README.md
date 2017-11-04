# Kortgebyr.dk

[Kortgebyr](https://kortgebyr.dk) (*danish: card fee*) is a price comparison website for online payment solutions. The purpose of the site is to make the market for payment solutions more transparent. The project started as an advanced spreadsheet (2010), but in 2012 we moved to JavaScript and bought a domain: [kortgebyr.dk](https://kortgebyr.dk).

![Screenshot of Kortgebyr](/screenshot.png?raw=true "kortgebyr screenshot")


## Browser support

Compatibility table where struckthrough means fixed with babel:

Feature               | Chrome | Safari | Firefox |  Edge  |  IE    |  Opera
--------------------- | :-----:| :----: | :-----: | :----: | :----: | :----:
TLS 1.2               | 30     | 7      | 27      | 12     | 9/11*  | 17
~~Let~~               | 49     | 10     | 44      | 12     | 11     | 36
~~Const~~             | 49     | 10     | 36      | 12     | 11     | 36
~~Arrow Functions~~   | 45     | 10     | 22      | 12     | :x:    | 32
~~Default params.~~   | 49     | 10     | 15      | 14     | :x:    | 45
~~Shorthand props.~~  | 39     | 9      | 34      | 12     | :x:    | 29

## Contributing

So, you are interested in contributing? Welcome! Every single contribution is very much encouraged and appreciated. If you find a bug, typo or something that could be improved, please create an issue on the [issue tracker](https://github.com/ulrikmoe/kortgebyr/issues).

## Build locally

To build it locally, you will need [Node.js](https://nodejs.org/en/) and [Gulp 4](http://gulpjs.com).

```bash
git clone git@github.com:ulrikmoe/kortgebyr.git
cd kortgebyr
npm install
gulp
```

## License

Everything in this repository is licensed under the MIT license. [LICENSE](LICENSE).
