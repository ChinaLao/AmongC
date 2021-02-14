const JisonLex = require("jison-lex");
// const Parser = require("jison").Parser;
const nearley = require("nearley");
const grammar = require("./grammar.js");

export default {
  namespaced: true,
  state: {
    lexeme: [],
    error: [],
    lexRules: [
      ["\\s+", "/* skip whitespace */"],
      ['^[\\"].+[\\"]?', "return 'litStr';"],
      ["^[#].+$", "return 'singleComment';"],
      ["^[0-9]+[.][0-9]+$", "return 'litDec';"],
      ["^[0-9]+$", "return 'litInt';"],

      ["^[I][N]$", "return 'start';"],
      ["^[O][U][T]$", "return 'end';"],
      ["^[i][n][t]$", "return 'int';"],
      ["^[d][e][c]$", "return 'dec';"],
      ["^[s][t][r][u][c][t]$", "return 'struct';"],
      ["^[s][t][r]$", "return 'str';"],
      ["^[b][o][o][l]$", "return 'bool';"],
      ["^[e][m][p][t][y]$", "return 'empty';"],
      ["^[s][h][o][o][t]$", "return 'shoot';"],
      ["^[s][c][a][n]$", "return 'scan';"],
      ["^[i][f]$", "return 'if';"],
      ["^[e][l][s][e]$", "return 'else';"],
      ["^[e][l][f]$", "return 'elf';"],
      ["^[s][w][i][t][c][h]$", "return 'stateSwitch';"],
      ["^[v][o][t][e]$", "return 'vote';"],
      ["^[d][e][f][a][u][l][t]$", "return 'default';"],
      ["^[f][o][r]$", "return 'for';"],
      ["^[w][h][i][l][e]$", "return 'while';"],
      ["^[d][o]$", "return 'do';"],
      ["^[k][i][l][l]$", "return 'kill';"],
      ["^[c][o][n][t][i][n][u][e]$", "return 'control';"],
      ["^[t][r][u][e]$", "return 'litBool';"],
      ["^[f][a][l][s][e]$", "return 'litBool';"],
      ["^[r][e][t][u][r][n]$", "return 'return';"],
      ["^[a][n][d]$", "return 'and';"],
      ["^[o][r]$", "return 'or';"],
      ["^[v][i][t][a][l]$", "return 'vital';"],
      ["^[t][a][s][k]$", "return 'task';"],
      ["^[c][l][e][a][n]$", "return 'clean';"],

      ["^[;]$", "return 'terminator';"],
      ["^[,]$", "return 'comma';"],
      ["^[.]$", "return 'dot';"],
      ['^[\\"]$', "return 'quote';"],
      ["^[\\(]$", "return 'openParen';"],
      ["^[\\)]$", "return 'closeParen';"],
      ["^[{]$", "return 'openBrace';"],
      ["^[}]$", "return 'closeBrace';"],
      ["^[\\[]$", "return 'openBracket';"],
      ["^[\\]]$", "return 'closeBracket';"],
      ["^[\\:]$", "return 'colon';"],
      ["^[#]$", "return 'sharp';"],
      ["^[=][=]$", "return 'relationOper';"],
      ["^[>][=]$", "return 'relationOper';"],
      ["^[<][=]$", "return 'relationOper';"],
      ["^[!][=]$", "return 'relationOper';"],
      ["^[\\+][=]$", "return 'assignOper';"],
      ["^[-][=]$", "return 'assignOper';"],
      ["^[/][/][=]$", "return 'assignOper';"],
      ["^[/][=]$", "return 'assignOper';"],
      ["^[%][=]$", "return 'assignOper';"],
      ["^[=]$", "return 'equal';"],
      ["^[\\+][\\+]$", "return 'unary';"],
      ["^[\\+]$", "return 'arithOper';"],
      ["^[-][-]$", "return 'unary';"],
      ["^[-]$", "return 'arithOper';"],
      ["^[/][/]$", "return 'arithOper';"],
      ["^[/]$", "return 'arithOper';"],
      ["^[%]$", "return 'arithOper';"],
      ["^[>]$", "return 'relationOper';"],
      ["^[<]$", "return 'relationOper';"],
      ["^[*][*][=]$", "return 'assignOper';"],
      ["^[*][*]$", "return 'arithOper';"],
      ["^[*][=]$", "return 'assignOper';"],
      ["^[*]$", "return 'arithOper';"],
      ["^[!]$", "return 'not';"],

      ["[a-z][a-zA-Z0-9]*$", "return 'id';"],
    ],
  },
  getters: {
    LEXEME: (state) => state.lexeme,
    ERROR: (state) => state.error,
  },
  mutations: {
    SET_LEXEME(state, payload) {
      state.lexeme = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    TEMPORARY_SYNTAX({ state, commit }) {
      console.log("a");
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      console.log("b");
      let errArray = [];
      const lexeme = state.lexeme;
      console.log("c");
      lexeme.forEach((lex, index) => {
        try {
          console.log(lex.word, lex.token);
          parser.feed(lex.token);
          console.log(parser.entries, parser.results);
        } catch (err) {
          const errors = {
            msg: err.message,
            line: lex.line,
          };
          errArray.push(errors);
          commit("SET_ERROR", errArray);
        }
        console.log("loop ", index);
      });
      // try {
      //   parser.feed(state.lexeme);
      //   console.log(parser.results.length);
      //   console.log(parser.results);
      // } catch (err) {
      //   console.log(err.message);

      // }
    },

    GET_SYNTAX({ state, commit }, payload) {
      const grammar = {
        rules: state.lexRules,
      };

      const lexer = new JisonLex(grammar);
      const codeByLine = payload.split("\n");
      let Lexemes = [];
      let index = 0;
      let keyword = "";

      codeByLine.forEach((line, i) => {
        //read each line
        console.log(keyword);
        index = 0;
        keyword = "";
        console.log(line.length);

        while (index < line.length) {
          //read character per line
          keyword = "";
          console.log(line[index], index, keyword);

          while (line[index] && line[index].match(/[^a-zA-Z0-9\s"]/g)) {
            // symbols
            let symbol = "";
            symbol += line[index];
            if (line[index] === "#") {
              //single line comment
              while (index < line.length) {
                keyword += line[index];
                index++;
              }
            }
            if (line[index] && line[index].match(/[+-=/*!%><]/g)) {
              //operators
              if (
                line[index] === line[index + 1] &&
                !line[index].match(/[!%><]/g)
              ) {
                //++,--,==,//,**
                index++;
                symbol += line[index];
                console.log(symbol);
              } else if (line[index + 1] === "=") {
                //+=,-=,*=,/=,%=,>=,<=,!=
                index++;
                symbol += line[index];
                console.log(symbol);
              }
              if (
                (symbol === "//" || symbol === "**") &&
                line[index + 1] === "="
              ) {
                // //=,**=
                index++;
                symbol += line[index];
                console.log(symbol);
              }
            }

            // lexer.setInput(symbol);
            const obj = {
              word: symbol,
              // token: lexer.lex(),
              line: i + 1,
            };
            Lexemes.push(obj);
            index++;
          }

          while (line[index] && line[index].match(/[a-zA-Z0-9."]/g)) {
            // for keywords and identifiers
            let isPartOfStr = false;
            let quoteCounter = 0;
            if (line[index] === '"') {
              isPartOfStr = true;
              quoteCounter++;
              // lexer.setInput(line[index]);
              const obj = {
                word: line[index],
                // token: lexer.lex(),
                line: i + 1,
              };
              Lexemes.push(obj);
            }
            while ((isPartOfStr || quoteCounter === 1) && index < line.length) {
              //str literal
              keyword += line[index];
              index++;
              if (line[index] === '"') {
                quoteCounter++;
                isPartOfStr = false;
                keyword += line[index];
                // lexer.setInput(keyword);
                const keyObj = {
                  word: keyword,
                  // token: lexer.lex(),
                  line: i + 1,
                };
                Lexemes.push(keyObj);
                keyword = "";
                // lexer.setInput(line[index]);
                const obj = {
                  word: line[index],
                  // token: lexer.lex(),
                  line: i + 1,
                };
                Lexemes.push(obj);
                index++;
              }
            }
            console.log(line[index]);
            if (
              !isPartOfStr &&
              line[index] &&
              line[index].match(/[a-zA-Z0-9.]/g)
            ) {
              //struct
              console.log(line[index], index, keyword);
              if (
                line[index] === "." &&
                keyword !== "" &&
                !keyword.match(/^[0-9]+$/g)
              ) {
                //struct element
                // lexer.setInput(keyword);
                const obj = {
                  word: keyword,
                  // token: lexer.lex(),
                  line: i + 1,
                };
                Lexemes.push(obj);
                // lexer.setInput(line[index]);
                const dotObj = {
                  word: line[index],
                  // token: lexer.lex(),
                  line: i + 1,
                };
                Lexemes.push(dotObj);
                index++;
                keyword = "";
              }
              if (!line[index].match(/\s/g)) {
                //to continue reading after .
                console.log(line[index], index, keyword);
                keyword += line[index];
              }
              index++;
            }
          }
          while (line[index] && line[index].match(/\s/g)) index++; // to skip spaces
          console.log(line[index], index, keyword);
          if (keyword !== "") {
            // to skip pushing blank
            // lexer.setInput(keyword);
            const obj = {
              word: keyword,
              // token: lexer.lex(),
              line: i + 1,
            };
            Lexemes.push(obj);
          }
        }
      });
      Lexemes.forEach((lexeme) => {
        try {
          console.log(lexeme.word, lexeme.line);
          lexer.setInput(lexeme.word);
          lexeme.token = lexer.lex();
          console.log(lexeme.word, lexeme.token, lexeme.line);
        } catch (err) {
          console.log(err);
          lexeme.token = "Unknown";
        }
      });
      commit("SET_LEXEME", Lexemes);
    },
    CLEAR({ state, commit }) {
      const blank = [];
      commit("SET_LEXEME", blank);
      commit("SET_ERROR", blank);
    },
  },
};
