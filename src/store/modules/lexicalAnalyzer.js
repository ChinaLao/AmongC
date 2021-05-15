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
      unary: ["++", "--"],
      appendAssign: "+=", //added for string append
      assignOper: ["-=", "**=", "*=", "//=", "/=", "%="],
      comparison: ["==", "!="],
      relationOper: [">=", "<=", ">", "<"],
      equal: "=",
      append: "+",
      arithOper: [ "-", "**", "*", "//", "/", "%"],
      not: "!",
      negative: "~",
      access: "@",
      invalid: /./
    },
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
          litStr: {
            lex: "strLit",
            delims: ["appendAssign", "comma", "terminator", "closeParen", "closeBrace", "access", "colon", "append", "whitespace"],
            description: "String Literal",
          },
          negaLitInt: {
            lex: "intLit",
            delims: ["arithOper", "relationOper", "closeParen", "colon", "comparison", "closeBrace", "comma", "terminator", "whitespace", "append"],
            description: "Integer Literal",
          },
          litInt: {
            lex: "intLit",
            delims: ["arithOper", "relationOper", "closeParen", "closeBracket", "colon", "comparison", "closeBrace", "comma", "terminator", "whitespace", "append"],
            description: "Integer Literal",
          },
          litDec: {
            lex: "decLit",
            delims: ["arithOper", "relationOper", "closeParen", "comparison", "closeBrace", "comma", "terminator", "whitespace", "append"],
            description: "Decimal Literal",
          },
          litBool: {
            lex: "boolLit",
            delims: ["closeBrace", "closeParen", "comma", "terminator", "whitespace"],
            description: "Boolean Literal",
          },
          start: {
            lex: "IN",
            delims: ["newline", "whitespace"],
            description: "Start of Main Function Keyword",
          },
          int: {
            lex: "int",
            delims: "whitespace",
            description: "Integer Data Type Keyword",
          },
          dec: {
            lex: "dec",
            delims: "whitespace",
            description: "Decimal Data Type Keyword",
          },
          str: {
            lex: "str",
            delims: "whitespace",
            description: "String Data Type Keyword",
          },
          bool: {
            lex: "bool",
            delims: "whitespace",
            description: "Boolean Data Type Keyword",
          },
          empty: {
            lex: "empty",
            delims: "whitespace",
            description: "Null Data Type Keyword",
          },
          struct: {
            lex: "struct",
            delims: "whitespace",
            description: "Struct Keyword",
          },
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
          kill: {
            lex: "kill",
            delims: "terminator",
            description: "Break Control Keyword",
          },
          control: {
            lex: "continue",
            delims: "terminator",
            description: "Continue Control Keyword",
          },
          return: {
            lex: "return",
            delims: ["terminator", "openParen", "whitespace"],
            description: "Return Keyword",
          },
          end: {
            lex: "OUT",
            delims: ["whitespace", "newline", "EOF"],
            description: "End of Main Function Keyword",
          },
          and: {
            lex: "and",
            delims: "whitespace",
            description: "And Logical Keyword",
          },
          or: {
            lex: "or",
            delims: "whitespace",
            description: "Or Logical Keyword",
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
          id: {
            lex: "id",
            delims: ["openBracket", "openParen", "unary", "appendAssign", "assignOper", "relationOper", "equal", "append", "arithOper", "closeParen", "closeBracket", "whitespace", "comparison", "dot", "terminator", "comma", "openBrace", "closeBrace", "access"],
            description: "Identifier",
          },
          access: {
            lex: "access",
            delims: "openBracket",
            description: "String Accessor Operator",
          },
          arithOper: {
            lex: "operator",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
            description: "Arithmetic Operator",
          },
          unary: {
            lex: "unary",
            delims: ["closeBracket", "closeParen", "closeBrace", "comma", "terminator", "id", "whitespace", "relationOper", "comparison"],
            description: "Unary Operator",
          },
          append: {
            lex: "operator",
            delims: ["negative", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
            description: "Arithmetic / Append Operator",
          },
          appendAssign: {
            lex: "assignment",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "litStr"],
            description: "Assignment with Arithmetic Operator",
          },
          assignOper: {
            lex: "assignment",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
            description: "Assignment with Arithmetic / Append Operator",
          },
          relationOper: {
            lex: "relation",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "not"],
            description: "Relational Operator",
          },
          comparison: {
            lex: "relation",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litBool", "litStr", "id", "whitespace","not"],
            description: "Relational Operator",
          },
          equal: {
            lex: "assignment",
            delims: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "id", "whitespace", "openBrace", "not", "unary"],
            description: "Assignment Operator",
          },
          not: {
            lex: "negate",
            delims: ["negative", "openParen", "id", "whitespace", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "unary", "not"],
            description: "Negation Operator",
          },
          colon: {
            lex: "colon",
            delims: ["whitespace", "newline"],
            description: "Case Operator",
          },
          terminator: {
            lex: "terminator",
            delims: ["unary", "id", "openParen", "closeParen", "terminator", "whitespace", "newline", "singleComment", "not"],
            description: "Terminator Operator",
          },
          comma: {
            lex: "separator",
            delims: ["unary", "not", "openBrace", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "negative", "int", "dec", "str", "bool"],
            description: "Separator Operator",
          },
          openBrace: {
            lex: "openBrace",
            delims: ["unary", "litStr", "not", "negative", "openParen", "openBrace", "closeBrace", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "newline", "singleComment"],
            description: "Start Operator of a Statement Block",
          },
          closeBrace: {
            lex: "closeBrace",
            delims: ["comma", "terminator", "closeBrace", "singleComment", "whitespace", "newline", "while", "EOF"],
            description: "End Operator of a Statement Block",
          },
          openParen: {
            lex: "openParenthesis",
            delims: ["negative", "litStr", "closeParen", "not", "openParen", "terminator", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "int", "dec", "str", "bool", "unary"],
            description: "Start Operator of an Expression",
          },
          closeParen: {
            lex: "closeParenthesis",
            delims: ["comma", "terminator", "arithOper", "append", "comparison", "closeParen", "closeBracket", "closeBrace", "relationOper", "whitespace", "openBrace", "newline", "access", "colon"],
            description: "End Operator of an Expression",
          },
          openBracket: {
            lex: "openBracket",
            delims: ["openParen", "litInt", "id", "whitespace", "unary", "closeBracket"],
            description: "Start Operator of an Array Size / String Access",
          },
          closeBracket: {
            lex: "closeBracket",
            delims: ["dot", "append", "arithOper", "appendAssign", "assignOper", "unary", "openBracket", "closeBracket", "terminator", "comma", "comparison", "relationOper", "closeBrace", "equal", "whitespace", "closeParen", "colon", "access"],
            description: "End Operator of an Array Size / String Access",
          },
          singleComment: {
            lex: "comment",
            delims: "newline",
            description: "Single-line Comment",
          },
          negative: {
            lex: "negative",
            delims: ["id", "openParen"],
            description: "Negative Operator",
          },
          dot: {
            lex: "dot",
            delims: "id",
            description: "Struct Element Accessor Operator",
          },
          task: {
            lex: "task",
            delims: "whitespace",
            description: "Function Keyword",
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
              tokenStream.push({
                word: token.value,
                token: token.type,
                lex: token.type !== "invalid" && token.type !== "whitespace" && token.type !== "newline"
                  ? results[token.type].lex
                  : token.type,
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
            console.log(currentToken, next, currentToken !== "invalid");
            if(nextToken !== "EOF")
            {
              let missingQuote = false;
              if(currentToken !== "whitespace" &&
                  currentToken !== "newline" &&
                  currentToken !== "invalid" &&
                  results[currentToken].delims.includes(nextToken)
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
                    ? await dispatch('GET_EXPECTATIONS', results, results[currentToken].delims)
                    : "-"
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
              }else if(results[currentToken].delims.includes(nextToken)){
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
                  exp: await dispatch('GET_EXPECTATIONS', results, results[currentToken].delims)
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
        final.forEach(token => {
          token.description = results[token["token"]].description;
        });
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
          ? results[delimiters].lex
          : delimiters;
      else{
        while(i < delimiters.length && i < 3){
          expectations +=  delimiters[i] !== "whitespace" && delimiters[i] !== "newline"
            ? results[delimiters[i]].lex
            : delimiters[i];
          if(i < delimiters.length-1 && i < 2) expectations += " / ";
          i++;
        }
        if (delimiters.length > 3) expectations += " etc..."
      }
      return expectations;
    },
  },
};