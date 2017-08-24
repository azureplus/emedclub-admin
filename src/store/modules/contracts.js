import api from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
    my: [],
}

// getters
const getters = {
    myContracts: state => state.my,
}

// actions
const actions = {
    setActiveContracts({ commit, state }, contracts) {
        commit(types.RECEIVE_MY_CONTRACTS_SUCCESS, contracts)
    },
    
    newContract({ commit, dispatch, rootState }, contract) {
        commit(types.NEW_CONTRACT, contract)
        return dispatch("changeCustomer", {total_contracts: rootState.customers.me.total_contracts + 1});
    },

    joinContract({ commit, dispatch, rootState }, contract) {
        commit(types.JOIN_CONTRACT, contract);
        return dispatch("changeCustomer", {total_contracts: rootState.customers.me.total_contracts + 1});
    },

    exitContract({ commit, dispatch, rootState }, contract) {
        commit(types.EXIT_CONTRACT, contract);
        return dispatch("changeCustomer", {total_contracts: rootState.customers.me.total_contracts - 1});
    },
}

// mutations
const mutations = {
    [types.RECEIVE_MY_CONTRACTS_SUCCESS](state, contracts) {
        state.my = contracts
    },

    [types.NEW_CONTRACT](state, contract) {
        state.my.splice(0, 0, contract);
    },

    [types.JOIN_CONTRACT](state, contract) {
        state.my.splice(0, 0, contract);
    },

    [types.EXIT_CONTRACT](state, contract) {
        state.my.splice(state.my.findIndex(function (c, index, arr) {
            return c.id === contract.id;
        }), 1);
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}