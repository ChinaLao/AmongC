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
        eof: "EOF",
		nl: {match: /[\r\n]+/, lineBreaks: true},
        ws: /[ \t]+/
    });
%}

@lexer lexer

#main program
program -> 
    global __ %IN main_statement __ %OUT __ function __ %eof
    {%
        (data) => {
            return [...data[0], ...data[3], ...data[7]];
        }
    %}

#newlines and whitespaces
__ ->   (%ws | %nl):*

#global declarations~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
global -> 
        global __ global_choice
        {%
            (data) => {
                return data[2]
                    ? [...data[0], data[2]]
                    : [...data[0]];
            }
        %}
    |   null
        {%
            (data) => {
                return [];
            }
        %}

global_choice -> 
        vital_define                            {% id %}
    # |   data_declare                            {% id %}
    # |   struct_declare                          {% id %}
    |   %singleComment
		{%
            (data) => {
                return;
            }
        %}

#for everywhere~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
vital_define -> 
        %vital __ data_type __ %id __ %equal __ literal __ recur_vital __ %terminator
        {%
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
                    type: "int",
                    value: data[0],
                };
            }
        %}
    |   %dec_literal              
        {% 
            (data) => {
                return{
                    type: "dec",
                    value: data[0]
                };
            }
        %}
    |   %str_literal string_access              
        {% 
            (data) => {
                return{
                    type: "str",
                    value: data[0],
                    access: data[1]
                };
            }
        %}
    |   %bool_literal              
        {% 
            (data) => {
                return{
                    type: "bool",
                    value: data[0]
                };
            }
        %}

int_literal ->
        %posi_int_literal                       {% id %}
    |   %nega_int_literal                       {% id %}

string_access ->
        %access %open_bracket __ struct_size __ %close_bracket
        {% 
            (data) => {
                return data[3]
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

struct_size_choice -> #actually choices for id details
        id_array                                 {% id %}
    |   function_call_statement_choice           {% id %}
    # |   first_compute_choice
    # |   struct_unary

#one dimensional
id_array ->
        %open_bracket __ struct_size __ %close_bracket id_array_2D
        {%
            (data) => {
                return{
                    type: "property_size",
                    size_1: data[1],
                    size_2: data[3]
                };
            }
        %}
    |   null                                      {% id %}

#two dimensional
id_array_2D ->
        %open_bracket __ struct_size __ %close_bracket
        {%
            (data) => {
                return data[1]
            }
        %}
    |   null                                      {% id %}

function_call_statement_choice ->
        %open_paren __ function_call __ %close_paren
        {%
            (data) => {
                return{
                    type: "function_call",
                    parameter_list: [...data[1]]
                };
            }
        %}

function_call ->
        variable_choice additional_call
        {%
            (data) => {
                return[data[0], ...data[1]];
            }
        %}
    |   null
        {%
            (data) => {
                return [];
            }
        %}

variable_choice ->
        %id choice
        {%
            (data) => {
                return{
                    id_name: data[0],
                    id_details: data[1]
                };
            }
        %}
    # |   condition_notter_less oper_condition
    # |   not_many not_choice
    # |   %negative negative_choice 
    # |   %open_paren choice %close_paren variable_next_null

additional_call ->
        additional_call __ %comma __ variable_choice
        {%
            (data) => {
                return[...data[0], data[2]];
            }
        %}
    |   null
        {%
            (data) => {
                return[];
            }
        %}

choice ->
    #     struct_new iterate_first_choice choice_choice_choice
    # |   function_call_statement_choice iterate_first_choice choice_choice_choice
    # |   iterate_choice choice_choice_choice
    # |   first_compute_choice
    # |   first_condition_choice
       null                                      {% id %}

recur_vital -> 
        recur_vital __ %comma __ %id __ %equal __ literal __
        {%
            (data) => {
                return [
                    ...data[0],
                    {
                        id_name: data[4],
                        literal_value: data[8]
                    }
                ];
            }
        %}
    |   null 
        {%
            (data) => {
                return [];
            }
        %}

#main function~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
main_statement ->
        main_statement __ statement_choice
        {%
            (data) => {
                return data[2]
                    ? [...data[0], data[2]]
                    : [...data[0]]
            }
        %}
|       null
        {%
            (data) => {
                return [];
            }
        %}

statement_choice ->
        vital_define                            {% id %}
    # |   data_declare
    # |   out_statement 
    # |   in_statement 
    # |   loop_statement 
    # |   if_statement 
    # |   switch_statement 
    # |   %id id_start_statement
    # |   %unary_oper %id assign_next_choice %terminator
    # |   control_statement 
    |   %clean %open_paren %close_paren %terminator
		{%
            (data) => {
                return;
            }
        %}
    |   %singleComment
		{%
            (data) => {
                return;
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
                return [];
            }
        %}