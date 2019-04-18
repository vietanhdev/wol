import update from 'immutability-helper';

/**
 * Get the list of computer items.
 * @return {Array}
 */
export function getAll() {
    return [
        {
            id: 1,
            name: 'Beep 1',
            mac_address: 'b4:2e:99:49:74:f3',
            status: 1
        },
        {
            id: 2,
            name: 'Beep 2',
            mac_address: 'b5:2e:99:49:74:f3',
            status: 2
        },
        {
            id: 3,
            name: 'Beep 3',
            mac_address: 'b6:2e:99:49:74:f3',
            status: 0   
        }
    ]
}

export function getItemById(itemId) {
    return getAll().find(item => item.id === itemId);
}

export function updateStatus(items, itemId, status) {
    let index = items.findIndex(item => item.id === itemId);

    // Returns a new list of data with updated item.
    return update(items, {
        [index]: {
            status: {$set: status}
        }
    });
}

/**
 * A counter to generate a unique id for a computer item.
 * Can remove this logic when the computer is created using backend/database logic.
 * @type {Number}
 */
let computerCounter = 1;

function getNextId() {
    return getAll().length + computerCounter++;
}

/**
 * Adds a new item on the list and returns the new updated list (immutable).
 *
 * @param {Array} list
 * @param {Object} data
 * @return {Array}
 */
export function addToList(list, data) {
    let item = Object.assign({
        id: getNextId()
    }, data);

    return list.concat([item]);
}
