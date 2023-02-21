'use strict';

const {CODES,MESSAGES} = require('./statusCodes');

const {
    getAllFromStorage,
    getFromStorage,
    addToStorage,
    updateStorage,
    removeFromStorage
}=require('./storageLayer');


module.exports = class Datastorage{
    get CODES(){
        return CODES;
    }

    getAll(){
        return getAllFromStorage();
    } 

    getOne(id){
        return new Promise(async (resolve,reject)=>{
            if(!id){
                reject(MESSAGES.NOT_FOUND('---empty---'));
            }
            else{
                const result = await getFromStorage(id);
                if(result){
                    resolve(result);
                }
                else{
                    reject(MESSAGES.NOT_FOUND(id))
                }
            }
        });
    } 

    insert(product){
        return new Promise(async (resolve,reject)=>{
            if(product){
                if(!product.id){
                    reject(MESSAGES.NOT_INSERTED());
                }
                else if(await getFromStorage(product.id)){
                    reject(MESSAGES.ALREADY_IN_USE(product.id))
                }
                else if(await addToStorage(product)){
                    resolve(MESSAGES.INSERT_OK(product.id))
                }
                else{
                    reject(MESSAGES.NOT_INSERTED());
                }
            }
            else{
                reject(MESSAGES.NOT_INSERTED());
            }
        });
    } //end of insert

    update(product){
        return new Promise(async (resolve,reject)=>{
            if(product){
                if(await updateStorage(product)){
                    resolve(MESSAGES.UPDATE_OK(product.id));
                }
                else{
                    reject(MESSAGES.NOT_UPDATED());
                }
            }
            else{
                reject(MESSAGES.NOT_UPDATED());
            }
        });
    } //end update

    remove(id){
        return new Promise(async (resolve,reject)=>{
            if(!id){
                reject(MESSAGES.NOT_FOUND('---empty---'));
            }
            else if(await removeFromStorage(id)){
                resolve(MESSAGES.REMOVE_OK(id));
            }
            else{
                reject(MESSAGES.NOT_REMOVED(id));
            }
        });
    } 
}