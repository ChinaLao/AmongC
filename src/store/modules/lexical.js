/* eslint-disable no-prototype-builtins */
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
          // };
          // const symbolDictionary = {
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
        let codeByWord = [];
        code.forEach((line, index) => {
          let keyword = "";
          let splitCode = [];
          let quoteCounter = 0;
          let isPartOfStr = false;
          for (let counter = 0; counter < line.length; counter++) {
            if (line.charAt(counter).match(/[A-Za-z0-9"]/g) && !isPartOfStr) {
              // for keywords
              console.log(counter, line.charAt(counter));
              if (line.charAt(counter) === '"') {
                isPartOfStr = true;
                counter--;
              } else keyword += line.charAt(counter);
            } else if (isPartOfStr || line.charAt(counter) === '"') {
              // for string literals
              console.log(counter, line.charAt(counter));
              while (quoteCounter !== 2 && counter < line.length) {
                keyword += line.charAt(counter);
                if (line.charAt(counter) === '"') quoteCounter++;
                if (quoteCounter === 2) {
                  const obj = {
                    word: keyword,
                    line: index + 1,
                  };
                  keyword = "";
                  isPartOfStr = false;
                  splitCode.push(obj);
                }
                if (line.charAt(counter) === '"') {
                  const obj = {
                    word: line.charAt(counter),
                    line: index + 1,
                  };
                  splitCode.push(obj);
                  if (quoteCounter === 2) {
                    isPartOfStr = false;
                  }
                }
                counter++;
              }
              quoteCounter = 0;
              counter--;
            } else {
              // to push the remaining part of keyword whenever a symbol is encountered
              console.log(counter, line.charAt(counter));
              if (keyword !== "" && keyword !== " " && keyword !== "\t") {
                const obj = {
                  word: keyword,
                  line: index + 1,
                };
                splitCode.push(obj);
                keyword = "";
              }
            }
            if (
              // for symbols
              line.charAt(counter).match(/[^A-Za-z0-9" \t]/g) &&
              !isPartOfStr
            ) {
              console.log(counter, line.charAt(counter));
              const obj = {
                word: line.charAt(counter),
                line: index + 1,
              };
              splitCode.push(obj);
            }
          }
          if (keyword !== "") {
            // to push the remaining keywords
            const obj = {
              word: keyword,
              line: index + 1,
            };
            splitCode.push(obj);
          }
          // reset all values
          keyword = "";
          quoteCounter = 0;
          isPartOfStr = false;

          // search all found words and their tokens
          splitCode.forEach((wordElement) => {
            const finalObj = {
              word: wordElement.word,
              line: wordElement.line,
            };
            if (keywordDictionary.hasOwnProperty(finalObj.word))
              finalObj.token = keywordDictionary[finalObj.word];
            else if (finalObj.word.match(/"/g))
              finalObj.token = "String Literal";
            codeByWord.push(finalObj);
          });
          splitCode = [];
        });

        commit("SET_BY_LINE_CODE", code);
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
  },
};
