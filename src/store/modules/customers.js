import api from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
    me: null,
}

// getters
const getters = {
    me: state => state.me,
}

// actions
const actions = {
    login ({ commit }, id) {
        return new Promise(function(resolve, reject) {
            api.queryOne("Customer", id).then(function(customer) {
                commit(types.CHANGE_CUSTOMER, customer)
                
                resolve(customer)
            }, function(err){
                reject(err);
            })
        })
    },

    logout ({ commit }) {
        commit(types.CHANGE_CUSTOMER, null);
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
}

export default {
    state,
    getters,
    actions,
    mutations
}