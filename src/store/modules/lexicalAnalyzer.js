const nearley = require("nearley");
const grammar = require("./grammar.js");

const moo = require("moo");

export default {
  namespaced: true,
  state: {
    lexeme: [],
    error: [],
    tokenStream: [],
    foundError: false,
    lexRules: {
      
      id: {match: /[a-z][a-zA-Z0-9]{0,14}/, type: moo.keywords({
        "int": "int",
        "dec": "dec",
        "struct": "struct",
        "str": "str",
        "bool": "bool",
        "empty": "empty",
        "shoot": "shoot",
        "scan": "scan",
        "if": "if",
        "else": "else",
        "elf": "elf",
        "stateSwitch": "switch",
        "vote": "vote",
        "default": "default",
        "for": "for",
        "while": "while",
        "do": "do",
        "kill": "kill",
        "control": "continue",
        "litBool": ["true", "false"],
        "return": "return",
        "and": "and",
        "or": "or",
        "vital": "vital",
        "task": "task",
        "clean": "clean",
      })},

      start: "IN",
      end: "OUT",

      newline: {match: /\n|\r\n|\r/, lineBreaks: true},
      whitespace: /[ \t]+/,

      litStr: /["].*["]/,
      singleComment: /#.*/,
      litDec: /[~]?[0-9]{1,9}[.][0-9]{1,5}/,
      negaLitInt: /[~][0-9]{1,9}/,
      litInt: /[0-9]{1,9}/,
      
      
      quote: /["].*/,
      terminator: ";",
      comma: ",",
      dot: ".",

      openParen: "(",
      closeParen: ")",
      openBrace: "{",
      closeBrace: "}",
      openBracket: "[",
      closeBracket: "]",
      colon: ":",
      increment: "++",
      decrement: "--",
      appendAssign: "+=", //added for string append
      minusEqual: "-=",
      exponentEqual: "**=",
      multiplyEqual: "*=",
      floorEqual: "//=",
      divideEqual: "/=",
      moduloEqual: "%=",
      isEqual: "==",
      isNotEqual: "!=",
      greaterEqual: ">=",
      lesserEqual: "<=",
      greater: ">",
      lesser: "<",
      equal: "=",
      append: "+",
      minus: "-",
      exponent: "**",
      multiply: "*",
      floor: "//",
      divide: "/",
      modulo: "%",
      not: "!",
      negative: "~",
      access: "@",
      invalid: /./
    },
    groups: [
      ["dataTypes", "int", "dec", "str", "bool", "empty"],
      ["literals", "litStr", "negaLitInt", "litInt", "litDec", "litBool"],
      ["mainFunc", "start", "end"],
      ["conditionals", "if", "else", "elf", "stateSwitch", "vote", "default"],
      ["loops", "for", "while", "do"],
      ["controls", "kill", "continue"],
      ["keywords", "struct", "return", "vital", "clean", "task"],
      ["inputOutput", "shoot", "scan"],
      ["logicals", "and", "or"],
      ["symbols", "access", "equal", "not", "colon", "terminator", "comma", "openBrace", "closeBrace", "openParen", "closeParen", "openBracket", "closeBracket", "negative", "dot"],
      ["arithOper", "minus", "multiply", "divide", "exponent", "floor", "modulo"],
      ["unary", "increment", "decrement"],
      ["append", "append"],
      ["assignOper", "minusEqual", "multiplyEqual", "divideEqual", "exponentEqual", "floorEqual", "moduloEqual"],
      ["appendAssign", "appendAssign"],
      ["comparison", "isEqual", "isNotEqual"],
      ["relationOper", "greater", "lesser", "greaterEqual", "lesserEqual"],
      ["others", "id", "singleComment", "quote", "EOF"]
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
      console.log(state.error, payload);
      state.error = payload;
      console.log(state.error, payload);
    },
    CLEAR_OUTPUTS(state) {
        state.error = state.lexeme = [];
        state.foundError = false;
    },
    CHANGE_ERROR(state, payload){
      state.foundError = payload;
    }
  },
  actions: {
    async LEXICAL({ state, commit, dispatch }, code){
      const results = {
        dataTypes: {
          int: {lex: "int"},
          dec: {lex: "dec"},
          str: {lex: "str"},
          bool: {lex: "bool"},
          empty: {lex: "empty"},
          delims: "whitespace",
          description: "Data Type Keyword",
        },
        literals: {
          litStr: {
            lex: "strLit",
            delims: ["appendAssign", "comma", "terminator", "closeParen", "closeBrace", "access", "colon", "append", "whitespace"],
            description: "String Literal",
          },
          negaLitInt: {
            lex: "intLit",
            delims: ["minus", "multiply", "divide", "exponent", "floor", "modulo", "greater", "lesser", "greaterEqual", "lesserEqual", "closeParen", "colon", "isEqual", "isNotEqual", "closeBrace", "comma", "terminator", "whitespace", "append"],
            description: "Integer Literal",
          },
          litInt: {
            lex: "intLit",
            delims: ["minus", "multiply", "divide", "exponent", "floor", "modulo", "greater", "lesser", "greaterEqual", "lesserEqual", "closeParen", "closeBracket", "colon", "isEqual", "isNotEqual", "closeBrace", "comma", "terminator", "whitespace", "append"],
            description: "Integer Literal",
          },
          litDec: {
            lex: "decLit",
            delims: ["minus", "multiply", "divide", "exponent", "floor", "modulo", "greater", "lesser", "greaterEqual", "lesserEqual", "closeParen", "isEqual", "isNotEqual", "closeBrace", "comma", "terminator", "whitespace", "append"],
            description: "Decimal Literal",
          },
          litBool: {
            lex: "boolLit",
            delims: ["closeBrace", "closeParen", "comma", "terminator", "whitespace"],
            description: "Boolean Literal",
          },
        },
        mainFunc: {
          start: {
            lex: "IN",
            delims: ["newline", "whitespace"],
            description: "Start of Main Function Keyword",
          },
          end: {
            lex: "OUT",
            delims: ["whitespace", "newline", "EOF"],
            description: "End of Main Function Keyword",
          },
        },
        conditionals: {
          if: {
            lex: "if",
            delims: ["whitespace", "openParen"],
            description: "If Keyword",
          },
          else: {
            lex: "else",
            delims: ["whitespace", "newline", "openBrace"],
            description: "Else Keyword",
          },
          elf: {
            lex: "elf",
            delims: ["whitespace", "openParen"],
            description: "Else If Keyword",
          },
          stateSwitch: {
            lex: "switch",
            delims: ["openParen", "whitespace"],
            description: "Switch Keyword",
          },
          vote: {
            lex: "vote",
            delims: "whitespace",
            description: "Case Keyword",
          },
          default: {
            lex: "default",
            delims: ["colon", "whitespace"],
            description: "Default Keyword",
          },
        },
        loops: {
          for: {
            lex: "for",
            delims: ["openParen", "whitespace"],
            description: "For Loop Keyword",
          },
          while: {
            lex: "while",
            delims: ["openParen", "whitespace"],
            description: "While Loop Keyword",
          },
          do: {
            lex: "do",
            delims: ["openBrace", "whitespace", "newline"],
            description: "Do-While Loop Keyword",
          },
        },
        controls: {
          kill: {lex: "kill"},
          control: {lex: "continue"},
          delims: "terminator",
          description: "Control Keyword",
        },
        keywords: {
          struct: {
            lex: "struct",
            delims: "whitespace",
            description: "Struct Keyword",
          },
          return: {
            lex: "return",
            delims: ["terminator", "openParen", "whitespace"],
            description: "Return Keyword",
          },
          vital: {
            lex: "vital",
            delims: "whitespace",
            description: "Constant Keyword",
          },
          clean: {
            lex: "clean",
            delims: "openParen",
            description: "Clear Screen Function Keyword",
          },
          task: {
            lex: "task",
            delims: "whitespace",
            description: "Function Keyword",
          },
        },
        inputOutput: {
          shoot: {
            lex: "shoot",
            delims: "openParen",
            description: "Output Keyword",
          },
          scan: {
            lex: "scan",
            delims: "openParen",
            description: "Input Keyword",
          },
        },
        logicals: {
          and: {lex: "and"},
          or: {lex: "or"},
          delims: "whitespace",
          description: "Logical Keyword",
        },
        symbols: {
          access: {
            lex: "@",
            delims: "openBracket",
            description: "String Accessor Operator",
          },
          equal: {
            lex: "=",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "id", "whitespace", "openBrace", "not", "increment", "decrement"],
            description: "Assignment Operator",
          },
          not: {
            lex: "!",
            delims: ["negative", "openParen", "id", "whitespace", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "increment", "decrement", "not"],
            description: "Negation Operator",
          },
          colon: {
            lex: ":",
            delims: ["whitespace", "newline"],
            description: "Case Operator",
          },
          terminator: {
            lex: ";",
            delims: ["increment", "decrement", "id", "openParen", "closeParen", "terminator", "whitespace", "newline", "singleComment", "not"],
            description: "Terminator Operator",
          },
          comma: {
            lex: ",",
            delims: ["increment", "decrement", "not", "openBrace", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "negative", "int", "dec", "str", "bool"],
            description: "Separator Operator",
          },
          openBrace: {
            lex: "{",
            delims: ["increment", "decrement", "litStr", "not", "negative", "openParen", "openBrace", "closeBrace", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "newline", "singleComment"],
            description: "Start Operator of a Statement Block",
          },
          closeBrace: {
            lex: "}",
            delims: ["comma", "terminator", "closeBrace", "singleComment", "whitespace", "newline", "while", "EOF"],
            description: "End Operator of a Statement Block",
          },
          openParen: {
            lex: "(",
            delims: ["negative", "litStr", "closeParen", "not", "openParen", "terminator", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "int", "dec", "str", "bool", "increment", "decrement"],
            description: "Start Operator of an Expression",
          },
          closeParen: {
            lex: ")",
            delims: ["comma", "terminator", "minus", "multiply", "divide", "exponent", "floor", "modulo", "append", "isEqual", "isNotEqual", "closeParen", "closeBracket", "closeBrace", "greater", "lesser", "greaterEqual", "lesserEqual", "whitespace", "openBrace", "newline", "access", "colon"],
            description: "End Operator of an Expression",
          },
          openBracket: {
            lex: "[",
            delims: ["openParen", "litInt", "id", "whitespace", "increment", "decrement", "closeBracket"],
            description: "Start Operator of an Array Size / String Access",
          },
          closeBracket: {
            lex: "]",
            delims: ["dot", "append", "minus", "multiply", "divide", "exponent", "floor", "modulo", "appendAssign", "minusEqual", "multiplyEqual", "divideEqual", "exponentEqual", "floorEqual", "moduloEqual", "increment", "decrement", "openBracket", "closeBracket", "terminator", "comma", "isEqual", "isNotEqual", "greater", "lesser", "greaterEqual", "lesserEqual", "closeBrace", "equal", "whitespace", "closeParen", "colon", "access"],
            description: "End Operator of an Array Size / String Access",
          },
          negative: {
            lex: "~",
            delims: ["id", "openParen"],
            description: "Negative Operator",
          },
          dot: {
            lex: ".",
            delims: "id",
            description: "Struct Element Accessor Operator",
          },
        },
        arithOper:{
          minus: {lex: "-"},
          multiply: {lex: "*"},
          divide: {lex: "/"},
          exponent: {lex: "**"},
          floor: {lex: "//"},
          modulo: {lex: "%"},
          delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
          description: "Arithmetic Operator",
        },
        unary: {
          increment: {lex: "++"},
          decrement: {lex: "--"},
          delims: ["closeBracket", "closeParen", "closeBrace", "comma", "terminator", "id", "whitespace", "greater", "lesser", "greaterEqual", "lesserEqual", "isEqual", "isNotEqual"],
          description: "Unary Operator",
        },
        append: {
          append: {
            lex: "+",
            delims: ["negative", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
            description: "Arithmetic / Append Operator",
          },
        },
        assignOper: {
          minusEqual: {lex: "-="},
          exponentEqual: {lex: "**="},
          multiplyEqual: {lex: "*="},
          floorEqual: {lex: "//="},
          divideEqual: {lex: "/="},
          moduloEqual: {lex: "%="},
          delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
          description: "Assignment with Arithmetic / Append Operator",
        },
        appendAssign: {
          appendAssign: {
            lex: "+=",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "litStr"],
            description: "Assignment with Arithmetic Operator",
          },
        },
        comparison: {
          isEqual: {lex: "=="},
          isNotEqual: {lex: "!="},
          delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litBool", "litStr", "id", "whitespace","not"],
          description: "Relational Operator",
        },
        relationOper: {
          greaterEqual: {lex: ">="},
          lesserEqual: {lex: "<="},
          greater: {lex: ">"},
          lesser: {lex: "<"},
          delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "not"],
          description: "Relational Operator",
        },
        others: {
          id: {
            lex: "id",
            delims: ["openBracket", "openParen", "increment", "decrement", "appendAssign", "minusEqual", "multiplyEqual", "divideEqual", "exponentEqual", "floorEqual", "moduloEqual", "greater", "lesser", "greaterEqual", "lesserEqual", "equal", "append", "minus", "multiply", "divide", "exponent", "floor", "modulo", "closeParen", "closeBracket", "whitespace", "isEqual", "isNotEqual", "dot", "terminator", "comma", "openBrace", "closeBrace", "access"],
            description: "Identifier",
          },
          singleComment: {
            lex: "comment",
            delims: "newline",
            description: "Single-line Comment",
          },
          quote: {
            lex: "",
            delims: "",
            description: "",
          },
          EOF: {
            delims: "",
            description: "End of File",
          }
        }
      };
      const tokenStream = [];
      const final = [];
      const parser = moo.compile(state.lexRules);
      let reader = parser.reset(code);
      const errors = [];

      let token = " ";

      while(token){
        console.log(token);
        try{
          token = reader.next();
          if(token){
            const group = token.type !== "invalid" && token.type !== "whitespace" && token.type !== "newline"
              ? await dispatch('FIND_GROUP', token.type)
              : null;
            console.log(group, results[group])
            tokenStream.push({
              word: token.value,
              token: token.type,
              lex: token.type !== "invalid" && token.type !== "whitespace" && token.type !== "newline" && group
                ? results[group][token.type].lex
                : token.type,
              delims: group
                ? results[group].delims !== undefined
                  ? results[group].delims
                  : results[group][token.type].delims
                : "",
              description: group
                ? results[group].description !== undefined
                  ? results[group].description
                  : results[group][token.type].description
                : "",
              line: token.line,
              col: token.col,
            });
          }
        }
        catch(error){
          console.log(error);
        }
      }
      const last = tokenStream[tokenStream.length-1];
      tokenStream.push({
        word: "EOF",
        token: "EOF",
        lex: "EOF",
        line: last.line+1,
        col: 1
      })
      let index = 0;
      console.log(tokenStream);
      while(index < tokenStream.length){
        try{
          const current = tokenStream[index];
          const next = tokenStream[index+1]
          const currentToken = current.token;
          const nextToken = next ? next.token : "";
          const currentDelims = current.delims;
          console.log(currentDelims, currentToken, next, currentToken !== "invalid");
          if(nextToken !== "EOF" && currentToken !== "EOF")
          {
            let missingQuote = false;
            if(currentToken !== "whitespace" &&
                currentToken !== "newline" &&
                currentToken !== "invalid" && 
                currentDelims && currentDelims.includes(nextToken)
            ) final.push(current);
            else if(currentToken !== "whitespace" && currentToken !== "newline"){
              let message, expectations = "-";
              if(currentToken === "litInt" && (nextToken === "litInt" || nextToken === "litDec")){
                message = "Limit exceeded";
                expectations = "Integer should not exceed 9 place values"
              }else if(currentToken === "litDec" && nextToken === "litInt"){
                message = "Limit exceeded";
                expectations = "Decimal should not exceed 5 place values"
              }else if(currentToken === "id" && (nextToken === "id" || nextToken === "litInt")){
                message = "Limit exceeded";
                expectations = "Identifier should not exceed 15 characters"
              }else if(currentToken === "quote"){
                missingQuote = true;
              }else{
                const nextWord = nextToken !== "whitespace" && nextToken !== "newline"
                  ? next.word
                  : nextToken;
                const currentWord = currentToken !== "whitespace" && currentToken !== "newline"
                  ? current.word
                  : currentToken;

                message = `Invalid delimiter: ${nextWord} after: ${currentWord}`;
                expectations = currentToken !== "invalid"
                  ? await dispatch('GET_EXPECTATIONS', results, currentDelims)
                  : "-";
              }

              if(missingQuote || currentToken === "invalid")
                errors.push({
                  type: "lex-error",
                  msg: `Invalid Keyword: ${current.word}`,
                  line: current.line,
                  col: current.col,
                  exp: "-"
                });
              
              else
                errors.push({
                  type: "lex-error",
                  msg: message,
                  line: next.line,
                  col: next.col,
                  exp: expectations
                });
            }
          } else if(currentToken !== "" && currentToken !== "whitespace" && currentToken !== "newline"){
            if(currentToken === "invalid"){
              errors.push({
                type: "lex-error",
                msg: `Invalid Keyword: ${current.word}`,
                line: current.line,
                col: current.col,
                exp: "-"
              });
            }else if((currentDelims && currentDelims.includes(nextToken)) || currentToken === "EOF"){
              final.push(current);
            }else{
              const nextWord = next.word;
              const currentWord = currentToken !== "whitespace" && currentToken !== "newline"
                ? current.word
                : currentToken;
              console.log(nextWord, currentWord);
              errors.push({
                type: "lex-error",
                msg: `Invalid delimiter: ${nextWord} after: ${currentWord}`,
                line: current.line,
                col: current.col,
                exp: await dispatch('GET_EXPECTATIONS', results, currentDelims)
              });
            }
          }
          index++;
        }catch(err){
          console.log(err);
          errors.push({
            type: "programmer-error",
            msg: `Missing delimiter rule`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-"
          });
        }
      }
      console.log(errors);
      commit("SET_LEXEME", final);
      commit("SET_ERROR", errors);
      if(errors.length > 0) commit("CHANGE_ERROR", true);
    },
    async SYNTAX({ state, commit }) {
      if(!state.foundError)
      {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const lexeme = state.lexeme;
        let index = 0;
        let synError = false;
        while(index < lexeme.length && !synError) {
          try {
            parser.feed(lexeme[index].token);
            console.log(parser.results);
            console.log(lexeme[index].token, index);
          } catch (err) {
            const errors = [];
            errors.push({
              type: "syn-error",
              msg: `Unexpected token: ${lexeme[index].lex} (${lexeme[index].word})`,
              line: lexeme[index].line,
              col: lexeme[index].col,
              exp: "-"
            });
            commit("SET_ERROR", errors);
            synError = true;
          }
          index++;
        }
        console.log(parser.results);
      }
      
    },
    async GET_EXPECTATIONS(results, delimiters){
      let i = 0;
      let expectations = "";
      if(typeof(delimiters) === "string")
        expectations = delimiters !== "whitespace" && delimiters !== "newline"
          ? results[await dispatch('FIND_GROUP', delimiters)].lex
          : delimiters;
      else{
        while(i < delimiters.length && i < 3){
          expectations +=  delimiters[i] !== "whitespace" && delimiters[i] !== "newline"
            ? results[await dispatch('FIND_GROUP', delimiter[i])].lex
            : delimiters[i];
          if(i < delimiters.length-1 && i < 2) expectations += " / ";
          i++;
        }
        if (delimiters.length > 3) expectations += " etc..."
      }
      return expectations;
    },
    async FIND_GROUP({ state }, token){
      const groups = state.groups;
      const found = groups.find(group => group.includes(token));
      if (found) return found[0];
    },
    async FIND_DELIMS(group, token){
      if(group.delims !== undefined) return group.delims;
      else return token.delims;
    }
  },
};