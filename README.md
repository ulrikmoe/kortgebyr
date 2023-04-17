# Kortgebyr.dk

[Kortgebyr](https://kortgebyr.dk) (*danish: card fee*) is a price comparison website for online payment solutions. The purpose of the site is to make the market for payment solutions more transparent. The project started as an advanced spreadsheet (2010), but in 2012 we moved to JavaScript and bought a domain: [kortgebyr.dk](https://kortgebyr.dk).

![Screenshot of Kortgebyr](/screenshot.png?raw=true "kortgebyr screenshot")

## Contributing

So, you are interested in contributing? Welcome! Every single contribution is very much encouraged and appreciated. If you find a bug, typo or something that could be improved, please create an issue on the [issue tracker](https://github.com/ulrikmoe/kortgebyr/issues).

## Build locally

To build it locally, you will need [Node.js](https://nodejs.org/en/) and [Gulp 4](http://gulpjs.com).

```bash
git clone https://github.com/ulrikmoe/kortgebyr.git
cd kortgebyr
pnpm install
gulp
```

## Browser support

Browser        | TLSv1.2       | JavaScript      | CSS           |
-------------- | :-----------: | :-------------: | :------------:|
Chrome         |  30 (2013-09) |  49 (2016-03)   |  66 (2018-04) |
Safari         |   7 (2013-09) |  10.0 (2016-09) |  12 (2018-09) |
Firefox        |  27 (2013-09) |  44 (2016-01)   |  61 (2018-06) |
Edge           |  12 (2015-07) |  12 (2015-07)   |  16 (2017-10) |


### JavaScript compatibility table

Compatibility table. Struckthrough means fixed with a polyfill etc.

Feature                     | Chrome  | Safari   | Firefox |  Edge
-----------------------     | :------:| :------: | :-----: | :----:
Arrow Functions             |  45     |  10.0    |  22     |  12
Let/Const                   |  49     |  10.0    |  44     |  12
new Set()                   |  38     |   8.0    |  13     |  12
Set.has()                   |  38     |   8.0    |  13     |  12
Object shorthand props      |  47     |   9.0    |  34     |  12
Template literals           |  41     |   9.1    |  34     |  13
URL API                     |  32     |   7.1    |  26     |  12
Array.filter/sort           |   4     |   3.1    |  2      |  12
**total**                   |  **49** |  **10.0**|  **44** |  **12**


### CSS compatibility table

Compatibility table. Struckthrough means fixed with fallback etc.

Feature                     | Chrome  | Safari   | Firefox |  Edge
-----------------------     | :------:| :------: | :-----: | :----:
appearance                  |  ~~84~~ | ~~15.4~~ | ~~80~~  | ~~84~~
-webkit-appearance          |   4     |   3.1    |  :x:    |  12
-moz-appearance             |  :x:    |   :x:    |   2     |  :x:
user-select                 |  ~~54~~ |   :x:    |  ~~69~~ | ~~79~~
-webkit-user-select         |   4     |   3.1    |  :x:    |  :x:
-ms-user-select             |  :x:    |   :x:    |  :x:    |  12
-moz-user-select            |  :x:    |   :x:    |   2     |  :x:
flex                        |  21     |   9.0    |  28     |  12
flex-wrap                   |  29     |   9.0    |  28     |  12
grid                        |  57     |  10.1    |  52     |  16
column-gap (in grid)        |  66     |  12.0    |  61     |  16
**total**                   |  **66** |  **12.0**|  **61** |  **16**


## License

Everything in this repository is licensed under the MIT license. [LICENSE](LICENSE).
