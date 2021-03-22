var priceFromApi = 211987;
/**
 * Parses raw API input into human readable price
 * @param {number} price raw price returned from API
 * @return {string}
 */
function parseRawPrice(price) {
    var gold = Math.floor(price / 10000);
    var silver = Math.floor((price % 10000) / 100);
    var copper = Math.floor((price % 10000) % 100);
    var parsedPrice = gold + "g " + silver + "s " + copper + "c";
    // to be removed/commented out. Useful for dev/debugging purposes
    console.info("parsed price for " + price + " is " + parsedPrice);
    return parsedPrice;
}
module.exports.parseRawPrice = parseRawPrice;
