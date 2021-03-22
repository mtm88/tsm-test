"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var parseRawPrice = require('../src/test_1').parseRawPrice;
var _a = require('../src/test_2'), missingDependencies = _a.missingDependencies, getLayoutOrder = _a.getLayoutOrder;
var testElements = [];
describe('TSM tests', function () {
    beforeEach(function () {
        testElements = [
            {
                name: 'element 1',
                dependencies: []
            },
            {
                name: 'element 2',
                dependencies: [{
                        name: 'element 3'
                    }]
            },
            {
                name: 'element 3',
                dependencies: [
                    {
                        name: 'element 1'
                    }
                ]
            },
            {
                name: 'element 4',
                dependencies: [
                    {
                        name: 'element 2'
                    },
                    {
                        name: 'element 3'
                    }
                ]
            }
        ];
    });
    describe('Test 1 cases', function () {
        var prices = [
            { rawValue: 211987, expectedValue: '21g 19s 87c' },
            { rawValue: 921, expectedValue: '0g 9s 21c' },
            { rawValue: 15, expectedValue: '0g 0s 15c' },
        ];
        it('returns human readable price', function () {
            prices.forEach(function (price) {
                var parsedPrice = parseRawPrice(price.rawValue);
                chai_1.expect(price).to.not.be["null"];
                chai_1.expect(parsedPrice).to.eq(price.expectedValue);
            });
        });
    });
    describe('Test 2 cases', function () {
        describe('missingDependencies function', function () {
            it('should return false if all dependencies met', function () {
                var result = missingDependencies(testElements);
                chai_1.expect(result).to.be["false"];
            });
            it('should return true if there is a missing dependency', function () {
                testElements[3].dependencies[1].name = 'element 666';
                var result = missingDependencies(testElements);
                chai_1.expect(result).to.be["true"];
            });
        });
        describe('getLayoutOrder function', function () {
            it('should return the elements in the right order', function () {
                var result = getLayoutOrder(testElements);
                chai_1.expect(result).to.not.be["null"];
                var resultNames = result.map(function (el) { return el.name; });
                chai_1.expect(resultNames).to.deep.eq(['element 1', 'element 3', 'element 2', 'element 4']);
            });
            it('should return empty array if there\'s missing dependency', function () {
                testElements[3].dependencies[1].name = 'element 666';
                var result = getLayoutOrder(testElements);
                chai_1.expect(result).to.not.be["null"];
                chai_1.expect(result.length).to.eq(0);
            });
        });
    });
});
