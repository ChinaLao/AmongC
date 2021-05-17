@{%
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
        eof: "EOF"
    });
%}

@lexer lexer

#main program
program -> 
    global %IN main_statement %OUT function %eof
    {%
        (data) => {
            return [data[0], data[2], data[4]];
        }
    %}

#global declarations~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
global -> 
        global global_choice
        {%
            (data) => {
                return [...data[0], data[1]];
            }
        %}
    |   global_choice
        {%
            (data) => {
                return [data[0]];
            }
        %}

global_choice -> 
        vital_define                            {% id %}
    # |   data_declare                            {% id %}
    # |   struct_declare                          {% id %}
    # |   %singleComment                          {% id %}

#for everywhere~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
vital_define -> 
        %vital data_type %id %equal literal recur_vital %terminator
        {%
            (data) => {
                return {
                    type: "constant_assign",
                    dtype: data[1],
                    constant_assign: [
                        {
                            id_name: data[2],
                            literal_value: data[4],
                        },
                        ...data[5]
                    ]
                };
            }
        %}

data_type -> 
        %int                                    {% id %}
    |   %dec                                    {% id %}
    |   %str                                    {% id %}
    |   %bool                                   {% id %}

literal -> 
        int_literal              
        {% 
            (data) => {
                return{
                    type: "int_literal",
                    value: data[0],
                };
            }
        %}
    |   %dec_literal              
        {% 
            (data) => {
                return{
                    type: "dec_literal",
                    value: data[0]
                };
            }
        %}
    |   %str_literal string_access              
        {% 
            (data) => {
                return{
                    type: "str_literal",
                    value: data[0],
                    access: data[1]
                };
            }
        %}
    |   %bool_literal              
        {% 
            (data) => {
                return{
                    type: "bool_literal",
                    value: data[0]
                };
            }
        %}

int_literal ->
        %posi_int_literal                       {% id %}
    |   %nega_int_literal                       {% id %}

string_access ->
        %access %open_bracket struct_size %close_bracket
        {% 
            (data) => {
                return data[2]
            }
        %}
    |   null                                    {% id %}

struct_size ->
        %id struct_size_choice              
        {% 
            (data) => {
                return{
                    type: "element",
                    value: data[0],
                    access: data[1]
                };
            }
        %}
    # |   compute_choice_less
    # |   %unary_oper %id struct_choice

struct_size_choice ->
        id_array                                 {% id %}
    # |   function_call_statement_choice
    # |   first_compute_choice
    # |   struct_unary

id_array ->
        %open_bracket struct_size %close_bracket id_array_2D
        {%
            (data) => {
                return{
                    type: "property_size",
                    size_1: data[1],
                    size_2: data[3]
                }
            }
        %}
    |   null                                      {% id %}

id_array_2D ->
        %open_bracket struct_size %close_bracket
        {%
            (data) => {
                return data[1]
            }
        %}
    |   null                                      {% id %}
    
recur_vital -> 
        recur_vital %comma %id %equal literal
        {%
            (data) => {
                return [
                    ...data[0],
                    {
                        id_name: data[2],
                        literal_value: data[4]
                    }
                ];
            }
        %}
    |   null 
        {%
            (data) => {
                return [data[0]];
            }
        %}

#main function~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
main_statement ->
        # statement_choice main_statement
        # {%
        #     (data) => {
        #         return [data[0], ...data[1]]
        #     }
        # %}
       null
        {%
            (data) => {
                return [data[0]];
            }
        %}

function ->
        # %task function_data_type %id %open_paren parameter %close_paren %open_brace in_function_statement %close_brace function
        # {%
        #     (data) => {
        #         return [
        #             {
        #                 type: "user_function",
        #                 function_dtype: data[1],
        #                 function_name: data[2],
        #                 arguments: [...data[4]],
        #                 function_body: [...data[7]]
        #             },
        #             ...data[9]
        #         ]
        #     }
        # %}
       null
        {%
            (data) => {
                return [data[0]];
            }
        %}