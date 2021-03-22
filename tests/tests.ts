import { expect } from 'chai';
import { ILayoutElement } from '../src/ILayoutElement';
const { parseRawPrice } = require('../src/test_1');
const { missingDependencies, getLayoutOrder } = require('../src/test_2');

interface IPriceParseCase {
    rawValue: number;
    expectedValue: string;
}

let testElements: ILayoutElement[] = [];

describe('TSM tests', () => {
    beforeEach(() => {
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

    describe('Test 1 cases', () => {
        var prices: IPriceParseCase[] = [
            { rawValue: 211987, expectedValue: '21g 19s 87c' },
            { rawValue: 921, expectedValue: '0g 9s 21c' },
            { rawValue: 15, expectedValue: '0g 0s 15c' },
        ]

        it('returns human readable price', () => {
            prices.forEach((price: IPriceParseCase) => {
                const parsedPrice = parseRawPrice(price.rawValue);

                expect(price).to.not.be.null;
                expect(parsedPrice).to.eq(price.expectedValue);
            });

        });
    });


    describe('Test 2 cases', () => {
        describe('missingDependencies function', () => {
            it('should return false if all dependencies met', () => {
                const result = missingDependencies(testElements);

                expect(result).to.be.false;
            });

            it('should return true if there is a missing dependency', () => {
                testElements[3].dependencies[1].name = 'element 666';
                const result = missingDependencies(testElements);

                expect(result).to.be.true;
            });
        });

        describe('getLayoutOrder function', () => {
            it('should return the elements in the right order', () => {
                const result = getLayoutOrder(testElements);

                expect(result).to.not.be.null;
                const resultNames = result.map((el) => el.name);
                expect(resultNames).to.deep.eq(['element 1', 'element 3', 'element 2', 'element 4']);
            });

            it('should return empty array if there\'s missing dependency', () => {
                testElements[3].dependencies[1].name = 'element 666';

                const result = getLayoutOrder(testElements);

                expect(result).to.not.be.null;
                expect(result.length).to.eq(0);
            });
        });
    });
});
