// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const moo = require("moo");

    const lexer = moo.compile({
        id: {match: /[a-z][a-zA-Z0-9]{0,14}/, type: moo.keywords({
            "int": "int",
            "dec": "dec",
            "struct": "struct",
            "str": "str",
            "bool": "bool",
            "empty": "empty",
            "shoot": "shoot",
            "scan": "scan",
            "stateIf": "if",
            "stateElse": "else",
            "elf": "elf",
            "stateSwitch": "switch",
            "vote": "vote",
            "stateDefault": "default",
            "loopFor": "for",
            "loopWhile": "while",
            "loopDo": "do",
            "kill": "kill",
            "control": "continue",
            "bool_literal": ["true", "false"],
            "stateReturn": "return",
            "logical_oper": ["and","or"],
            "vital": "vital",
            "task": "task",
            "clean": "clean",
        })},

        IN: "IN",
        OUT: "OUT",

        str_literal: /["].*["]/,
        singleComment: /#.*/,
        dec_literal: /[~]?[0-9]{1,9}[.][0-9]{1,5}/,
        nega_int_literal: /[~][0-9]{1,9}/,
        posi_int_literal: /[0-9]{1,9}/,
        
        terminator: ";",
        comma: ",",
        dot: ".",

        open_paren: "(",
        close_paren: ")",
        open_brace: "{",
        close_brace: "}",
        open_bracket: "[",
        close_bracket: "]",
        colon: ":",
        unary_oper: ["++", "--"],
        assign_oper: ["+=", "-=", "**=", "*=", "//=", "/=", "%="],
        relation_oper: ["==", "!=", ">=", "<=", ">", "<"],
        arith_oper: ["+", "-", "**", "*", "//", "/", "%"],
        equal: "=",
        not: "!",
        negative: "~",
        access: "@",
        eof: "EOF",
        ws: /[ \t]+/
    });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["global", "_", (lexer.has("IN") ? {type: "IN"} : IN), "_", "main_statement", "_", (lexer.has("OUT") ? {type: "OUT"} : OUT), "_", "function", "_", (lexer.has("eof") ? {type: "eof"} : eof)], "postprocess": 
        (data) => {
            return [...data[0], ...data[4], ...data[8]];
        }
            },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "global", "symbols": ["global", "_", "global_choice"], "postprocess": 
        (data) => {
            return [...data[0], data[2]];
        }
                },
    {"name": "global", "symbols": [], "postprocess": 
        (data) => {
            return [];
        }
                },
    {"name": "global_choice", "symbols": ["vital_define"], "postprocess": id},
    {"name": "vital_define", "symbols": [(lexer.has("vital") ? {type: "vital"} : vital), "_", "data_type", "_", (lexer.has("id") ? {type: "id"} : id), "_", (lexer.has("equal") ? {type: "equal"} : equal), "_", "literal", "_", "recur_vital", "_", (lexer.has("terminator") ? {type: "terminator"} : terminator)], "postprocess": 
        (data) => {
            return {
                type: "constant_assign",
                dtype: data[2],
                values: [
                    {
                        id_name: data[4],
                        literal_value: data[8],
                    },
                    ...data[10]
                ]
            };
        }
                },
    {"name": "data_type", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": id},
    {"name": "data_type", "symbols": [(lexer.has("dec") ? {type: "dec"} : dec)], "postprocess": id},
    {"name": "data_type", "symbols": [(lexer.has("str") ? {type: "str"} : str)], "postprocess": id},
    {"name": "data_type", "symbols": [(lexer.has("bool") ? {type: "bool"} : bool)], "postprocess": id},
    {"name": "literal", "symbols": ["int_literal"], "postprocess":  
        (data) => {
            return{
                type: "int",
                value: data[0],
            };
        }
                },
    {"name": "literal", "symbols": [(lexer.has("dec_literal") ? {type: "dec_literal"} : dec_literal)], "postprocess":  
        (data) => {
            return{
                type: "dec",
                value: data[0]
            };
        }
                },
    {"name": "literal", "symbols": [(lexer.has("str_literal") ? {type: "str_literal"} : str_literal), "string_access"], "postprocess":  
        (data) => {
            return{
                type: "str",
                value: data[0],
                access: data[1]
            };
        }
                },
    {"name": "literal", "symbols": [(lexer.has("bool_literal") ? {type: "bool_literal"} : bool_literal)], "postprocess":  
        (data) => {
            return{
                type: "bool",
                value: data[0]
            };
        }
                },
    {"name": "int_literal", "symbols": [(lexer.has("posi_int_literal") ? {type: "posi_int_literal"} : posi_int_literal)], "postprocess": id},
    {"name": "int_literal", "symbols": [(lexer.has("nega_int_literal") ? {type: "nega_int_literal"} : nega_int_literal)], "postprocess": id},
    {"name": "string_access", "symbols": [(lexer.has("access") ? {type: "access"} : access), (lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "_", "struct_size", "_", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)], "postprocess":  
        (data) => {
            return data[3]
        }
                },
    {"name": "string_access", "symbols": [], "postprocess": id},
    {"name": "struct_size", "symbols": [(lexer.has("id") ? {type: "id"} : id), "struct_size_choice"], "postprocess":  
        (data) => {
            return{
                type: "element",
                value: data[0],
                access: data[1]
            };
        }
                },
    {"name": "struct_size_choice", "symbols": ["id_array"], "postprocess": id},
    {"name": "struct_size_choice", "symbols": ["function_call_statement_choice"], "postprocess": id},
    {"name": "id_array", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "_", "struct_size", "_", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "id_array_2D"], "postprocess": 
        (data) => {
            return{
                type: "property_size",
                size_1: data[1],
                size_2: data[3]
            };
        }
                },
    {"name": "id_array", "symbols": [], "postprocess": id},
    {"name": "id_array_2D", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "_", "struct_size", "_", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)], "postprocess": 
        (data) => {
            return data[1]
        }
                },
    {"name": "id_array_2D", "symbols": [], "postprocess": id},
    {"name": "function_call_statement_choice", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "_", "function_call", "_", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)], "postprocess": 
        (data) => {
            return{
                type: "function_call",
                parameter_list: [...data[1]]
            };
        }
                },
    {"name": "function_call", "symbols": ["variable_choice", "additional_call"], "postprocess": 
        (data) => {
            return[data[0], ...data[1]];
        }
                },
    {"name": "function_call", "symbols": [], "postprocess": 
        (data) => {
            return [];
        }
                },
    {"name": "variable_choice", "symbols": [(lexer.has("id") ? {type: "id"} : id), "choice"], "postprocess": 
        (data) => {
            return{
                id_name: data[0],
                id_details: data[1]
            };
        }
                },
    {"name": "additional_call", "symbols": ["additional_call", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "variable_choice"], "postprocess": 
        (data) => {
            return[...data[0], data[2]];
        }
                },
    {"name": "additional_call", "symbols": [], "postprocess": 
        (data) => {
            return[];
        }
                },
    {"name": "choice", "symbols": [], "postprocess": id},
    {"name": "recur_vital", "symbols": ["recur_vital", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", (lexer.has("id") ? {type: "id"} : id), "_", (lexer.has("equal") ? {type: "equal"} : equal), "_", "literal", "_"], "postprocess": 
        (data) => {
            return [
                ...data[0],
                {
                    id_name: data[4],
                    literal_value: data[8]
                }
            ];
        }
                },
    {"name": "recur_vital", "symbols": [], "postprocess": 
        (data) => {
            return [];
        }
                },
    {"name": "main_statement", "symbols": ["statement_choice", "main_statement"], "postprocess": 
        (data) => {
            return [data[0], ...data[1]]
        }
                },
    {"name": "main_statement", "symbols": [], "postprocess": 
        (data) => {
            return [];
        }
                },
    {"name": "statement_choice", "symbols": ["vital_define"], "postprocess": id},
    {"name": "function", "symbols": [], "postprocess": 
        (data) => {
            return [];
        }
                }
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
