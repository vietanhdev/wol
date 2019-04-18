import {stringInclues} from '../util/common';

export const FILTER_ALL = 'all';
export const FILTER_ONLINE = 'online';
export const FILTER_OFFLINE = 'offline';
export const FILTER_BUSY = 'busy';

export function applyFilter(list, filter) {
    switch (filter) {
        case FILTER_OFFLINE:
            return list.filter(item => item.status === 0);

        case FILTER_ONLINE:
            return list.filter(item => item.status === 1);

        case FILTER_BUSY:
            return list.filter(item => item.status === 2);

        default:
            return list;
    }
}

export function search(list, query) {
    let q = query.trim().toLowerCase();

    return list.filter(({name}) => stringInclues(name.toLowerCase(), q));
}


export function getOptions() {
    return {
        [FILTER_ALL]: 'All',
        [FILTER_ONLINE]: 'Online',
        [FILTER_OFFLINE]: 'Offline',
        [FILTER_BUSY]: 'Busy'
    };
}
