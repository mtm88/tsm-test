import { ILayoutElement } from './ILayoutElement';

/**
 * Checks for whether there's any unmet dependencies before sorting
 * TODO: once there's more util function move it to a util class
 * @param {ILayoutElement[]} elements elements to check
 * @return {bool}
 */
export function missingDependencies(elements: ILayoutElement[]): boolean {
    const allDepNames = elements.map((el) => el.name);
    let unmetDependency = false;

    elements.filter((el) => {
        el.dependencies?.forEach((dep) => {
            if (!allDepNames.includes(dep.name)) {
                unmetDependency = true;
            }
        });
    });

    return unmetDependency;
}

/**
 * Takes a list of elements and returns them in the right render order
 * @param {ILayoutElement[]} elements list of elements to sort
 * @return {ILayoutElement[]}
 */
function getLayoutOrder(elements: ILayoutElement[]): ILayoutElement[] {
    if (missingDependencies(elements)) {
        return [];
    }
    const sortedOrder: ILayoutElement[] = [];

    // we don't want to be modifying the passed reference so we make a copy
    const tempElements: ILayoutElement[] = Object.assign(elements);

    /* keep going until there's no unordered elements left
    TODO: would be much nicer to have a recursive function do it,
    subject to perf test */
    while (tempElements.length) {
        const elementsToRemove: string[] = [];

        tempElements.forEach((el) => {
            const elDependencies = el.dependencies?.map((d) => d.name);
            const alreadySortedDepNames = sortedOrder.map((d) => d.name);

            if (elDependencies?.length) {
                const depsSatisfied = elDependencies.filter((depName) =>
                    alreadySortedDepNames.includes(depName));

                if (elDependencies.length === depsSatisfied.length) {
                    sortedOrder.push(el);

                    elementsToRemove.push(el.name);
                }
            } else {
                // let the components without any deps to render in random order
                sortedOrder.push(el);

                elementsToRemove.push(el.name);
            }
        });

        // we don't want to be splicing within forEach, do it after
        // we also don't want to be splicing by index as it will
        // change on every splice
        elementsToRemove.forEach((name) => {
            const nameIndex =
                tempElements.findIndex((tempEl) => tempEl.name === name);

            if (nameIndex > -1) {
                tempElements.splice(nameIndex, 1);
            }
        });
    }

    console.log(sortedOrder);
    return sortedOrder;
}

module.exports = {
    getLayoutOrder,
    missingDependencies
};
