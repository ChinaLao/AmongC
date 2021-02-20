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
    lexRules: {
        litStr: /[\\"][^\\"]+[\\"]/,
        singleComment: /^#.+/,
        litDec: /[~]?[0-9]{1,9}[.][0-9]{1,5}/,
        litInt: /[~]?[0-9]{1,9}/,
        
        whitespace: /[ \t]+/,
        newline: {match: /\n|\r\n|\r/, lineBreaks: true},
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
        //quote: `"`,
        openParen: "(",
        closeParen: ")",
        openBrace: "{",
        closeBrace: "}",
        openBracket: "[",
        closeBracket: "]",
        colon: ":",
        sharp: "#",
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

        // element: /[a-z][a-zA-Z0-9]{0,14}[.][a-z][a-zA-Z0-9]{0,14}/,
        id: /[a-z][a-zA-Z0-9]{0,14}/,
    },
    delimRules: {
        litStr: ["+", "=", "!", ")", "}", "[", ":", ">", "<", ",", ";", " "],
        litInt: ["+", "-", "*", "/", "%", ">", "<", "=", ")", "]", ":", "!", "}", ",", ";", " "],
        litDec: ["+", "-", "*", "/", "%", ">", "<", "=", ")", "!", "}", ",", ";", " "],
        litBool: ["}", ")", ",", ";", " "],
        IN: [" ", "\n"],
        int: " ",
        dec: " ",
        str: " ",
        bool: " ",
        empty: " ",
        struct: " ",
        shoot: "(",
        scan: "(",
        if: [" ", "("],
        else: [" ", "\n"],
        elf: [" ", "("],
        switch: ["(", " "],
        vote: " ",
        default: [":", " "],
        for: ["(", " "],
        while: ["(", " "],
        do: ["{", " "],
        kill: ";",
        continue: ";",
        true: [";", ")", " "],
        false: [";", ")", " "],
        return: [";", "(", " "],
        OUT: [" ", "\n"],
        and: " ",
        or: " ",
        vital: " ",
        clean: "(",
        id: [".", "[", "(", "+", "-", "*", "/", "%", ">", "<", "=", ")", "]", " "],
        element: ["[", "+", "-", "*", "/", "%", ">", "<", "=", ")", "]", " "],
        arithOper: ["~", "(", /0-9/, /a-z/, " "],
        unary: ["]", ")", "}", ",", ";", /a-z/, " "],
        append: ["~", "(", `"`, /0-9/, /a-z/, " "],
        assignOper: ["~", "(", /0-9/, /a-z/, " "],
        relationOper: ["~", "(", /0-9/, /a-z/, " "],
        equal: ["~", "(", /0-9/, /a-z/, " "],
        not: ["~", "(", /0-9/, /a-z/, " "],
        colon: ["+", "-", /a-z/, " ", "\n"],
        terminator: ["+", "-", /a-z/, " ", "\n", "#"],
        comma: ["+", "-", "!", "{", "(", `"`, /0-9/, /a-z/, " "],
        openBrace: ["+", "-", `"`, "#", "!", "~", "(", "{", "}", /0-9/, /a-z/, " ", "\n"],
        closeBrace: [",", ";", "}", "#", " ", "\n"],
        openParen: ["~", `"`, ")", "!", "(", ";", /0-9/, /a-z/, " "],
        closeParen: [",", ";", "+", "-", "*", "/", "%", "=", "!", ")", "]", "{", ">", "<", " "],
        openBracket: ["(", /0-9/, /a-z/, " "],
        closeBracket: ["+", "-", "*", "/", "%", "[", "]", ";", ",", ">", "<", "!", "}", "=", " "],
        singleComment: "\n",
    },
    delims: {
      litStr: ["appendAssign", "comma", "terminator", "and", "or", "closeParen", "closeBrace", "openBracket", "colon", "append", "whitespace"],
      litInt: ["arithOper", "relationOper", "closeParen", "closeBracket", "colon", "comparison", "closeBrace", "comma", "terminator", "whitespace"],
      litDec: ["arithOper", "relationOper", "closeParen", "comparison", "closeBrace", "comma", "terminator", "whitespace"],
      litBool: ["closeBrace", "closeParen", "comma", "terminator", "whitespace"],
      IN: ["whitespace", "newline"],
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
      switch: ["openParen", "whitespace"],
      vote: "whitespace",
      default: ["colon", "whitespace"],
      for: ["openParen", "whitespace"],
      while: ["openParen", "whitespace"],
      do: ["openBrace", "whitespace"],
      kill: "terminator",
      continue: "terminator",
      true: ["terminator", "closeParen", "whitespace"],
      false: ["terminator", "closeParen", "whitespace"],
      return: ["terminator", "openParen", "whitespace"],
      OUT: ["whitespace", "newline"],
      and: "whitespace",
      or: "whitespace",
      vital: "whitespace",
      clean: "openParen",
      id: ["openBracket", "openParen", "unary", "appendAssign", "assignOper", "relationOper", "equal", "append", "arithOper", "closeParen", "closeBracket", "whitespace", "comparison", "dot"],
      // element: ["openBracket", "unary", "appendAssign", "assignOper", "relationOper", "append", "arithOper", "equal", "closeParen", "closeBracket", "whitespace", "comparison"],
      arithOper: ["negative", "openParen", "litInt", "litDec", "id", "whitespace"],
      unary: ["closeBracket", "closeParen", "closeBrace", "comma", "terminator", "id", "whitespace"],
      append: ["negative", "openParen", "litStr", "litInt", "litDec", "id", "whitespace"],
      assignOper: ["negative", "openParen", "litInt", "litDec", "id", "whitespace"],
      relationOper: ["negative", "openParen", "litInt", "litDec", "id", "whitespace"],
      equal: ["negative", "openParen", "litInt", "litDec", "litStr", "litBool", "id", "whitespace"],
      not: ["negative", "openParen", "id", "whitespace"],
      colon: ["whitespace", "newline"],
      terminator: ["unary", "id", "openParen", "closeParen", "terminator", "whitespace", "newline", "singleComment"],
      comma: ["unary", "not", "openBrace", "openParen", "litStr", "litInt", "litDec", "litBool", "id", "whitespace", "negative"],
      openBrace: ["unary", "litStr", "not", "negative", "openParen", "openBrace", "closeBrace", "litInt", "litDec", "litBool", "id", "whitespace", "newline", "singleComment"],
      closeBrace: ["comma", "terminator", "closeBrace", "singleComment", "whitespace", "newline"],
      openParen: ["negative", "litStr", "closeParen", "not", "openParen", "terminator", "litInt", "litDec", "litBool", "id", "whitespace", "int", "dec", "str", "bool"],
      closeParen: ["comma", "terminator", "arithOper", "append", "comparison", "closeParen", "closeBracket", "closeBrace", "relationOper", "whitespace"],
      openBracket: ["openParen", "litInt", "id", "whitespace"],
      closeBracket: ["dot", "append", "arithOper", "appendAssign", "assignOper", "unary", "openBracket", "closeBracket", "terminator", "comma", "comparison", "relationOper", "closeBrace", "equal", "whitespace"],
      singleComment: "newline",
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
    }
  },
  actions: {
    async LEXICAL({ state, commit }, code){ //int Asd
        const tokenStream = [];
        const totoo = [];
        try{
            const parser = moo.compile(state.lexRules);
            let reader = parser.reset(code);

            let token = " ";
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
            let index = 0; // int num;
            while(index < tokenStream.length){
              console.log(index, tokenStream.length);
              if(index+1 < tokenStream.length)
              {
                const testStream = tokenStream[index+1]; // num
                const token = testStream.token; // id
                const streamToken = tokenStream[index].token; // int
                const delims = state.delims; // rules
                console.log(index, tokenStream.length, delims[streamToken], token);
                if(delims[streamToken] !== "whitespace" && 
                   delims[streamToken] !== "newline" && 
                   delims[streamToken].includes(token)
                ){
                  console.log(index, tokenStream.length, "ey");
                }
                else console.log(index, tokenStream.length, "aw man");
              }
              index++;
            }
            // const delimParser = moo.compile(state.delimRules);
            // let index = 0;
            // console.log("a"); 
            // while(index < tokenStream.length){ //litStr, terminator 
            //     console.log("a", tokenStream);
            //     let delim;
            //     if(index+1 !== tokenStream.length) { 
            //         let delimReader = delimParser.reset(tokenStream[index+1].word);
            //         console.log("a");
            //         delim = delimReader.next();
            //         console.log(delim);
            //     }
            //     if(index === tokenStream.length-1 || delim.type === tokenStream[index].token){
            //         console.log("a");
            //         totoo.push(tokenStream[index]);
            //     }
            //     if(index+1 === tokenStream.length)
            //         break;
            //     else
            //         index++;
                
            // }

            console.log(tokenStream, totoo);
        }
        catch(error){
            commit("SET_ERROR", {msg: error.message});
            console.log(error);
        }
        commit("SET_LEXEME", totoo);
    },
//     TEMPORARY_SYNTAX({ state, commit }) {
//       console.log("a");
//       const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
//       console.log("b");
//       let errArray = [];
//       const lexeme = state.lexeme;
//       console.log("c");
//       lexeme.forEach((lex, index) => {
//         try {
//           console.log(lex.word, lex.token);
//           parser.feed(lex.token);
//           console.log(parser.entries, parser.results);
//         } catch (err) {
//           const errors = {
//             msg: err.message,
//             line: lex.line,
//           };
//           errArray.push(errors);
//           commit("SET_ERROR", errArray);
//         }
//         console.log("loop ", index);
//       });
//       // try {
//       //   parser.feed(state.lexeme);
//       //   console.log(parser.results.length);
//       //   console.log(parser.results);
//       // } catch (err) {
//       //   console.log(err.message);

//       // }
//     },

//     GET_SYNTAX({ state, commit }, payload) {
//       const grammar = {
//         rules: state.lexRules,
//       };

//       const lexer = new JisonLex(grammar);
//       const codeByLine = payload.split("\n");
//       let Lexemes = [];
//       let index = 0;
//       let keyword = "";

//       codeByLine.forEach((line, i) => {
//         //read each line
//         console.log(keyword);
//         index = 0;
//         keyword = "";
//         console.log(line.length);

//         while (index < line.length) {
//           //read character per line
//           keyword = "";
//           console.log(line[index], index, keyword);

//           while (line[index] && line[index].match(/[^a-zA-Z0-9\s"]/g)) {
//             // symbols
//             let symbol = "";
//             symbol += line[index];
//             if (line[index] === "#") {
//               //single line comment
//               while (index < line.length) {
//                 keyword += line[index];
//                 index++;
//               }
//             }
//             if(line[index] === "~"){
//               //negative
//               const obj = {
//                 word: line[index],
//                 // token: lexer.lex(),
//                 line: i + 1,
//               };
//               Lexemes.push(obj);
//               if(line[index+1].match(/[0-9]/g))
//                 keyword+=line[index];
//               index++;
//             }
//             if (line[index] && line[index].match(/[+-=/*!%><]/g)) {
//               //operators
//               if (
//                 line[index] === line[index + 1] &&
//                 !line[index].match(/[!%><]/g)
//               ) {
//                 //++,--,==,//,**
//                 index++;
//                 symbol += line[index];
//                 console.log(symbol);
//               } else if (line[index + 1] === "=") {
//                 //+=,-=,*=,/=,%=,>=,<=,!=
//                 index++;
//                 symbol += line[index];
//                 console.log(symbol);
//               }
//               if (
//                 (symbol === "//" || symbol === "**") &&
//                 line[index + 1] === "="
//               ) {
//                 // //=,**=
//                 index++;
//                 symbol += line[index];
//                 console.log(symbol);
//               }
//             }

//             // lexer.setInput(symbol);
//             if(symbol !== "~"){
//                 const obj = {
//                 word: symbol,
//                 // token: lexer.lex(),
//                 line: i + 1,
//               };
//               Lexemes.push(obj);
//               index++;
//             }
//           }
//           console.log(line[index], keyword);
//           while (line[index] && line[index].match(/[a-zA-Z0-9."]/g)) {
//             // for keywords and identifiers
//             let isPartOfStr = false;
//             let quoteCounter = 0;
//             if (line[index] === '"') {
//               isPartOfStr = true;
//               quoteCounter++;
//               // lexer.setInput(line[index]);
//               const obj = {
//                 word: line[index],
//                 // token: lexer.lex(),
//                 line: i + 1,
//               };
//               Lexemes.push(obj);
//             }
//             while ((isPartOfStr || quoteCounter === 1) && index < line.length) {
//               //str literal
//               keyword += line[index];
//               index++;
//               if (line[index] === '"') {
//                 quoteCounter++;
//                 isPartOfStr = false;
//                 keyword += line[index];
//                 // lexer.setInput(keyword);
//                 const keyObj = {
//                   word: keyword,
//                   // token: lexer.lex(),
//                   line: i + 1,
//                 };
//                 Lexemes.push(keyObj);
//                 keyword = "";
//                 // lexer.setInput(line[index]);
//                 const obj = {
//                   word: line[index],
//                   // token: lexer.lex(),
//                   line: i + 1,
//                 };
//                 Lexemes.push(obj);
//                 index++;
//               }
//             }
//             console.log(line[index]);
//             if (
//               !isPartOfStr &&
//               line[index] &&
//               line[index].match(/[a-zA-Z0-9.]/g)
//             ) {
//               //struct
//               console.log(line[index], index, keyword);
//               if (
//                 line[index] === "." &&
//                 keyword !== "" &&
//                 !keyword.match(/^[~]?[0-9]+$/g)
//               ) {
//                 //struct element
//                 // lexer.setInput(keyword);
//                 const obj = {
//                   word: keyword,
//                   // token: lexer.lex(),
//                   line: i + 1,
//                 };
//                 Lexemes.push(obj);
//                 // lexer.setInput(line[index]);
//                 const dotObj = {
//                   word: line[index],
//                   // token: lexer.lex(),
//                   line: i + 1,
//                 };
//                 Lexemes.push(dotObj);
//                 index++;
//                 keyword = "";
//               }
//               if (!line[index].match(/\s/g)) {
//                 //to continue reading after .
//                 console.log(line[index], index, keyword);
//                 keyword += line[index];
//               }
//               index++;
//             }
//           }
//           while (line[index] && line[index].match(/\s/g)) index++; // to skip spaces
//           console.log(line[index], index, keyword);
//           if (keyword !== "") {
//             // to skip pushing blank
//             // lexer.setInput(keyword);
//             const obj = {
//               word: keyword,
//               // token: lexer.lex(),
//               line: i + 1,
//             };
//             Lexemes.push(obj);
//           }
//         }
//       });
//       Lexemes.forEach((lexeme) => {
//         try {
//           console.log(lexeme.word, lexeme.line);
//           lexer.setInput(lexeme.word);
//           lexeme.token = lexer.lex();
//           console.log(lexeme.word, lexeme.token, lexeme.line);
//         } catch (err) {
//           console.log(err);
//           lexeme.token = "Unknown";
//         }
//       });
//       commit("SET_LEXEME", Lexemes);
//     },
//     CLEAR({ state, commit }) {
//       const blank = [];
//       commit("SET_LEXEME", blank);
//       commit("SET_ERROR", blank);
//     },
  },
};
