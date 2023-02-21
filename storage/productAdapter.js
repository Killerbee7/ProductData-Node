'use strict';

function adapt(product){
    return {
        id:+product.id,
        name:product.name,
        model:product.model,
        type:product.department,
        amount:+product.amount 
    }
}

module.exports={adapt}