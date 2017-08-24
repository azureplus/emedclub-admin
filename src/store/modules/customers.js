import api from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
    me: null,

    merchant: null,
}

// getters
const getters = {
    me: state => state.me,

    merchant: state => state.merchant
}

// actions
const actions = {
    login ({ commit }, id) {
        return new Promise(function(resolve, reject) {
            api.queryOne("Customer", id).then(function(customer) {
                api.query("Merchant", {"customer_id": id}, {limit: 1}).then(function(merchants) {
                    if (merchants.length == 1) {
                        commit(types.CHANGE_MERCHANT, merchants[0])
                    }
                    commit(types.CHANGE_CUSTOMER, customer)

                    resolve(customer);
                }, function(err){
                    reject(err);
                })
            }, function(err){
                reject(err);
            })
        })
    },

    logout ({ commit }) {
        commit(types.CHANGE_CUSTOMER, null);
        commit(types.CHANGE_MERCHANT, null);
    },

    register ({ commit }, merchant) {
        commit(types.CHANGE_MERCHANT, merchant);
    },

    changeCustomer ({ commit, state  }, attr) {
        return new Promise(function(resolve, reject) {
            api.queryOne("Customer", state.me.id).then(function(customer){
                customer.setAttrs(state.me);
                customer.setAttrs(attr);
                api.save(customer).then(function(c){
                    commit(types.CHANGE_CUSTOMER, c);

                    resolve();
                }, function(err){
                    reject(err)
                })
            }, function(err){
                reject(err)
            })
        })
    },

    changeMerchant ({ commit, state  }, attr) {
        return new Promise(function(resolve, reject) {
            api.queryOne("Merchant", state.merchant.id).then(function(merchant){
                merchant.setAttrs(state.merchant);
                merchant.setAttrs(attr);
                api.save(merchant).then(function(c){
                    commit(types.CHANGE_MERCHANT, c);

                    resolve();
                }, function(err){
                    reject(err)
                })
            }, function(err){
                reject(err)
            })
        })
    },
}

// mutations
const mutations = {
    [types.CHANGE_CUSTOMER] (state, customer) {
        if (customer) {
            state.me = customer.attrs;
        } else {
            state.me = null;
        }        
    },  

    [types.CHANGE_MERCHANT] (state, merchant) {
        if (merchant) {
            state.merchant = merchant.attrs;

            console.log("merchant is " + JSON.stringify(state.merchant));
        } else {
            state.merchant = null;
        }
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}