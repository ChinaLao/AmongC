export default {
  namespaced: true,
  state: {
    lexeme: [],
  },
  getters: {
    LEXEME: (state) => state.lexeme,
  },
  mutations: {
    SET_LEXEME(state, payload) {
      state.lexeme = payload;
    },
  },
  actions: {
    GET_LEXEME({ commit }, payload) {
      try {
        commit("SET_LEXEME", payload);
        return payload;
      } catch (errorMsg) {
        console.log(errorMsg);
      }
    },
    // async GET_DISCOUNT_LIST({ commit }) {
    //     try{
    //         const discountListRef = await DB.collection('providers')
    //             .doc('settings')
    //             .collection('pieces_discount')
    //             .get();

    //         const discounts = discountListRef.docs.map(discount => {
    //             const data = discount.data();
    //             data.id = discount.id;
    //             return data;
    //         });
    //         commit('SetDiscountList', discounts)
    //     } catch(error){
    //         throw error;
    //     }
    // },
    // async ADD_DISCOUNT({ commit }, payload){
    //     try {
    //         const discount = await DB.collection('providers').doc('settings').collection('pieces_discount').add(payload);
    //         payload.id = discount.id;
    //         commit('AddToDiscountList', payload);

    //     } catch(error) {
    //         throw error;
    //     }
    // },
    // async UPDATE_DISCOUNT({ commit }, payload) {
    //     const id = payload.id;
    //     delete payload.id;

    //     try {
    //       await DB.collection('providers').doc('settings').collection('pieces_discount').doc(id).update(payload);
    //       payload.id = id;
    //       console.log(payload);
    //       commit('UpdateDiscountList', payload);

    //     } catch(error) {
    //       throw error;
    //     }
    // },
  },
};
