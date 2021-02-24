import { Store } from "vuex";

const JisonLex = require("jison-lex");
// const Parser = require("jison").Parser;
const nearley = require("nearley");
const grammar = require("./grammar.js");

const moo = require("moo");

export default {
  namespaced: true,
  state: {
    lexeme: [],
    error: [],
    tokenStream: [],
    mayError: false,
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

      litStr: /[\\"](?:(?:[\\][\\"])*[^\\"]*)*[\\"]/,
      singleComment: /^#.+/,
      litDec: /[~]?[0-9]{1,9}[.][0-9]{1,5}/,
      negaLitInt: /[~][0-9]{1,9}/,
      litInt: /[0-9]{1,9}/,
      
      
      
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
      //sharp: "#",
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
    },
    delims: {
      litStr: ["appendAssign", "comma", "terminator", "and", "or", "closeParen", "closeBrace", "access", "colon", "append", "whitespace"],
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
      true: ["terminator", "closeParen", "whitespace", "closeBrace"],
      false: ["terminator", "closeParen", "whitespace", "closeBrace"],
      return: ["terminator", "openParen", "whitespace", "closeBrace"],
      end: ["whitespace", "newline"],
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
      equal: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "id", "whitespace", "openBrace", "not"],
      not: ["negative", "openParen", "id", "whitespace", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "unary"],
      colon: ["whitespace", "newline"],
      terminator: ["unary", "id", "openParen", "closeParen", "terminator", "whitespace", "newline", "singleComment", "not"],
      comma: ["unary", "not", "openBrace", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "negative", "int", "dec", "str", "bool"],
      openBrace: ["unary", "litStr", "not", "negative", "openParen", "openBrace", "closeBrace", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "newline", "singleComment"],
      closeBrace: ["comma", "terminator", "closeBrace", "singleComment", "whitespace", "newline", "while"],
      openParen: ["negative", "litStr", "closeParen", "not", "openParen", "terminator", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "int", "dec", "str", "bool", "unary"],
      closeParen: ["comma", "terminator", "arithOper", "append", "comparison", "closeParen", "closeBracket", "closeBrace", "relationOper", "whitespace", "openBrace", "newline", "access"],
      openBracket: ["openParen", "litInt", "id", "whitespace", "unary", "closeBracket"],
      closeBracket: ["dot", "append", "arithOper", "appendAssign", "assignOper", "unary", "openBracket", "closeBracket", "terminator", "comma", "comparison", "relationOper", "closeBrace", "equal", "whitespace", "closeParen", "colon", "access"],
      singleComment: "newline",
      negative: "id",
      dot: "id",
      task: "whitespace",
      access: "openParen",
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
      true:  "True Keyword",
      false: "False Keyword",
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
      state.error.push(payload);
    },
    CLEAR_OUTPUTS(state) {
        state.error = state.lexeme = [];
        state.mayError = false;
    },
    CHANGE_ERROR(state, payload){
      state.mayError = payload;
    }
  },
  actions: {
    async LEXICAL({ state, commit }, code){ 
        const tokenStream = [];
        const totoo = [];
        const parser = moo.compile(state.lexRules);
        let reader = parser.reset(code);
        const tokenDescription = state.tokenDescription;

        let token = " ";
        try{
          while(token){
            token = reader.next();
            if(token){
              tokenStream.push({
                word: token.value,
                token: token.type,
                line: token.line,
                col: token.col,
              });
            }  
          }
        }
        catch(error){
          commit("SET_ERROR", {
            type: "lex-error",
            msg: "Invalid Keyword",
            line: token.line,
            col: token.col+1,
            exp: "-"
          });
          commit("CHANGE_ERROR", true);
          console.log(error);
        }
        try{
          let index = 0; // int num;
          while(index < tokenStream.length){
            console.log(index, tokenStream.length);
            if(index+1 < tokenStream.length)
            {
              const testStream = tokenStream[index+1]; // space
              const token = testStream.token; // whitespace
              const streamToken = tokenStream[index].token; // int
              const delims = state.delims; // rules
              console.log(index, tokenStream.length, delims[streamToken], token, streamToken);
              if(streamToken !== "whitespace" && 
                  streamToken !== "newline" && 
                  delims[streamToken].includes(token)
              ){
                console.log(index, tokenStream.length, "ey");
                totoo.push(tokenStream[index]);
              }
              else if(streamToken !== "whitespace" && streamToken !== "newline"){
                let message, expectationList;
                if(tokenStream[index]["token"] === "litInt" && (tokenStream[index+1]["token"] === "litInt" || tokenStream[index+1]["token"] === "litDec")) message = "Limit exceeded";
                else if(tokenStream[index]["token"] === "litDec" && tokenStream[index+1]["token"] === "litInt") message = "Limit exceeded";
                else if(tokenStream[index]["token"] === "id" && (tokenStream[index+1]["token"] === "id" || tokenStream[index+1]["token"] === "litInt")) message = "Limit exceeded";
                else{
                  let i = 0;
                  const delimiters = delims[streamToken];
                  let expectations = "";

                  if(typeof(delimiters) === "string") expectations = delimiters;
                  else
                    while(i < delimiters.length && i < 3){
                      expectations += delimiters[i];
                      if(i < delimiters.length && i < 2) expectations += " / ";
                      i++;
                    }

                  message = `Invalid delimiter`;
                  expectationList = `${expectations}` //here
                }
                
                const error = {
                  type: "lex-error",
                  msg: message,
                  line: tokenStream[index].line,
                  col: tokenStream[index].col,
                  exp: expectationList
                };
                commit("SET_ERROR", error);
                commit("CHANGE_ERROR", true);
                break;
              } 
            } else if(tokenStream[index] !== "" && tokenStream[index]["token"] !== "whitespace" && tokenStream[index]["token"] !== "newline"){
              totoo.push(tokenStream[index]);
            }
            index++;
          }

          console.log(tokenStream, totoo);
        }catch(err){
          const error = {
            type: "programmer-error",
            msg: `Missing delimiter rule`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-"
          };
          commit("SET_ERROR", error);
          commit("CHANGE_ERROR", true);
        }
        totoo.forEach(token => {
          token.description = tokenDescription[token["token"]];
        });
        commit("SET_LEXEME", totoo);
    },
    async SYNTAX({ state, commit }) {
      if(!state.mayError)
      {
        console.log("a");
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        console.log("b");
        const lexeme = state.lexeme;
        const lexemeLast = lexeme[lexeme.length-1];
        console.log("c");
        lexeme.push({
          word: "EOF",
          token: "EOF",
          line: lexemeLast["line"]+1,
          col: 1,
          description: "End of File",
        });
        let index = 0;
        let synError = false;
        while(index < lexeme.length && !synError) {
          try {
            console.log(lexeme[index].word, lexeme[index].token);
            parser.feed(lexeme[index].token);
            console.log(parser.entries, parser.results);
          } catch (err) {
            const errors = {
              type: "syn-error",
              msg: `Unexpected token: ${lexeme[index].token} (${lexeme[index].word})`,
              line: lexeme[index].line,
              col: lexeme[index].col,
              exp: "-"
            };
            commit("SET_ERROR", errors);
            synError = true;
          }
          console.log("loop ", index);
          index++;
        }
      }
    },
  },
};
