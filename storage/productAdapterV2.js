'use strict';

function adapt(item){
    console.log('adapterV2')
    return Object.assign(item, {
        id:+item.id,
        amount:+item.amount
    });
}

module.exports = {adapt}