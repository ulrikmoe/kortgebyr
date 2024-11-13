/**
 *  Task to load currency values from ECB
 */

exports.task = async (cb) => {
    let currency_values = "'EUR':1,"
    const raw = await fetch('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
    const txt = await raw.text();
    const array = [...txt.matchAll(/currency='([A-Z]{3})' rate='([0-9.]+)'/g)];
    array.forEach((m) => currency_values += `'${m[1]}':${parseFloat(m[2])},`);

    // Save to global variable
    global.currency_values = currency_values;
    cb(null);
};
