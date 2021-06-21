const nearley = require("nearley");
const grammar = require("./grammar.js");

export default {
  namespaced: true,
  actions: {
    async ANALYZE({ rootState, commit, dispatch }, tokenStream) {
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
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)); //initializes nearley
      const lexeme = tokenStream; //gets list of lex

      let index = 0;
      let synError = false; //tag for syntax error
      while(index < lexeme.length && !synError) {
        try {
          if(lexeme[index].token !== "singleComment")
            parser.feed(lexeme[index].token); //checks the cfg in grammar.ne
        } catch (err) {
          console.log(err);
          let type, msg = null;
          const expectations = []; //for syntax expectations
          const results = rootState.lexical.results; //for the list of grouped results

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
                const group = await dispatch('lexical/FIND_GROUP', expect, { root: true });
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
          commit("main/SET_ERROR", {
            type: type,
            msg: msg,
            line: lexeme[index].line,
            col: lexeme[index].col,
            exp: expectations.length > 0
              ? expectations.join(", ")
              : "-"
          },
          {
            root: true
          }
          );
          synError = true;
        }
        index++;
      }
      // if(parser.results && parser.results.length > 1)
      //   console.log("%cAMBIGUOUS GRAMMAR DETECTED", "color: red; font-size: 20px");
      if(parser.results){
        console.log("%cParser Results: ", "color: cyan; font-size: 15px", parser.results);
      }
    },
  },
};