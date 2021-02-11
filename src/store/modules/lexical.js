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
          IN: "Main Start",
          OUT: "Main End",
          int: "Integer Data Type",
          dec: "Decimal Data Type",
          str: "String Data Type",
          bool: "Boolean Data Type",
          empty: "Void Data Type",
          struct: "Data Structure",
          shoot: "Output Keyword",
          scan: "Input Keyword",
          if: "If Condition Keyword",
          else: "Else Condition Keyword",
          elf: "Else If Condition Keyword",
          switch: "Switch Condition Keyword",
          vote: "Switch Case",
          default: "Switch Case Default",
          for: "For Loop Keyword",
          while: "While Loop Keyword",
          do: "Do While Loop Keyword",
          kill: "Break Control Keyword",
          continue: "Continue Control Keyword",
          true: "Boolean True Value",
          false: "Boolean False Value",
          return: "Return Keyword",
          and: "Logical And Keyword",
          or: "Logical Or Keyword",
          vital: "Declare Constant Keyword",
          task: "Declare Function Keyword",
          clean: "Clear Screen Keyword",
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
                Object.prototype.hasOwnProperty.call(symbolDictionary, symbol)
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
