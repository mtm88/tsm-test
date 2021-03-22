"use strict";
exports.__esModule = true;
/**
 * Checks for whether there's any unmet dependencies before sorting
 * TODO: once there's more util function move it to a util class
 * @param {ILayoutElement[]} elements elements to check
 * @return {bool}
 */
function missingDependencies(elements) {
    var allDepNames = elements.map(function (el) { return el.name; });
    var unmetDependency = false;
    elements.filter(function (el) {
        var _a;
        (_a = el.dependencies) === null || _a === void 0 ? void 0 : _a.forEach(function (dep) {
            if (!allDepNames.includes(dep.name)) {
                unmetDependency = true;
            }
        });
    });
    return unmetDependency;
}
exports.missingDependencies = missingDependencies;
/**
 * Takes a list of elements and returns them in the right render order
 * @param {ILayoutElement[]} elements list of elements to sort
 * @return {ILayoutElement[]}
 */
function getLayoutOrder(elements) {
    if (missingDependencies(elements)) {
        return [];
    }
    var sortedOrder = [];
    // we don't want to be modifying the passed reference so we make a copy
    var tempElements = Object.assign(elements);
    var _loop_1 = function () {
        var elementsToRemove = [];
        tempElements.forEach(function (el) {
            var _a;
            var elDependencies = (_a = el.dependencies) === null || _a === void 0 ? void 0 : _a.map(function (d) { return d.name; });
            var alreadySortedDepNames = sortedOrder.map(function (d) { return d.name; });
            if (elDependencies === null || elDependencies === void 0 ? void 0 : elDependencies.length) {
                var depsSatisfied = elDependencies.filter(function (depName) {
                    return alreadySortedDepNames.includes(depName);
                });
                if (elDependencies.length === depsSatisfied.length) {
                    sortedOrder.push(el);
                    elementsToRemove.push(el.name);
                }
            }
            else {
                // let the components without any deps to render in random order
                sortedOrder.push(el);
                elementsToRemove.push(el.name);
            }
        });
        // we don't want to be splicing within forEach, do it after
        // we also don't want to be splicing by index as it will
        // change on every splice
        elementsToRemove.forEach(function (name) {
            var nameIndex = tempElements.findIndex(function (tempEl) { return tempEl.name === name; });
            if (nameIndex > -1) {
                tempElements.splice(nameIndex, 1);
            }
        });
    };
    /* keep going until there's no unordered elements left
    TODO: would be much nicer to have a recursive function do it,
    subject to perf test */
    while (tempElements.length) {
        _loop_1();
    }
    console.log(sortedOrder);
    return sortedOrder;
}
module.exports = {
    getLayoutOrder: getLayoutOrder,
    missingDependencies: missingDependencies
};
