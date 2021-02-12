// const parser = require("ebnf-parser");
// const Parser = require("jison").Parser;
const JisonLex = require("jison-lex");
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
    GET_SYNTAX({ state, commit }, payload) {
      //   const grammar = {
      //     lex: {
      //       rules: [
      //         ["\\s+", "/* skip whitespace */"],
      //         ["[a-f0-9]+", "return 'HEX';"],
      //       ],
      //     },
      //   };

      //   let parser = new Parser(grammar);

      //   //   let parserSource = parser.generate();

      //   parser.parse("adfe34bc e82a");

      //   parser.parse("adfe34bc zxg");
      const grammar = {
        rules: [
          ["\\s+", "/* skip whitespace */"],
          //   ["\\t+", "/* skip tab */"],

          ["IN", "return 'IN';"],
          ["OUT", "return 'OUT';"],
          ["int", "return 'int';"],
          ["dec", "return 'dec';"],
          ["str", "return 'str';"],
          ["bool", "return 'bool';"],
          ["empty", "return 'empty';"],
          ["struct", "return 'struct';"],
          ["shoot", "return 'shoot';"],
          ["scan", "return 'scan';"],
          ["if", "return 'if';"],
          ["else", "return 'else';"],
          ["elf", "return 'elf';"],
          ["switch", "return 'switch';"],
          ["vote", "return 'vote';"],
          ["default", "return 'default';"],
          ["for", "return 'for';"],
          ["while", "return 'while';"],
          ["do", "return 'do';"],
          ["kill", "return 'kill';"],
          ["continue", "return 'continue';"],
          ["true", "return 'true';"],
          ["false", "return 'false';"],
          ["return", "return 'return';"],
          ["and", "return 'and';"],
          ["or", "return 'or';"],
          ["vital", "return 'vital';"],
          ["true", "return 'true';"],
          ["task", "return 'task';"],
          ["clean", "return 'clean';"],

          [";", "return ';';"],
          [",", "return ',';"],
          [".", "return '.';"],
          ['\\"', "return '\"';"],
          ["\\(", "return '(';"],
          ["\\)", "return ')';"],
          ["{", "return '{';"],
          ["}", "return '}';"],
          ["\\[", "return '[';"],
          ["\\]", "return ']';"],
          ["\\:", "return ':';"],
          ["#", "return '#';"],
          ["\\'", 'return "\'";'],
          ["==", "return '==';"],
          [">=", "return '>=';"],
          ["<=", "return '<=';"],
          ["!=", "return '!=';"],
          ["\\+=", "return '+=';"],
          ["-=", "return '-=';"],
          ["\\*\\*=", "return '**=';"],
          ["//=", "return '//=';"],
          ["/=", "return '/=';"],
          ["%=", "return '%=';"],
          ["=", "return '=';"],
          ["\\+\\+", "return '++';"],
          ["\\+", "return '+';"],
          ["--", "return '--';"],
          ["-", "return '-';"],
          ["\\*\\*", "return '**';"],
          ["\\*", "return '*';"],
          ["//", "return '//';"],
          ["/", "return '/';"],
          ["%", "return '%';"],

          ["#.+", "return 'comment';"],
          ["[a-z]+[a-zA-Z0-9]*", "return 'identifier';"],
          ["\\'\\'\\'.+\\'\\'\\'", "return 'comment';"],
          ["^[0-9]+[.]?[0-9]+$", "return 'dec_literal';"],
          ['\\".+\\"', "return 'str_literal';"],
          ["^[0-9]+[.]?[0-9]+$", "return 'dec_literal';"],
          ["[0-9]+", "return 'int_literal';"],
        ],
      };
      const lexer = new JisonLex(grammar);
      const codeByLine = payload.split("\n");
      let tokenizedLexer = [];
      let index = 0;
      let keyword = "";
      codeByLine.forEach((line, i) => {
        console.log(keyword);
        index = 0;
        keyword = ""; //pag nabasa niya yung unang keyword sa isang line, nagnenext line na siya, di niya na binabasa yung iba sadge
        while (index < line.length && line[index].match(/[A-Za-z]/g)) {
          //all symbols naka not A-Z and not 0-9
          console.log(line[index], index, keyword);
          keyword += line[index];
          index++; //i always forgetti this
        }
        console.log(keyword);
        lexer.setInput(keyword);
        const obj = {
          word: keyword,
          token: lexer.lex(),
          line: i + 1,
        };
        tokenizedLexer.push(obj);
      });
      //   for (let i = 0; i < codeByLine.length; i++) {
      //     console.log(keyword);
      //     index = 0;
      //     keyword = "";
      //     while (codeByLine[index] && codeByLine[index].match(/[A-Za-z]/g)) {
      //       //all symbols naka not A-Z and not 0-9
      //       console.log(codeByLine[index], index, keyword);
      //       keyword += codeByLine[index];
      //       index++; //i always forgetti this
      //     }
      //     console.log(keyword);
      //     lexer.setInput(keyword);
      //     const obj = {
      //       word: keyword,
      //       token: lexer.lex(),
      //       line: i + 1,
      //     };
      //     tokenizedLexer.push(obj);
      //   }
      //   lexer.setInput(payload);
      //   console.log(payload, lexer.length, lexer);
      //   let tokenizedLexer = [];
      //   for (let i = 0; i < payload.length; i++) {
      //     const obj = {
      //       word: payload[i],
      //       token: lexer.lex(),
      //       line: 1,
      //     };
      //     tokenizedLexer.push(obj);
      //     console.log(tokenizedLexer, obj, payload[0], lexer.length);
      //   }
      commit("SET_LEXEME", tokenizedLexer);
      //   lexer.setInput("#hello \\n '''hello'''");
      //   console.log(lexer.lex());
      //   console.log(lexer.lex());
      //   console.log(lexer.lex());
    },
  },
};
