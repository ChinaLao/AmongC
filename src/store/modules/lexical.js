export default {
  namespaced: true,
  state: {
    byLineCode: [],
    lexeme: [],
  },
  getters: {
    SET_BY_LINE_CODE: (state) => state.byLineCode,
    LEXEME: (state) => state.lexeme,
  },
  mutations: {
    SET_BY_LINE_CODE(state, payload) {
      state.byLineCode = payload;
    },
    SET_LEXEME(state, payload) {
      state.lexeme = payload;
    },
  },
  actions: {
    GET_LEXEME({ commit }, payload) {
      try {
        const keywordDictionary = {
          IN: "IN",
          OUT: "OUT",
        };
        const symbolDictionary = {
          ";": "Terminator",
          ",": "Separator",
          ".": "decimal point; struct element accessor",
          '"': '"',
          "(": "(",
          ")": ")",
          "[": "[",
          "]": "]",
          "{": "{",
          "}": "}",
          ":": ":",
          "#": "Single line comment",
          "'": "'",
          "=": "=",
          "+": "+",
          "-": "-",
          "*": "*",
          "/": "/",
          "%": "%",
          ">": ">",
          "<": "<",
          "!": "!",
        };
        const code = payload.split("\n"); // returns an array of lines of code

        const byLineCode = code.map((mappedCode) => {
          return { token: mappedCode };
        }); // returns an array of object of lines of code

        let codeByWord = [];

        byLineCode.forEach((lineElement) => {
          const wordOnly = lineElement.token.split(/[%/*+-=!><;,.()\][{}:#\s]/);
          const symbolOnly = lineElement.token.split(/[A-Za-z 0-9]/);
          console.log(wordOnly, symbolOnly);
          wordOnly.forEach((wordElement) => {
            if (
              Object.prototype.hasOwnProperty.call(
                keywordDictionary,
                wordElement
              )
            ) {
              const obj = {
                word: wordElement,
                token: keywordDictionary[wordElement],
              };
              codeByWord.push(obj);
            }
          });
          symbolOnly.forEach((symbolElement) => {
            const symbols = symbolElement.split("");

            symbols.forEach((symbol) => {
              if (
                Object.prototype.hasOwnProperty.call(
                  symbolDictionary,
                  symbol
                )
              ) {
                const obj = {
                  word: symbol,
                  token: symbolDictionary[symbol],
                };
                codeByWord.push(obj);
              }
            });
          });
        }); // returns code split to words with tokens

        commit("SET_BY_LINE_CODE", byLineCode);
        commit("SET_LEXEME", codeByWord);

        return codeByWord;
      } catch (errorMsg) {
        console.log(errorMsg);
      }
    },
    CLEAR({ commit }) {
      const byLineCode = [];
      const lexeme = [];

      commit("SET_BY_LINE_CODE", byLineCode);
      commit("SET_LEXEME", lexeme);
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
