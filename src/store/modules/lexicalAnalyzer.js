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
    lex: {
      litStr: "strLit",
      negaLitInt: "intLit",
      litInt: "intLit",
      litDec: "decLit",
      litBool: "boolLit",
      start: "IN",
      int: "int",
      dec: "dec",
      str: "str",
      bool: "bool",
      empty: "empty",
      struct: "struct",
      shoot: "shoot",
      scan: "scan",
      if: "if",
      else: "else",
      elf: "elf",
      stateSwitch: "switch",
      vote: "vote",
      default: "default",
      for: "for",
      while: "while",
      do: "do",
      kill: "kill",
      control: "continue",
      return: "return",
      end: "OUT",
      and: "and",
      or: "or",
      vital: "vital",
      clean: "clean",
      id: "id",
      access: "access",
      arithOper: "operator",
      unary: "unary",
      append: "operator",
      appendAssign: "assignment",
      assignOper: "assignment",
      relationOper: "relation",
      comparison: "relation",
      equal: "assignment",
      not: "negate",
      colon: "colon",
      terminator: "terminator",
      comma: "separator",
      openBrace: "openBrace",
      closeBrace: "closeBrace",
      openParen: "openParenthesis",
      closeParen: "closeParenthesis",
      openBracket: "openBracket",
      closeBracket: "closeBracket",
      singleComment: "comment",
      negative: "negative",
      dot: "dot",
      task: "task",
      quote: "",
    },
    delims: {
      litStr: ["appendAssign", "comma", "terminator", "closeParen", "closeBrace", "access", "colon", "append", "whitespace"],
      negaLitInt: ["arithOper", "relationOper", "closeParen", "colon", "comparison", "closeBrace", "comma", "terminator", "whitespace", "append"],
      litInt: ["arithOper", "relationOper", "closeParen", "closeBracket", "colon", "comparison", "closeBrace", "comma", "terminator", "whitespace", "append"],
      litDec: ["arithOper", "relationOper", "closeParen", "comparison", "closeBrace", "comma", "terminator", "whitespace", "append"],
      litBool: ["closeBrace", "closeParen", "comma", "terminator", "whitespace"],
      start: ["newline", "whitespace"],
      int: "whitespace",
      dec: "whitespace",
      str: "whitespace",
      bool: "whitespace",
      empty: "whitespace",
      struct: "whitespace",
      shoot: "openParen",
      scan: "openParen",
      if: ["whitespace", "openParen"],
      else: ["whitespace", "newline", "openBrace"],
      elf: ["whitespace", "openParen"],
      stateSwitch: ["openParen", "whitespace"],
      vote: "whitespace",
      default: ["colon", "whitespace"],
      for: ["openParen", "whitespace"],
      while: ["openParen", "whitespace"],
      do: ["openBrace", "whitespace", "newline"],
      kill: "terminator",
      control: "terminator",
      return: ["terminator", "openParen", "whitespace"],
      end: ["whitespace", "newline", "EOF"],
      and: "whitespace",
      or: "whitespace",
      vital: "whitespace",
      clean: "openParen",
      id: ["openBracket", "openParen", "unary", "appendAssign", "assignOper", "relationOper", "equal", "append", "arithOper", "closeParen", "closeBracket", "whitespace", "comparison", "dot", "terminator", "comma", "openBrace", "closeBrace", "access"],
    
      arithOper: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
      unary: ["closeBracket", "closeParen", "closeBrace", "comma", "terminator", "id", "whitespace", "relationOper", "comparison"],
      append: ["negative", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
      appendAssign: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "litStr"],
      assignOper: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
      relationOper: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "not"],
      comparison: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litBool", "litStr", "id", "whitespace","not"],
      equal: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "id", "whitespace", "openBrace", "not", "unary"],
      not: ["negative", "openParen", "id", "whitespace", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "unary", "not"],
      colon: ["whitespace", "newline"],
      terminator: ["unary", "id", "openParen", "closeParen", "terminator", "whitespace", "newline", "singleComment", "not"],
      comma: ["unary", "not", "openBrace", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "negative", "int", "dec", "str", "bool"],
      openBrace: ["unary", "litStr", "not", "negative", "openParen", "openBrace", "closeBrace", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "newline", "singleComment"],
      closeBrace: ["comma", "terminator", "closeBrace", "singleComment", "whitespace", "newline", "while", "EOF"],
      openParen: ["negative", "litStr", "closeParen", "not", "openParen", "terminator", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "int", "dec", "str", "bool", "unary"],
      closeParen: ["comma", "terminator", "arithOper", "append", "comparison", "closeParen", "closeBracket", "closeBrace", "relationOper", "whitespace", "openBrace", "newline", "access", "colon"],
      openBracket: ["openParen", "litInt", "id", "whitespace", "unary", "closeBracket"],
      closeBracket: ["dot", "append", "arithOper", "appendAssign", "assignOper", "unary", "openBracket", "closeBracket", "terminator", "comma", "comparison", "relationOper", "closeBrace", "equal", "whitespace", "closeParen", "colon", "access"],
      singleComment: "newline",
      negative: ["id", "openParen"],
      dot: "id",
      task: "whitespace",
      access: "openBracket",
      quote: "",
      EOF: ""
    },
    tokenDescription: {
      litStr: "String Literal",
      negaLitInt: "Integer Literal",
      litInt: "Integer Literal",
      litDec: "Decimal Literal",
      litBool: "Boolean Literal",
      start: "Start of Main Function Keyword",
      int: "Integer Data Type Keyword",
      dec: "Decimal Data Type Keyword",
      str: "String Data Type Keyword",
      bool: "Boolean Data Type Keyword",
      empty: "Null Data Type Keyword",
      struct: "Struct Keyword",
      shoot: "Output Keyword",
      scan: "Input Keyword",
      if: "If Keyword",
      else: "Else Keyword",
      elf: "Else If Keyword",
      stateSwitch: "Switch Keyword",
      vote: "Case Keyword",
      default: "Default Keyword",
      for: "For Loop Keyword",
      while: "While Loop Keyword",
      do: "Do-While Loop Keyword",
      kill: "Break Control Keyword",
      control: "Continue Control Keyword",
      return: "Return Keyword",
      end: "End of Main Function Keyword",
      and: "And Logical Keyword",
      or: "Or Logical Keyword",
      vital: "Constant Keyword",
      clean: "Clear Screen Function Keyword",
      id: "Identifier",
      access: "String Accessor Operator",
      arithOper: "Arithmetic Operator",
      unary: "Unary Operator",
      append: "Arithmetic / Append Operator",
      appendAssign: "Assignment with Arithmetic Operator",
      assignOper: "Assignment with Arithmetic / Append Operator",
      relationOper: "Relational Operator",
      comparison: "Relational Operator",
      equal: "Assignment Operator",
      not: "Negation Operator",
      colon: "Case Operator",
      terminator: "Terminator Operator",
      comma: "Separator Operator",
      openBrace: "Start Operator of a Statement Block",
      closeBrace: "End Operator of a Statement Block",
      openParen: "Start Operator of an Expression",
      closeParen: "End Operator of an Expression",
      openBracket: "Start Operator of an Array Size / String Access",
      closeBracket: "End Operator of an Array Size / String Access",
      singleComment: "Single Comment Operator",
      negative: "Negative Operator",
      dot: "Struct Element Accessor Operator",
      task: "Function Keyword",
      quote: "",
      EOF: "End of File"
    }
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
        const tokenStream = [];
        const final = [];
        const parser = moo.compile(state.lexRules);
        let reader = parser.reset(code);
        const tokenDescription = state.tokenDescription;
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
                  ? state.lex[token.type]
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
            const delims = state.delims;
            console.log(currentToken, next, currentToken !== "invalid");
            if(nextToken !== "EOF")
            {
              let missingQuote = false;
              if(currentToken !== "whitespace" &&
                  currentToken !== "newline" &&
                  currentToken !== "invalid" &&
                  delims[currentToken].includes(nextToken)
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
                    ? await dispatch('GET_EXPECTATIONS', delims[currentToken])
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
              }else if(delims[currentToken].includes(nextToken)){
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
                  exp: await dispatch('GET_EXPECTATIONS', delims[currentToken])
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
          token.description = tokenDescription[token["token"]];
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
    async GET_EXPECTATIONS({ state }, delimiters){
      let i = 0;
      let expectations = "";
      if(typeof(delimiters) === "string")
        expectations = delimiters !== "whitespace" && delimiters !== "newline"
          ? state.lex[delimiters]
          : delimiters;
      else{
        while(i < delimiters.length && i < 3){
          expectations +=  delimiters[i] !== "whitespace" && delimiters[i] !== "newline"
            ? state.lex[delimiters[i]]
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
