const nearley = require("nearley");
const grammar = require("./grammar.js");

const moo = require("moo");

export default {
  namespaced: true,
  state: {
    lexeme: [], //for list of tokens
    error: [], //for list of errors
    foundError: false, //tag if any errors are found
    id: [], //for list of ids
    ast: [], //for tree of program
    output: [],
    lexRules: { //moo rules
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

      litStr: /"(?:[^"\\]|\\.)*"/,
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
    groups: [ //for groupings of tokens
      ["dataTypes", "int", "dec", "str", "bool", "empty"],
      ["literals", "litStr", "negaLitInt", "litInt", "litDec", "litBool"],
      ["mainFunc", "start", "end"],
      ["conditionals", "if", "else", "elf", "stateSwitch", "vote", "default"],
      ["loops", "for", "while", "do"],
      ["controls", "kill", "control"],
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
    results: {
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
    }
  },
  getters: {
    LEXEME: (state) => state.lexeme,
    ERROR: (state) => state.error,
    OUTPUT: (state) => state.output,
  },
  mutations: {
    SET_LEXEME(state, payload) {
      state.lexeme = payload;
    },
    SET_ERROR(state, payload) {
      state.error.push(payload);
    },
    CLEAR_OUTPUTS(state) {
        state.lexeme = state.ast = state.output = [];
        state.id.splice(0, state.id.length);
        state.error.splice(0, state.error.length);
        state.foundError = false;
    },
    CHANGE_ERROR(state, payload){
      state.foundError = payload;
    },
    SET_ID(state, payload){
      state.id.push(payload);
    },
    SET_AST(state, payload){
      state.ast = payload;
    },
    SET_OUTPUT(state, payload){
      state.output = payload;
    }
  },
  actions: {
    async LEXICAL({ state, commit, dispatch }, code){
      const results = state.results;
      const tokenStream = [];
      const final = [];
      const finalToPass = [];
      const parser = moo.compile(state.lexRules);
      let reader = parser.reset(code);

      let token = " ";

      //moo tokenizer
      while(token){
        try{
          token = reader.next();
          if(token){
            const res = {
              lex: null,
              delims: null,
              description: null
            };
            //find the group of the token
            const group = token.type !== "invalid" && token.type !== "whitespace" && token.type !== "newline"
              ? await dispatch('FIND_GROUP', token.type)
              : null;

            if(group){ //if gr
              const lex = results[group][token.type].lex; //find the lex from deignated group
              res.lex = lex === "id"
                ? lex + await dispatch('FOUND_ID', token.value) //number ID
                : lex;
              res.delims = results[group].delims !== undefined //determine if the delims are global for the group or not
                ? results[group].delims
                : results[group][token.type].delims;
              res.description = results[group].description !== undefined //determine if the description are global for the group or not
              ? results[group].description
              : results[group][token.type].description;
            }else{
              res.lex = token.type;
              res.delims = "";
              res.description = "";
            }

            //push to list of tokenized
            tokenStream.push({
              word: token.value, //actual word
              token: token.type, //token from moo
              lex: res.lex, //pretty token
              delims: res.delims, //delimiters of this token
              description: res.description, //description of this token
              line: token.line, //line this token was found
              col: token.col, //column this token was found
            });
          }
        }
        catch(error){
          console.log(error);
        }
      }
      const last = tokenStream[tokenStream.length-1]; //get the last token from tokenized list
      //push EOF after the last tokenized
      tokenStream.push({
        word: "EOF",
        token: "EOF",
        lex: "EOF",
        line: last.line+1,
        col: 1
      })

      //delimiter checker
      let index = 0;
      while(index < tokenStream.length){
        try{
          //initialize current and lookahead
          const current = tokenStream[index];
          const next = tokenStream[index+1]
          const currentToken = current.token;
          const nextToken = next ? next.token : "";
          const currentDelims = current.delims;
          
          if(nextToken !== "EOF" && currentToken !== "EOF") //not yet EOF
          {
            let missingQuote = false; //tag for invalid keyword in missing ending quote

            //valid keyword and valid delimiter
            if(currentToken !== "whitespace" &&
                currentToken !== "newline" &&
                currentToken !== "invalid" && 
                currentDelims && currentDelims.includes(nextToken)
            ){
              final.push(current);
              finalToPass.push(current)
            }

            //whitespaces and newlines
            else if(currentToken === "whitespace" || currentToken === "newline") {} //finalToPass.push(current);

            //invalids
            else{
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
              }else if(currentToken !== "invalid"){
                const nextWord = nextToken !== "whitespace" && nextToken !== "newline"
                  ? next.word
                  : nextToken;
                const currentWord = currentToken !== "whitespace" && currentToken !== "newline"
                  ? current.word
                  : currentToken;

                message = `Invalid delimiter: ${nextWord} after: ${currentWord}`;
                expectations =  await dispatch('GET_EXPECTATIONS', results, currentDelims);
              }

              //dedicated for invalid keywords
              if(missingQuote || currentToken === "invalid")
                commit("SET_ERROR", {
                  type: "lex-error",
                  msg: `Invalid Keyword: ${current.word}`,
                  line: current.line,
                  col: current.col,
                  exp: "-"
                });
              //dedicated for other invalids
              else
                commit("SET_ERROR", {
                  type: "lex-error",
                  msg: message,
                  line: next.line,
                  col: next.col,
                  exp: expectations
                });
            }
          } else if(currentToken === "whitespace" || currentToken === "newline"){ 
            // finalToPass.push(current);
          } else if(currentToken !== ""){ //EOF found
            if(currentToken === "invalid"){ //invalid keyword
              commit("SET_ERROR", {
                type: "lex-error",
                msg: `Invalid Keyword: ${current.word}`,
                line: current.line,
                col: current.col,
                exp: "-"
              });
            }else if((currentDelims && currentDelims.includes(nextToken)) || currentToken === "EOF"){ //valid token with valid delimiter
              final.push(current);
              finalToPass.push(current)
            }else{ //invalid delimiter
              const nextWord = next.word;
              const currentWord = currentToken !== "whitespace" && currentToken !== "newline"
                ? current.word
                : currentToken;
              commit("SET_ERROR", {
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
          commit("SET_ERROR", {
            type: "programmer-error",
            msg: `Missing delimiter rule`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-"
          });
        }
      }
      console.log("%cLexical Errors: ", "color: cyan; font-size: 15px", state.error);
      commit("SET_LEXEME", final);
      if(state.error.length > 0) commit("CHANGE_ERROR", true);
      return finalToPass;
    },
    async SYNTAX({ state, commit, dispatch }, tokenStream) {
      //should not run if there is lex error
      const token = {

        //special characters
        assign_oper: ["appendAssign", "minusEqual", "multiplyEqual", "divideEqual", "exponentEqual", "floorEqual", "moduloEqual"],
        append: "append", 
        arith_oper: ["minus", "multiply", "divide", "exponent", "floor", "modulo"],
        relation_oper: ["greater", "lesser", "greaterEqual", "lesserEqual", "isEqual", "isNotEqual"],
        
        equal: "equal",
        not: "not",
        unary_oper: ["increment", "decrement"],
        open_paren: "openParen",
        close_paren: "closeParen",
        open_bracket: "openBracket",
        close_bracket: "closeBracket",
        open_brace: "openBrace",
        close_brace: "closeBrace",
        terminator: "terminator", //end of statement
        comma: "comma",
        dot: "dot",
        colon: "colon",
        negative: "negative",
        
        //unit keywords
        IN: "start", 
        OUT: "end",
        int: "int",
        dec: "dec",
        struct: "struct",
        str: "str",
        bool: "bool",
        empty: "empty",
        shoot: "shoot",
        scan: "scan",
        stateIf: "if",
        stateElse: "else",
        elf: "elf",
        stateSwitch: "stateSwitch",
        vote: "vote",
        stateDefault: "default",
        loopFor: "for",
        loopWhile: "while",
        loopDo: "do",
        kill: "kill",
        control: "control",
        bool_literal: "litBool",
        stateReturn: "return",
        vital: "vital",
        task: "task",
        clean: "clean",
        logical_oper: ["and","or"],


        str_literal: "litStr",
        singleComment: "singleComment",
        posi_int_literal: "litInt",
        nega_int_literal: "negaLitInt",
        dec_literal: "litDec",
        access: "access",
        
        id: "id", 

        eof: "EOF",
      };

      if(!state.foundError)
      {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)); //initializes nearley
        const lexeme = tokenStream; //gets list of lex

        let index = 0;
        let synError = false; //tag for syntax error
        while(index < lexeme.length && !synError) {
          try {
            parser.feed(lexeme[index].token); //checks the cfg in grammar.ne
          } catch (err) {
            console.log(err);
            let type, msg = null;
            const expectations = []; //for syntax expectations
            const results = state.results; //for the list of grouped results

            if(err.message.includes("Syntax error") || err.message.includes("invalid syntax")){
              const expectationLines = err.message
                .split(/\n/g) //split the nearley message per newline
                .filter(exp => exp.includes("A ")); //then filter it to lines with "A "

              for(const expectationLine of expectationLines){ //loop through lines
                const expectation = expectationLine
                  .split("A ")[1] //removes the "A " in front
                  .match(/[a-zA-Z_]+/); //filters the line to the expectation through reg exp
                const tokenExp = typeof(token[expectation]) === "string" //if one expectation only in a line
                  ? [token[expectation]] //put the expectation in an array
                  : token[expectation]; //put it as it is

                for(const expect of tokenExp){
                  //find the group of the token
                  const group = await dispatch('FIND_GROUP', expect);
                  //find the lex from deignated group
                  const lex = results[group][expect]["lex"];
                  if(expect !== "negaLitInt")
                    expectations.push(lex);
                }
              }
              type = "syn-error";
              msg = `Unexpected token: ${lexeme[index].lex} (${lexeme[index].word})`;
            }else{
              console.log(err);
              type = "programmer-error";
              msg = "Unaccounted error. Check logs";
            }
            commit("SET_ERROR", {
              type: type,
              msg: msg,
              line: lexeme[index].line,
              col: lexeme[index].col,
              exp: expectations.length > 0
                ? expectations.join(", ")
                : "-"
            });
            synError = true;
          }
          index++;
        }
        console.log("%cSyntax Errors: ", "color: cyan; font-size: 15px", state.error);
        if(parser.results && parser.results.length > 1)
          console.log("%cAMBIGUOUS GRAMMAR DETECTED", "color: red; font-size: 20px");
        if(!state.error.length && parser.results){
          console.log("%cParser Results: ", "color: cyan; font-size: 15px", parser.results);
          // commit('SET_AST', parser.results[0]);
          // console.log("%cAST: ", "color: cyan; font-size: 15px", state.ast);
          // await dispatch('WRITE_AST');
        }
      }
    },
    async GET_EXPECTATIONS(results, delimiters){ //for delimiters
      let i = 0;
      let expectations = "";

      //there is only one delimiter applicable
      if(typeof(delimiters) === "string")
        expectations = delimiters !== "whitespace" && delimiters !== "newline"
          ? results[await dispatch('FIND_GROUP', delimiters)].lex
          : delimiters;

      //there is more than one delimiter applicable
      else{
        while(i < delimiters.length && i < 3){ //only three expectations to be shown
          expectations +=  delimiters[i] !== "whitespace" && delimiters[i] !== "newline"
            ? results[await dispatch('FIND_GROUP', delimiter[i])].lex //find the group of the delimiter token
            : delimiters[i];

          if(i < delimiters.length-1 && i < 2) expectations += " / "; //add separator if the delimiter is more than one
          i++;
        }
        if (delimiters.length > 3) expectations += " etc..." //add etc for delimiters exceeding three
      }
      return expectations;
    },
    async FIND_GROUP({ state }, token){
      const groups = state.groups;
      const found = groups.find(group => group.includes(token));
      if (found) return found[0];
    },
    async FOUND_ID({ state, commit }, id){
      const stateId = state.id;
      if(stateId.includes(id)) return stateId.indexOf(id)+1;
      else{
        commit('SET_ID', id);
        return state.id.indexOf(id)+1;
      }
    },
    async WRITE_AST({ state, commit }){
      commit('SET_OUTPUT', state.ast);
    },
    async SEMANTICS({state, commit, dispatch}, tokenStream){
      let location = "global";
      const dataTypes = ["int", "dec", "str", "bool"];
      const beginKeywords = ["vote", "switch", "task", "for", "if", "elf", "else", "do"]
      const ids = [
        {
          lex: "begin"
        }
      ];
      const tasks = [];
      const structs = [];
      const elements = [];

      let index = 0;
      while(index < tokenStream.length){
        if (tokenStream[index].word === "struct") {
          const structIndex = structs.findIndex(struct => struct.lex === tokenStream[index + 1].lex);
          if (structIndex >= 0) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Duplicate declaration of struct (${tokenStream[index + 1].word})`,
            line: tokenStream[index + 1].line,
            col: tokenStream[index + 1].col,
            exp: "-",
          });
          structs.push(tokenStream[index + 1]);
          const struct = tokenStream[index + 1].word;
          index += 3;
          while (tokenStream[index].word !== "}") {
            while (!dataTypes.includes(tokenStream[index].word) && tokenStream[index].word !== "}") index++;
            if (dataTypes.includes(tokenStream[index].word)) {
              const dtype = tokenStream[index].word;
              index++;
              while (tokenStream[index].token === "id") {
                tokenStream[index].dtype = dtype;
                tokenStream[index].struct = struct;
                const elementIndex = elements.findIndex(
                  element =>
                    element.lex === tokenStream[index].lex
                    && element.struct === tokenStream[index].struct
                );
                if (elementIndex >= 0) commit("SET_ERROR", {
                  type: "sem-error",
                  msg: `Duplicate declaration of element (${tokenStream[index].word})`,
                  line: tokenStream[index].line,
                  col: tokenStream[index].col,
                  exp: "-",
                });
                elements.push(tokenStream[index]);
                if(tokenStream[index+1].word === "[") index = await dispatch("ARRAY_EVALUATOR", {
                  index: index+2,
                  tokenStream: tokenStream,
                  ids: ids,
                  tasks: tasks,
                  structs: structs,
                  elements: elements
                }) - 1;
                index += tokenStream[index + 1].word === ","
                  ? 2
                  : 1;
              }
            }
          }
          index++;
        }
        if(tokenStream[index].word === "task"){
          const taskType = tokenStream[index+1];

          let counter = index+3;
          let paramCounter = 0;
          tokenStream[index+2].parameters = [];
          while(
                dataTypes.includes(tokenStream[counter].word) 
            ||  tokenStream[counter].word !== ")" 
            ||  (tokenStream[counter].token === "id" && tokenStream[counter+1].token === "id")
          ){
            if(
                  dataTypes.includes(tokenStream[counter].word) 
                ||(tokenStream[counter].token === "id" && tokenStream[counter+1].token === "id")
              ){
              const structIndex = structs.findIndex(struct => struct.lex === tokenStream[counter].lex);
              if (structIndex < 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Undeclared struct (${tokenStream[counter].word})`,
                line: tokenStream[counter].line,
                col: tokenStream[counter].col,
                exp: "-",
              });
              paramCounter++;
              tokenStream[index+2].parameters.push(tokenStream[counter].word);
            }
            counter++;
          }

          tokenStream[index+2].type = taskType.word;
          tokenStream[index+2].paramCount = paramCounter;
          const taskIndex = tasks.findIndex(task => task.lex === tokenStream[index+2].lex);
          if(taskIndex >= 0) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Duplicate declaration of task (${tokenStream[index+2].word})`,
            line: tokenStream[index+2].line,
            col: tokenStream[index+2].col,
            exp: "-",
          });
          tasks.push(tokenStream[index+2]);
          index = counter-1;

        }
        if(tokenStream[index].word !== "struct")
          index++;
      }

      index = 0;
      while(index < tokenStream.length){
        if(tokenStream[index].word === "struct"){
          index += 3;
          let curlyCounter = 1;
          while(curlyCounter > 0){
            if(tokenStream[index].word === "{") curlyCounter++;
            else if(tokenStream[index].word === "}") curlyCounter--;
            index++;
          }
        }

        if(tokenStream[index].word === "IN"){
          location = "main";
          ids.push(
            {
            lex: "end"
            },
            {
              lex: "begin"
            }
          );
        } else if(tokenStream[index].word === "OUT"){
          let deleteIndex = ids.length-1;
          while(ids[deleteIndex].lex !== "begin"){
            ids.pop();
            deleteIndex--;
          }
          ids.pop();
          location = "udf";
        }

        index = await dispatch("TYPE_AND_DECLARATION_CHECKER", 
          {
            index: index, 
            tokenStream: tokenStream, 
            dataTypes: dataTypes, 
            location: location,
            ids: ids,
            tasks: tasks,
            structs: structs,
            elements: elements
          }
        );

        if(beginKeywords.includes(tokenStream[index].word)) ids.push(
          {
            lex: "begin"
          }
        );
        if(tokenStream[index].word === "while"){
          index+=2;
          let parenCounter = 1;
          while(parenCounter > 0){
            if(tokenStream[index].word === "(") parenCounter++;
            if(tokenStream[index].word === ")") parenCounter--;
            index++;
          }
          if(tokenStream[index].word === "{") ids.push(
            {
              lex: "begin"
            }
          );
        }
        if(tokenStream[index].word === "task"){ 
          ids.push({
            lex: "begin"
          });
          const taskIndex = tasks.findIndex(task => task.lex === tokenStream[index+2].lex);
          const taskName = taskIndex !== "undefined"
            ? tasks[taskIndex]
            : taskIndex;
          
          let counter = index+=4;
          let parenCounter = 1;
          while(parenCounter > 0){
            if(tokenStream[counter].word === "(") parenCounter++;
            else if(tokenStream[counter].word === ")") parenCounter--;
            else if(
                  dataTypes.includes(tokenStream[counter].word) 
              ||  (tokenStream[counter].token === "id" && tokenStream[counter+1].token === "id")
            ){
              tokenStream[counter+1].declared = tokenStream[counter+1].defined = true;
              tokenStream[counter+1].editable = true;
              tokenStream[counter+1].location = location;
              tokenStream[counter+1].dtype = tokenStream[counter].word;
              const idIndex = ids.findIndex(id => id.lex === tokenStream[counter+1].lex);
              if(idIndex >= 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Duplicate declaration of variable (${tokenStream[counter+1].word})`,
                line: tokenStream[counter+1].line,
                col: tokenStream[counter+1].col,
                exp: "-",
              });
              ids.push(tokenStream[counter+1]);
              counter+=2;
            } else counter++;
          }
          index = counter+2;
          let curlyCounter = 1;
          while(curlyCounter > 0){
            if(tokenStream[index].word === "{") curlyCounter++;
            if(tokenStream[index].word === "}") curlyCounter--;

            index = await dispatch("TYPE_AND_DECLARATION_CHECKER", 
                {
                  index: index, 
                  tokenStream: tokenStream, 
                  dataTypes: dataTypes, 
                  location: location,
                  ids: ids,
                  tasks: tasks,
                  structs: structs,
                  elements: elements
              }
            );

            if(tokenStream[index].word === "return"){
              if(taskName !== undefined && taskName.type === "empty"){
                commit("SET_ERROR", {
                  type: "sem-error",
                  msg: "empty task type cannot have a return",
                  line: tokenStream[index].line,
                  col: tokenStream[index].col,
                  exp: "no return",
                });
              } else if(taskName === undefined){
                commit("SET_ERROR", {
                  type: "programmer-error",
                  msg: "unhandled error in Among C. Check logs.",
                  line: tokenStream[index].line,
                  col: tokenStream[index].col,
                  exp: "-",
                });
              } else{
                index++;
                const {i, counter} = await dispatch("EXPRESSION_EVALUATOR", {
                  expectedDType: taskName.type,
                  index: index,
                  tokenStream: tokenStream,
                  ids: ids,
                  tasks: tasks,
                  structs: structs,
                  elements: elements
                });
                index = i;
              }
            }
            index++;
          }
          index--;
        }
        if(tokenStream[index].word === "}" || tokenStream[index].word === "kill"){
          let deleteIndex = ids.length-1;
          while(ids[deleteIndex].lex !== "begin"){
            ids.pop();
            deleteIndex--;
          }
          ids.pop();
        }
        index++;
      }
      console.log("%cSemantic Errors: ", "color: cyan; font-size: 15px", state.error);
    },
    async TYPE_AND_DECLARATION_CHECKER({commit, dispatch}, payload){
      let {index, tokenStream, dataTypes, location, ids, tasks, structs, elements} = payload;
      const assignOper = ["=", "+=", "-=", "*=", "**=", "/=", "//=", "%="];
      const iterate = ["++", "--"]
      if(tokenStream[index].word === "vital"){
        let moreConst = true;
        const dtype = tokenStream[index+1]
        while(moreConst){
          if(tokenStream[index+2].word === "[") index--;
          tokenStream[index+2].declared = tokenStream[index+2].defined = true;
          tokenStream[index+2].editable = false;
          tokenStream[index+2].location = location;
          tokenStream[index+2].dtype = dtype.word;
          const idIndex = ids.findIndex(id => id.lex === tokenStream[index+2].lex);
          if(idIndex >= 0) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Duplicate declaration of variable (${tokenStream[index+2].word})`,
            line: tokenStream[index+2].line,
            col: tokenStream[index+2].col,
            exp: "-",
          });
          ids.push(tokenStream[index+2]);
          if(tokenStream[index+3].word === "["){
            index += 3;
            let curlyCounter = 1;
            while(tokenStream[index].word !== "{") index++;
            while(tokenStream[index].word !== ";" && curlyCounter > 0){
              if(tokenStream[index].word === "{") index++;
              else if(tokenStream[index].word !== ","){
                const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
                {
                  expectedDType: dtype.word,
                  index: index,
                  tokenStream: tokenStream,
                  ids: ids,
                  tasks: tasks,
                  structs: structs,
                  elements: elements
                });
                index = i;
                curlyCounter = counter;
              }
              else index++;
            }
          }
          else{
            const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
            {
              expectedDType: dtype.word,
              index: index+4,
              tokenStream: tokenStream,
              ids: ids,
              tasks: tasks,
              structs: structs,
              elements: elements
            });
            index = i;
          }
          if(tokenStream[index].word === ";") moreConst = false;
        }
      } else if (dataTypes.includes(tokenStream[index].word) || (tokenStream[index].token === "id" && tokenStream[index+1].token === "id")){
        if(tokenStream[index].token === "id"){
          const structIndex = structs.findIndex(struct => struct.lex === tokenStream[index].lex);
          if (structIndex < 0) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Undeclared struct (${tokenStream[index].word})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-",
          });
        }
        let moreVar = true;
        let dtype = tokenStream[index]
        while(moreVar){
          if(tokenStream[index+1].word === "[") index--;
          tokenStream[index+1].declared = true;
          tokenStream[index+1].editable = true;
          tokenStream[index+1].location = location;
          tokenStream[index+1].dtype = dtype.word;
          const idIndex = ids.findIndex(id => id.lex === tokenStream[index+1].lex);
          if(idIndex >= 0) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Duplicate declaration of variable (${tokenStream[index+1].word})`,
            line: tokenStream[index+1].line,
            col: tokenStream[index+1].col,
            exp: "-",
          });
          ids.push(tokenStream[index+1]);

          if(tokenStream[index+2].word === "["){
            index = await dispatch("ARRAY_EVALUATOR", {
              index: index + 3,
              tokenStream: tokenStream,
              ids: ids,
              tasks: tasks,
              structs: structs,
              elements: elements
            }) - 1;
            //here
            let curlyCounter = 1;
            while(tokenStream[index].word !== "=" && tokenStream[index].word !== ";") index++;
            if(tokenStream[index].word !== ";")
              index++;
            while(tokenStream[index].word !== ";" && curlyCounter > 0){
              if(tokenStream[index].word === "{") index++;
              else if(tokenStream[index].word !== ","){
                const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
                {
                  expectedDType: dtype.word,
                  index: index,
                  tokenStream: tokenStream,
                  ids: ids,
                  tasks: tasks,
                  structs: structs,
                  elements: elements
                });
                index = i;
                curlyCounter = counter;
              }
              else index++;
            }
          }
          else if(tokenStream[index+2].word === "="){
            tokenStream[index+1].defined = true;
            const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
            {
              expectedDType: dtype.word,
              index: index+3,
              tokenStream: tokenStream,
              ids: ids,
              tasks: tasks,
              structs: structs,
              elements: elements
            });
            index = i;
          } else index+=2;
          if(tokenStream[index].word === ";") moreVar = false;
          
        }
      } else if(tokenStream[index].token === "id"){
        const taskIndex = tasks.findIndex(task => task.lex === tokenStream[index].lex);
        const idIndex   = ids.findIndex(id => id.lex === tokenStream[index].lex);
        const undeclaredMsg = tokenStream[index+1].word === "("
          ? "task"
          : "variable"
        if(taskIndex < 0 && idIndex < 0){
          commit("SET_ERROR", {
            type: "sem-error",
            msg: `Undeclared ${undeclaredMsg} (${tokenStream[index].word})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-",
          });
          while(tokenStream[index].word !== ";" && tokenStream[index].word !== "{"){
            if(assignOper.includes(tokenStream[index].word)){
              const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
              {
                expectedDType: undefined,
                index: index+1,
                tokenStream: tokenStream,
                ids: ids,
                tasks: tasks,
                structs: structs,
                elements: elements
              });
              index = i;
            } else if(tokenStream[index].token === "id" && tokenStream[index-1].word === "."){
              let counter = index-1;
              while(tokenStream[counter].token !== "id") counter--;
              const idIndex = ids.findIndex(id => id.lex === tokenStream[counter].lex);
              if (idIndex < 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Variable (${tokenStream[counter].word}) is not a struct`,
                line: tokenStream[counter].line,
                col: tokenStream[counter].col,
                exp: `-`,
              });
              const elementIndex = elements.findIndex(element => element.lex === tokenStream[index].lex && ids[idIndex].dtype === element.struct);
              if(elementIndex < 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Undeclared element (${tokenStream[index].word})`,
                line: tokenStream[index].line,
                col: tokenStream[index].col,
                exp: "-",
              });
              index++;
            }
            else index++;
          }
        } else if(tokenStream[index+1].word !== "("){
          if(!ids[idIndex].editable && (assignOper.includes(tokenStream[index+1].word) || iterate.includes(tokenStream[index+1].word))) commit("SET_ERROR", {
            type: "sem-error", //+ - * ** / // %
            msg: `Illegal re-assignment of vital id (${ids[idIndex].word})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-",
          });
          while(tokenStream[index].word !== ";" && tokenStream[index].word !== "{"){
            let dtype;
            if(assignOper.includes(tokenStream[index].word)){
              if(!dataTypes.includes(ids[idIndex].dtype)){
                let counter = index-1;
                while(tokenStream[counter].token !== "id") counter--;
                const ind = elements.findIndex(element => 
                  element.lex === tokenStream[counter].lex
                  && element.struct === ids[idIndex].dtype
                );
                if(ind >= 0) dtype = elements[ind].dtype;
                else dtype = "undefined";
              }
              const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
              {
                expectedDType: dtype || ids[idIndex].dtype,
                index: index+1,
                tokenStream: tokenStream,
                ids: ids,
                tasks: tasks,
                structs: structs,
                elements: elements
              });
              index = i;
            } else if(tokenStream[index].token === "id" && tokenStream[index-1].word === "."){
              let counter = index-1;
              while(tokenStream[counter].token !== "id") counter--;
              const idIndex = ids.findIndex(id => id.lex === tokenStream[counter].lex);
              if (idIndex >= 0 && dataTypes.includes(ids[idIndex].dtype)) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Variable (${tokenStream[counter].word}) is not a struct`,
                line: tokenStream[counter].line,
                col: tokenStream[counter].col,
                exp: `-`,
              });
              const elementIndex = elements.findIndex(element => element.lex === tokenStream[index].lex && ids[idIndex].dtype === element.struct);
              if(elementIndex < 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Undeclared element (${tokenStream[index].word})`,
                line: tokenStream[index].line,
                col: tokenStream[index].col,
                exp: "-",
              });
              index++;
            }
            else index++;
          }
        } else if(tokenStream[index+1].word === "("){
          let counter = index += 1;
          let paramCounter = tokenStream[counter+1].word === ")"
            ? 0
            : 1;
          while(tokenStream[counter].word !== ";"){
            if(tokenStream[counter].word === ",") paramCounter++;
            counter++;
          }
          if(paramCounter !== tasks[taskIndex].paramCount) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Mismatched number of parameters (${paramCounter})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: `${tasks[taskIndex].paramCount} parameters`,
          });
          for(const paramDtype of tasks[taskIndex].parameters){
            const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
            {
              expectedDType: paramDtype,
              index: index,
              tokenStream: tokenStream,
              ids: ids,
              tasks: tasks,
              structs: structs,
              elements: elements
            });
            index = i;
          }
        }
      } else if(tokenStream[index].word === "shoot"){
        while(tokenStream[index].word !== ";"){
          let dtype;
          if(tokenStream[index].token === "id"){
            if(tokenStream[index+1].word === "("){
              const ind = tasks.findIndex(task => task.lex === tokenStream[index].lex);
              if(ind < 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Undeclared task (${tokenStream[index].word})`,
                line: tokenStream[index].line,
                col: tokenStream[index].col,
                exp: `-`,
              });
              else dtype = tasks[ind].type;
            } else {
              const ind = ids.findIndex(id => id.lex === tokenStream[index].lex);
              if(ind < 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Undeclared variable (${tokenStream[index].word})`,
                line: tokenStream[index].line,
                col: tokenStream[index].col,
                exp: `-`,
              });
              else{
                dtype = ids[ind].dtype;
                const struct = tokenStream[index];
                if(!dataTypes.includes(dtype)){
                  const legal = ["[", "]"]
                  while(
                    tokenStream[index].word !== "." 
                    && (legal.includes(tokenStream[index].word) || tokenStream[index].token === "litInt")
                  ) index++;
                  if (tokenStream[index].word === "."){
                    index++;
                    const elementIndex = elements.findIndex(element => element.lex === tokenStream[index].lex && dtype === element.struct)
                    if(elementIndex < 0) commit("SET_ERROR", {
                      type: "sem-error",
                      msg: `Undeclared element (${tokenStream[index].word})`,
                      line: tokenStream[index].line,
                      col: tokenStream[index].col,
                      exp: `-`,
                    });
                    dtype = elementIndex < 0
                      ? undefined
                      : elements[elementIndex].dtype;
                  } else{
                    dtype = undefined;
                    commit("SET_ERROR", {
                      type: "sem-error",
                      msg: `Illegal access of object struct (${struct.word})`,
                      line: struct.line,
                      col: struct.col,
                      exp: `element access`,
                    });
                  }
                }
              }
            }
          } else if(tokenStream[index].lex.includes("Lit")){
            dtype = tokenStream[index].lex.split("Lit")[0];
          }
          if(dtype){
            const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
            {
              expectedDType: dtype,
              index: index+1,
              tokenStream: tokenStream,
              ids: ids,
              tasks: tasks,
              structs: structs,
              elements: elements
            });
            index = i;
          } else index++;
        }
      }
      return index;
    },
    async EXPRESSION_EVALUATOR({commit}, payload){
      let {expectedDType, index, tokenStream, ids, tasks, structs, elements} = payload;
      const numberTokens = ["litInt", "negaLitInt", "litDec"];
      const legal = ["litInt", "negaLitInt", "litDec", "litBool", "litStr", "id"];
      const numberDTypes = ["int", "dec"];
      const numberCompareTokens = ["<", ">", "<=", ">="];
      const boolConnector = ["and", "or"];
      const dataTypes = ["int", "dec", "str", "bool"];

      let errorFound = false;
      let err;
      let curlyCounter = 1;
      let prevStruct = expectedDType;
      while(tokenStream[index].word !== ";" && tokenStream[index].word !== "," && curlyCounter > 0){
        errorFound = false;
        if(tokenStream[index].token === "id" && expectedDType !== undefined){
          let idIndex = tokenStream[index+1].word === "("
            ? tasks.findIndex(task => task.lex === tokenStream[index].lex)
            : ids.findIndex(id => id.lex === tokenStream[index].lex);

          if (idIndex < 0 && dataTypes.includes(prevStruct) && tokenStream[index - 1].word === "."){
            let counter = index-2;
            while(tokenStream[counter].token !== "id") counter--;
            commit("SET_ERROR", {
              type: "sem-error",
              msg: `Variable (${tokenStream[counter].word}) is not a struct`,
              line: tokenStream[counter].line,
              col: tokenStream[counter].col,
              exp: `-`,
            });
          }

          idIndex = idIndex < 0
            ? elements.findIndex(element => element.lex === tokenStream[index].lex && prevStruct === element.struct)
            : idIndex;
          
          let dtype = idIndex < 0
            ? null
            : tokenStream[index+1].word === "("
              ? tasks[idIndex].type
              : ids[idIndex].dtype;
          
          if (idIndex >= 0)
            dtype = dtype
              ? dtype
              : elements[idIndex].dtype

          prevStruct = dtype;

          if(
            ( !numberDTypes.includes(dtype) 
              || !numberDTypes.includes(expectedDType)
            ) 
            && dtype !== expectedDType 
            && expectedDType !== "bool"
            && dataTypes.includes(dtype)
            && idIndex >= 0
          ){
            errorFound = true;
            err = dtype
          }
        } else if (numberTokens.includes(tokenStream[index].token) && expectedDType !== undefined){
          if(!numberDTypes.includes(expectedDType) && expectedDType !== "bool")  errorFound = true;
        } else if (tokenStream[index].token === "litStr" && expectedDType !== undefined){
          if(expectedDType !== "str" && expectedDType !== "bool")  errorFound = true;
        } else if (tokenStream[index].token === "litBool" && expectedDType !== undefined){
          if(expectedDType !== "bool") errorFound = true;
        } else if(boolConnector.includes(tokenStream[index].word)){
          if(expectedDType !== "bool") commit("SET_ERROR", {
            type: "sem-error",
            msg: `Keyword (${tokenStream[index].word}) can only be used on bool data types`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-",
          });
        } else if(numberCompareTokens.includes(tokenStream[index].word)){
          if(expectedDType === "str") commit("SET_ERROR", {
            type: "sem-error",
            msg: `Symbol (${tokenStream[index].word}) can only be used on number and bool data types`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: "-",
          });
        }
        if(tokenStream[index].token === "id"){
          const idIndex = ids.findIndex(id => id.lex === tokenStream[index].lex);
          const taskIndex = tokenStream[index+1].word === "("
            ? tasks.findIndex(task => task.lex === tokenStream[index].lex)
            : -1;
          let elementIndex = -1;
          if(tokenStream[index-1].word === "."){
            let counter = index-2;
            while(tokenStream[counter].token !== "id") counter--;
            const structIndex = structs.findIndex(struct => struct.lex === tokenStream[counter].lex);
            if(structIndex >= 0) elementIndex = elements.findIndex(element => 
              element.lex === tokenStream[index].lex 
              && structs[structIndex].dtype === element.struct
            );
          }
          if (idIndex < 0 && taskIndex < 0 && elementIndex < 0) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Undeclared variable (${tokenStream[index].word})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: `-`,
          });
        }
        if ((errorFound || expectedDType === undefined) && legal.includes(tokenStream[index].token)) commit("SET_ERROR", {
          type: "sem-error",
          msg: `Mismatched data type (${expectedDType}) and value (${err ? err : tokenStream[index].word})`,
          line: tokenStream[index].line,
          col: tokenStream[index].col,
          exp: expectedDType === undefined
            ? "-"
            : `${expectedDType} value`,
        });
        index++; 
        if(tokenStream[index].word === "{"){
          curlyCounter++;
          index++;
        }
        else if(tokenStream[index].word === "}"){
          curlyCounter--;
          index++;
        }
      }
      return {
        i: index,
        counter: curlyCounter
      };
    }, 
    async ARRAY_EVALUATOR({ commit }, payload) {
      let {index, tokenStream, ids, tasks, structs, elements} = payload;
      let bracketCounter = 1;
      const dataTypes = ["int", "dec", "str", "bool"];
      while(bracketCounter > 0){
        if(tokenStream[index].word === "[") bracketCounter++;
        else if(tokenStream[index].word === "]") bracketCounter--;
        else if(tokenStream[index].token === "id"){
          const idIndex = ids.findIndex(id => id.lex === tokenStream[index].lex);
          const taskIndex = tokenStream[index+1].word === "("
            ? tasks.findIndex(task => task.lex === tokenStream[index].lex)
            : -1;
          let elementIndex;
          if (tokenStream[index-1].word === "."){
            let counter = index-2;
            while(tokenStream[counter].token !== "id") counter--;
            const ind = ids.findIndex(id => id.lex === tokenStream[counter].lex);
            if(ind >= 0){
              elementIndex = elements.findIndex(element => 
                element.lex === tokenStream[index].lex
                && ids[ind].dtype === element.struct
              )
              if (elementIndex < 0) commit("SET_ERROR", {
                type: "sem-error",
                msg: `Undeclared element (${tokenStream[index].word})`,
                line: tokenStream[index].line,
                col: tokenStream[index].col,
                exp: `-`,
              });
              else if (elements[elementIndex].dtype !== "int") commit("SET_ERROR", {
                type: "sem-error",
                msg: `Cannot access using variable with ${elements[elementIndex].dtype} value (${tokenStream[index].word})`,
                line: tokenStream[index].line,
                col: tokenStream[index].col,
                exp: `-`,
              });
            }
          }
          if (idIndex < 0 && taskIndex < 0 && elementIndex < 0) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Undeclared ${tokenStream[index + 1].word === "(" ? 'task' : 'variable'} (${tokenStream[index].word})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: `-`,
          });
          else if (idIndex >= 0 && ids[idIndex].dtype !== "int" && dataTypes.includes(ids[idIndex].dtype)) commit("SET_ERROR", {
            type: "sem-error",
            msg: `Cannot access using variable with ${ids[idIndex].dtype} value (${tokenStream[index].word})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: `-`,
          });
          else if (taskIndex >= 0 && ids[taskIndex].dtype !== "int") commit("SET_ERROR", {
            type: "sem-error",
            msg: `Cannot access using variable with ${tasks[taskIndex].type} task (${tokenStream[index].word})`,
            line: tokenStream[index].line,
            col: tokenStream[index].col,
            exp: `-`,
          });
        }
        index++;
      }
      return index;
    },
    async WRITE_JAVASCRIPT({ state, dispatch, commit }, statements){
      const javascriptStatements = [];
      for (const statement of statements){
        const javascriptStatement = await dispatch('CREATE_JAVASCRIPT', statement);
        javascriptStatements.push(javascriptStatement);
      }
      const js = javascriptStatements.join("\n");
      const output = "\n\nJS:\n" + js;
      commit('SET_OUTPUT', output);
      return output;
    },
    async CREATE_JAVASCRIPT({ state, commit }, section){
      let js = ``;
      const isUDF = section.type === "user_function"
        ? true 
        : false;
      
      const statements = isUDF
        ? section.function_body
        : section;
      
      if(statements)
        statements.forEach(statement => {
          const statementType = statement.type;
          if(statementType === "constant_assign"){
            const dataType = statement.dtype.value;
            let index = 0;
            let error = false;
            while(index < statement.values.length && !error){
              const variable = statement.values[index].id_name.value;
              const value = statement.values[index].literal_value;
              const valueType = value.type;
              const expression = value.value;
              let expressionValue = expression.value;
              
              if(dataType === valueType){
                expressionValue = expressionValue.replace(/~/, '-');
                if(js === ``)
                  js += `const ${variable} = ${expressionValue}`;
                else
                  js += `, ${variable} = ${expressionValue}`;
                index++;
              }else{
                error = true;
              }
            }
            if(!error){
              return js + `;`;
            }
            else{
              commit("SET_ERROR", {
                type: "sem-error",
                msg: "Mismatched data type and value",
                line: statement.values[index].literal_value.value.line,
                col: statement.values[index].literal_value.value.col,
                exp: `${dataType} value`,
              });
              return "";
            }
          }
        });
        if(state.error.length > 0) commit("CHANGE_ERROR", true);
    }
  },
};