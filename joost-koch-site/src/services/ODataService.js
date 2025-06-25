import axios from 'axios';

const API_BASE_URL = 'https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/';

function buildQueryString(options) {
    const params = new URLSearchParams();
    if (options.filter) {
        params.append('$filter', options.filter);
    }
    if (options.orderby) {
        params.append('$orderby', options.orderby);
    }
    if (options.top) {
        params.append('$top', options.top);
    }
    if (options.skip) {
        params.append('$skip', options.skip);
    }
    if (options.expand) {
        params.append('$expand', options.expand);
    }
    // To get the total count of items
    params.append('$count', 'true');
    return params.toString();
}

async function get(entitySet, options = {}) {
    const queryString = buildQueryString(options);
    const url = `${API_BASE_URL}${entitySet}?${queryString}`;
    return axios.get(url);
}

export default {
    getMotions(options) {
        return get('Zaak', options);
    },
    getStemmingen(options) {
        return get('Stemming', options);
    }
};
