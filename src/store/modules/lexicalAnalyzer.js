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
        litStr: /[\\"](?:(?:[\\][\\"])*[^\\"]*)*[\\"]/,
        singleComment: /^#.+/,
        litDec: /[~]?[0-9]{1,9}[.][0-9]{1,5}/,
        negaLitInt: /[~][0-9]{1,9}/,
        litInt: /[0-9]{1,9}/,
        
        newline: {match: /\n|\r\n|\r/, lineBreaks: true},
        whitespace: /[ \t]+/,
        
        start: "IN",
        end: "OUT",
        int: "int",
        dec: "dec",
        struct: "struct",
        str: "str",
        bool: "bool",
        empty: "empty",
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
        litBool: ["true", "false"],
        return: "return",
        and: "and",
        or: "or",
        vital: "vital",
        task: "task",
        clean: "clean",
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

        id: /[a-z][a-zA-Z0-9]{0,14}/,
    },
    delims: {
      litStr: ["appendAssign", "comma", "terminator", "and", "or", "closeParen", "closeBrace", "openBracket", "colon", "append", "whitespace"],
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
      else: ["whitespace", "newline"],
      elf: ["whitespace", "openParen"],
      stateSwitch: ["openParen", "whitespace"],
      vote: "whitespace",
      default: ["colon", "whitespace"],
      for: ["openParen", "whitespace"],
      while: ["openParen", "whitespace"],
      do: ["openBrace", "whitespace", "newline"],
      kill: "terminator",
      continue: "terminator",
      true: ["terminator", "closeParen", "whitespace"],
      false: ["terminator", "closeParen", "whitespace"],
      return: ["terminator", "openParen", "whitespace"],
      end: ["whitespace", "newline"],
      and: "whitespace",
      or: "whitespace",
      vital: "whitespace",
      clean: "openParen",
      id: ["openBracket", "openParen", "unary", "appendAssign", "assignOper", "relationOper", "equal", "append", "arithOper", "closeParen", "closeBracket", "whitespace", "comparison", "dot", "terminator", "comma", "openBrace", "closeBrace"],
    
      arithOper: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
      unary: ["closeBracket", "closeParen", "closeBrace", "comma", "terminator", "id", "whitespace", "relationOper", "comparison"],
      append: ["negative", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
      appendAssign: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "litStr"],
      assignOper: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace"],
      relationOper: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "id", "whitespace", "not"],
      comparison: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litBool", "litStr", "id", "whitespace","not"],
      equal: ["negative", "openParen", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "id", "whitespace"],
      not: ["negative", "openParen", "id", "whitespace", "litInt", "negaLitInt", "litDec", "litStr", "litBool", "unary"],
      colon: ["whitespace", "newline"],
      terminator: ["unary", "id", "openParen", "closeParen", "terminator", "whitespace", "newline", "singleComment", "not"],
      comma: ["unary", "not", "openBrace", "openParen", "litStr", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "negative", "int", "dec", "str", "bool"],
      openBrace: ["unary", "litStr", "not", "negative", "openParen", "openBrace", "closeBrace", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "newline", "singleComment"],
      closeBrace: ["comma", "terminator", "closeBrace", "singleComment", "whitespace", "newline", "while"],
      openParen: ["negative", "litStr", "closeParen", "not", "openParen", "terminator", "litInt", "negaLitInt", "litDec", "litBool", "id", "whitespace", "int", "dec", "str", "bool", "unary"],
      closeParen: ["comma", "terminator", "arithOper", "append", "comparison", "closeParen", "closeBracket", "closeBrace", "relationOper", "whitespace", "openBrace", "newline"],
      openBracket: ["openParen", "litInt", "id", "whitespace", "unary", "closeBracket"],
      closeBracket: ["dot", "append", "arithOper", "appendAssign", "assignOper", "unary", "openBracket", "closeBracket", "terminator", "comma", "comparison", "relationOper", "closeBrace", "equal", "whitespace", "closeParen"],
      singleComment: "newline",
      negative: "id",
      dot: "id",
      task: "whitespace",
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
            col: token.col+1
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
                const error = {
                  type: "lex-error",
                  msg: `Invalid delimiter`,
                  line: tokenStream[index].line,
                  col: tokenStream[index].col
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
            col: tokenStream[index].col
          };
          commit("SET_ERROR", error);
          commit("CHANGE_ERROR", true);
        }
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
        });
        lexeme.forEach((lex, index) => {
          try {
            console.log(lex.word, lex.token);
            parser.feed(lex.token);
            console.log(parser.entries, parser.results);
          } catch (err) {
            const errors = {
              type: "syn-error",
              msg: `Unexpected token: ${lex.word}`,
              line: lex.line,
              col: lex.col,
            };
            commit("SET_ERROR", errors);
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
      }
    },
  },
};
