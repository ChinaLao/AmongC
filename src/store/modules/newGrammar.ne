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
        "litBool": ["true", "false"],
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

# program -> 
        global %IN main_statement %OUT function %eof
        {%
            (data) => {
                return {
                    type: "program",
                    global_declarations: data[0],
                    main_function: [data[2]],
                    user_function: data[4]
                }
            }
        %}

#changed comment to %singleComment; moved it to global_choice
# global -> 
        global_choice global
        {%
            (data) => {
                return [data[0], ...data[1]]
            }
        %}
    |   null
        {%
            (data) => {
                return [data[0]]
            }
        %}

# global_choice -> 
        vital_define                            {% id %}
    |   data_declare                            {% id %}
    |   struct_declare                          {% id %}
    |   %singleComment                          {% id %}

# vital_define -> 
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
                }
            }
        %}

# recur_vital -> 
        %comma %id %equal literal recur_vital
        {%
            (data) => {
                return [
                    {
                        id_name: data[1],
                        literal_value: data[3]
                    },
                    ...data[4]
                ]
            }
        %}
    |   null

#temporarily moved %id to declare_choice
data_declare -> 
        data_type %id declare_choice %terminator
        {%
            (data) => {
                return {
                    type: "data_declaration",
                    dtype: data[0],
                    id_name: data[1],
                    id_details: [...data[2]]
                }
            }
        %}

declare_choice -> 
        # %id declare_choice_choice
        variable 
        {%
            (data) => {
                return [data[0]]
            }
        %}
    |   array 
        {%
            (data) => {
                return [data[0]]
            }
        %}
    |   null
        {%
            (data) => {
                return [data[0]]
            }
        %}

struct_declare ->
        %struct %id %open_brace first_struct %close_brace
        {%
            (data) => {
                return {
                    type: "structure_declaration",
                    id_name: data[1],
                    struct_body: [...data[3]]
                }
            }
        %}

#changed comment to %singleComment; it's on statement_choice
main_statement ->
        statement_choice main_statement
        {%
            (data) => {
                return [data[0], ...data[1]]
            }
        %}
    |   null
        {%
            (data) => {
                return [data[0]]
            }
        %}

#changed comment to %singleComment
function ->
        %task function_data_type %id %open_paren parameter %close_paren %open_brace in_function_statement %close_brace function
        {%
            (data) => {
                return [
                    {
                        type: "user_function",
                        function_dtype: data[1],
                        function_name: data[2],
                        arguments: [...data[4]],
                        function_body: [...data[7]]
                    },
                    ...data[9]
                ]
            }
        %}
    |   null
        {%
            (data) => {
                return [data[0]]
            }
        %}

# data_type -> 
        %int                                    {% id %}
    |   %dec                                    {% id %}
    |   %str                                    {% id %}
    |   %bool                                   {% id %}

function_data_type -> 
        data_type                               {% id %}
    |   %empty                                  {% id %}

negation ->
        %negative                               {% id %}
    |   null                                    {% id %}

# int_literal ->
        %posi_int_literal                       {% id %}
    |   %nega_int_literal                       {% id %}

# literal -> 
        int_literal                             {% id %}
    |   %dec_literal                            {% id %}
    |   %str_literal string_access              {% id %}
    |   %bool_literal                           {% id %}

#changed array_size to struct_size
# string_access ->
        %access %open_bracket struct_size %close_bracket
        {% 
            (data) => {
                return data[2]
            }
        %}
    |   null                                    {% id %}

#created new recur_assign, assign_choice
recur_assign -> 
        %equal %id struct_choice recur_assign
        {%
            (data) => {
                return[
                    {
                        type: "additional_assign",
                        id_name: data[1],
                        id_details: [data[2]]
                    },
                    ...data[3]
                ]
            }
        %}
    |   null
        {%
            (data) => {
                return [data[0]]
            }
        %}

#added string_access
assign_choice -> #temporarily changed assign_struct to struct_choice
        struct_choice string_access recur_assign %equal variable_choice
        {%
            (data) => {
                return{
                    type: "assign",
                    id_details: [...data[0], data[1]],
                    more_id: [...data[2]],
                    value: [...data[4]]
                }
            }
        %}  

assign_statement ->
        assign_choice %terminator 
        {%
            (data) => {
                return [data[0]]
            }
        %}

iterate_intdec ->
        int_literal                                         {% id %}
    |   %dec_literal                                        {% id %}


first_choice ->
        struct_new                                          {% id %}
    |   function_call_statement_choice                      {% id %}
    |   null                                                {% id %}

variable_next_choice ->
        oper_choice condition
        {%
            (data) => {
                return{
                    type: "condition",
                    operator: data[0],
                    operand: data[3]
                }
            }
        %}
    |   null                                                {% id %}

variable_next ->
        oper_condition
    |   oper_compute

variable_next_null ->
    oper_choice condition
    |   %arith_oper compute_choice
    |   null

iterate_choice ->
        %unary_oper
    |   %assign_oper iterate_intdec
    |   %access %open_bracket struct_size %close_bracket
    #|   null

iterate_first_choice ->
        iterate_choice
    |   null

choice_choice_choice ->
        first_compute_choice
    |   first_condition_choice
    #|   iterate_choice
    |   null

# choice ->
        struct_new iterate_first_choice choice_choice_choice
    |   function_call_statement_choice iterate_first_choice choice_choice_choice
    |   iterate_choice choice_choice_choice
    #     struct_new choice_choice_choice #iterate_choice
    # |   function_call_statement_choice choice_choice_choice #iterate_choice
     #   first_choice iterate_choice choice_choice_choice #(di ka na kailangan)
    |   first_compute_choice #variable_next_choice #added this for computes with id at the start
    |   first_condition_choice #variable_next_choice #added this for conditions with id at the start
    |   null

choice_less -> 
        struct_new choice_choice_choice
    |   function_call_statement_choice choice_choice_choice
    #     struct_new choice_choice_choice #iterate_choice
    # |   function_call_statement_choice choice_choice_choice #iterate_choice
     #   first_choice iterate_choice choice_choice_choice #(di ka na kailangan)
    |   first_compute_choice #variable_next_choice #added this for computes with id at the start
    |   first_condition_choice #variable_next_choice #added this for conditions with id at the start
    |   null

negative_choice ->
        %open_paren compute_choice %close_paren oper_compute
    |   %id choice_less

not_many ->
        %not not_again
    
not_again ->
        %not not_again
    |   null

not_choice ->
        %open_paren condition %close_paren oper_condition
    |   %id choice



# variable_choice ->
        %id choice #variable_next_choice
  # |   condition_less_choice_choice
    |   condition_notter_less oper_condition
    |   not_many not_choice #repeated !!!
    |   %negative negative_choice 
    |   %open_paren choice %close_paren variable_next_null
    #|   condition
    #|   compute_choice
    #     condition %close_paren oper_condition
    # |   compute_choice %close_paren oper_compute

variable -> #changed recur_variable to declare_choice
        %equal variable_choice recur_variable
    |   %comma %id declare_choice
    #|   recur_variable
    #|   null

recur_variable -> #changed recur_variable to declare_choice, removed array
        #array
      %equal variable_choice recur_variable
    |   %comma %id declare_choice
    |   null


struct_unary -> #changed iterate_choice to iterate_intdec
        %assign_oper iterate_intdec
    |   id_array %unary_oper

#added this to remove ambiguity with id
# struct_size_choice ->
        id_array
    |   function_call_statement_choice
    |   first_compute_choice #added this for computes with id at the start
    |   struct_unary

#added struct_size_choice
#changed unary to %unary_oper
# struct_size ->
        %id struct_size_choice
    #|   %posi_int_literal (removed bc of ambiguity)
    |   compute_choice_less #changed compute_choice to compute_choice_less
    |   %unary_oper %id struct_choice #changed id_array to struct_choice

assign_struct_2D ->
        %open_bracket struct_size %close_bracket
    |   null

assign_struct_size ->
        %open_bracket struct_size %close_bracket assign_struct_2D
    |   null

#changed array_size to struct_size
assign_array_2D ->
        %open_bracket struct_size %close_bracket 
    |   null

#changed array_size to struct_size
assign_array ->
         %open_bracket struct_size %close_bracket assign_array_2D


recur_array ->
        %comma %id declare_choice
    |   null

#changed array_size to struct_size
array -> #changed recur_variable to recur_array
        %open_bracket struct_size %close_bracket array_define_first recur_array

#changed array_size to struct_size
array_define_first ->
        %equal %open_brace condition additional_literal_1D %close_brace
    |   %open_bracket struct_size %close_bracket array_define_second
    |   null

array_define_second ->
        %equal %open_brace %open_brace condition additional_literal_1D %close_brace additional_literal_2D %close_brace
    #|   null (di ko alam bakit dapat wala to, i am so confused but it fixed it)

additional_literal_1D ->
        %comma condition additional_literal_1D
    |   null

additional_literal_2D ->
        %comma %open_brace condition additional_literal_1D %close_brace additional_literal_2D
    |   null

statement ->
        statement_choice
    |   %open_brace function_statement %close_brace

function_statement -> 
        statement_choice function_statement
    |   null

#changed comment to %singleComment
#changed unary to %unary_oper
statement_choice ->
        data_declare
    |   vital_define
    |   out_statement 
    |   in_statement 
    |   loop_statement 
    |   if_statement 
    |   switch_statement 
    |   %id id_start_statement
    |   %unary_oper %id assign_next_choice %terminator #kulang to
    #|   return_statement #removed for main functio
    |   control_statement 
    |   %clean %open_paren %close_paren %terminator
    |   %singleComment

assign_next_choice ->
        struct_choice
    |   null

statement_in_function ->
        function_statement_choice
    |   %open_brace in_function_statement %close_brace

in_function_statement -> 
        function_statement_choice in_function_statement
    |   null

#changed comment to %singleComment
#changed unary to %unary_oper
function_statement_choice ->
        data_declare
    |   vital_define
    |   out_statement 
    |   in_statement 
    |   function_loop_statement 
    |   function_if_statement 
    |   function_switch_statement 
    |   %id id_start_statement
    |   %unary_oper %id assign_next_choice %terminator #kulang to
    |   return_statement
    |   control_statement 
    |   %clean %open_paren %close_paren %terminator
    |   %singleComment

id_start_statement ->
        %id struct_define_choice
    |   struct_choice iterate_statement_choice %terminator
    |   assign_statement
    |   iterate_statement_choice %terminator
    |   function_call_statement_choice %terminator

#added this for function
function_loop_statement ->
        %loopFor %open_paren for_initial %terminator for_condition %terminator iterate_statement %close_paren statement_in_function
    |   %loopWhile %open_paren variable_choice %close_paren statement_in_function #changed condition to variable_choice
    |   %loopDo statement_in_function %loopWhile %open_paren condition %close_paren %terminator

#added this for function
function_if_statement -> #bakit variable_choice to??? yung iba condition ha
        %stateIf %open_paren variable_choice %close_paren statement_in_function function_else_choice

#added this for function
function_else_choice -> 
        %stateElse statement_in_function
    |   %elf %open_paren variable_choice %close_paren statement_in_function else_choice #changed condition to variable_choice
    |   null

#added this for function
function_switch_statement ->
        %stateSwitch %open_paren switch_choice %close_paren %open_brace %vote vote_choice %colon in_function_statement %kill %terminator vote %stateDefault %colon in_function_statement %close_brace

struct_define_choice ->
        parameter_define %terminator

# function_call_statement_choice ->
        %open_paren function_call %close_paren

#changed unary to %unary_oper
iterate_statement_choice -> #changed interate_choice to iterate_intdec
        %unary_oper
    |   %assign_oper iterate_intdec
    #|   null

control_statement ->
        %control %terminator
    |   %kill %terminator

out_statement ->
        %shoot %open_paren output %close_paren %terminator

output -> 
        variable_choice recur_output

recur_output ->
        %comma variable_choice recur_output
    |   null

in_statement ->
        %scan %open_paren in_choice %close_paren %terminator

in_choice_choice ->
       # id_array 
        struct_new string_access
    |   %access %open_bracket struct_size %close_bracket
    |   null

#added in_choice_choice
in_choice ->
        %id in_choice_choice recur_id
    #|   struct_statement recur_id 

recur_id ->
        %comma %id in_choice_choice
    |   null

id_choice ->
        %dot %id assign_array
    |   null

digit_choice ->
        notter digit_notter

#added this to remove ambiguity PERO PARANG MERON PA RIN E
digit_another_choice ->
        #id_array
        function_call_statement_choice
    |   struct_new
    |   null

#moved function_call_statement, struct_statement to digit_another_choice
digit_notter ->
        int_literal
    |   %dec_literal
    |   negation %id digit_another_choice #this is still an ambiguity (di ba hindi na????)



compute_choice ->
        computation
    |   negation %open_paren compute_choice %close_paren oper_compute

computation ->
        digit_choice oper_compute

oper_compute ->
        %arith_oper compute_choice
    |   null



#added this for computes that have id at the start
first_compute_choice -> 
        %arith_oper compute_choice variable_next_choice #close



digit_notter_less ->
        int_literal
    |   %dec_literal

compute_choice_less_less -> 
        oper_compute
    |   negation %open_paren compute_choice %close_paren oper_compute

compute_choice_less -> #changed digit_choice_less to digit_notter_less
        digit_notter_less oper_compute
    |   negation %open_paren compute_choice %close_paren oper_compute



#changed unary to %unary_oper
iterate_statement_condition ->
        unary_choice iterate_unary
    |   %unary_oper unary_choice iterate_statement_extra

#changed unary to %unary_oper
iterate_statement_condition_less -> #changed struct_statement_choice to struct_choice
        struct_choice iterate_unary
    |   %unary_oper unary_choice iterate_statement_extra



condition_notter_choice ->
        struct_new #iterate_choice
    |   function_call_statement_choice #iterate_choice
    |   iterate_choice #(di ka na kailangan)
    |   first_compute_choice #added this for computes with id at the start
    |   null

#added condition_notter_choice
condition_notter ->
        negation %id condition_notter_choice #condition_notter_choice #may problem pa to kasi pwedeng i-negate yung string access
    #|   literal
    |   %str_literal string_access
    |   %bool_literal
    |   int_literal oper_compute
    |   %dec_literal oper_compute
    #|   iterate_statement_condition
    |   %unary_oper unary_choice 
    #|   %unary_oper unary_choice iterate_statement_extra
    #|   compute_choice_less #changed compute_choice to compute_choice_less

condition -> #moved conditional, and notter %open_paren... to conditional_choice
        notter conditional_choice
       
conditional_choice -> #added this to remove ambiguity with notter
        conditional 
    |   %open_paren condition %close_paren oper_condition

conditional -> #changed condition_choice to condition_notter
        condition_notter oper_condition

oper_condition ->
        oper_choice condition
    |   null

first_condition_choice ->
    oper_choice condition #variable_next_choice



#listed all literals to remove ambiguity of their next 
condition_notter_less ->
     #   literal
        %str_literal string_access
    |   %bool_literal
    |   int_literal oper_compute
    |   %dec_literal oper_compute
    #|   iterate_statement_condition
    |   %unary_oper unary_choice 
    #iterate_statement_extra #ambiguity on iterate_statement_extra (dugtong to sa taas pero baka di na)
    #|   compute_choice_less_less


condition_less -> #moved condition_choice.... and %open_paren... to condition_less_choice_choice
        notter condition_less_choice_choice
        
condition_less_choice_choice -> #added this to remove ambiguity with notter
        condition_notter_less oper_condition
    |   notter %open_paren condition %close_paren oper_condition
    #|   %id oper_condition

oper_choice ->
        %relation_oper
    |   %logical_oper

notter ->
        %not
    |   null

for_int ->
        %int
    |   null

for_choice -> 
        compute_choice
    |   notter for_notter 

#changed for_notter_choice (deleted) to digit_another_choice
for_notter -> 
        #literal
       #negation %id digit_another_choice string_access
       iterate_statement

for_initial ->
        for_int %id %equal for_choice for_initial_extra
    |   null
    
for_initial_extra ->
        %comma for_initial
    |   null

iterate_statement_extra ->
        %comma iterate_statement
    |   null

#changed iterate_choice_choice (deleted) to digit_another_choice
iterate_choice ->
        int_literal
    |   %dec_literal
    |   %id digit_another_choice

unary_choice -> #changed struct_statement_choice to struct_choice
        %id struct_choice
    #|   struct_statement_choice

iterate_statement ->
        unary_choice iterate_unary
    |   %unary_oper unary_choice iterate_statement_extra
    |   null

#changed unary to %unary_oper
iterate_unary -> #changed iterate_choice to iterate_intdec
        %unary_oper iterate_statement_extra
    |   %assign_oper iterate_intdec iterate_statement_extra

recur_for_condition ->
        %logical_oper for_condition
    |   null

for_condition_extra ->
        %comma for_condition
    |   null

for_choice_extra ->
        for_choice
    |   %open_paren for_choice %close_paren

for_condition ->
        variable_choice for_condition_extra #changed condition to variable_choice
    |   null

loop_statement ->
        %loopFor %open_paren for_initial %terminator for_condition %terminator iterate_statement %close_paren statement
    |   %loopWhile %open_paren variable_choice %close_paren statement #changed condition to variable_choice
    |   %loopDo statement %loopWhile %open_paren variable_choice %close_paren %terminator

if_statement ->
        %stateIf %open_paren variable_choice %close_paren statement else_choice

else_choice ->
        %stateElse statement
    |   %elf %open_paren variable_choice %close_paren statement else_choice #changed condition to variable_choice
    |   null

#changed array_size to struct_size
switch_choice -> 
        notter switch_notter
    |   %str_literal %access %open_bracket struct_size %close_bracket

#changed switch_notter_choice (deleted) to digit_another_choice
switch_notter ->
        %id digit_another_choice string_access

switch_statement ->
        %stateSwitch %open_paren switch_choice %close_paren %open_brace %vote vote_choice %colon function_statement %kill %terminator vote %stateDefault %colon function_statement %close_brace

vote_choice ->
        int_literal
    |   %str_literal string_access

vote ->
        %vote vote_choice %colon function_statement %kill %terminator vote
    |   null

return_next_choice ->
        function_choice %close_paren variable_next_null
    |   %close_paren 

function_choice ->
        struct_new iterate_first_choice choice_choice_choice
    |   function_call_statement_choice iterate_first_choice choice_choice_choice
    |   iterate_choice choice_choice_choice
    #     struct_new choice_choice_choice #iterate_choice
    # |   function_call_statement_choice choice_choice_choice #iterate_choice
     #   first_choice iterate_choice choice_choice_choice #(di ka na kailangan)
    |   first_compute_choice #variable_next_choice #added this for computes with id at the start
    |   first_condition_choice #variable_next_choice #added this for conditions with id at the start
    #|   null

return_choice ->
        %id choice #variable_next_choice
  # |   condition_less_choice_choice
    |   condition_notter_less oper_condition
    |   not_many not_choice #repeated !!!
    |   %negative negative_choice 
    |   %open_paren return_next_choice
    |   null

return_statement ->
        %stateReturn return_choice %terminator



recur_declare ->
        %comma parameter_define

first_struct -> 
        data_type %id parameter_define %terminator recur_struct

recur_struct -> 
        data_type %id parameter_define %terminator recur_struct
    |   null

struct_define ->
        %id parameter_define %terminator

assign_struct ->
        struct_choice element

struct_statement ->
        %id struct_choice element

struct_new ->
        %open_bracket struct_size %close_bracket extra_struct element
    |   %dot %id element_choice


#temporarily removed string_access from struct_choice, extra_struct, element_choice, element_option (think about this)
#changed array_size to struct_size
struct_choice ->
        %open_bracket struct_size %close_bracket extra_struct element
    |   null

#changed array_size to struct_size
extra_struct ->
        %open_bracket struct_size %close_bracket #element
    #|   element
    |   null

#changed array_size to struct_size
element_choice ->
        %open_bracket struct_size %close_bracket element_option
    |   null

#changed array_size to struct_size
element_option ->
        %open_bracket struct_size %close_bracket
    |   null

element ->
        %dot %id element_choice
    |   null

recur_define ->
        %comma %id assign_struct_size recur_define
        {%
            (data) => {
                return[
                    {
                        id_name: data[1],
                        size: data[2]
                    },
                    ...data[3]
                ]
            }
        %}
    |   null
        {%
            (data) => {
                return [data[0]]
            }
        %}

parameter_define ->
        assign_struct_size recur_define
        {%
            (data) => {
                return[
                    {
                        size: data[0]
                    },
                    ...data[1]
                ]
            }
        %}

array_parameter ->
        %open_bracket %close_bracket
        {%
            (data) => {
                return data[0] + data[1]
            }
        %}
    |   null                                      {% id %}

parameter -> 
        data_type %id array_parameter recur_parameter
        {%
            (data) => {
                return[
                    {
                        parameter_dtype: data[0],
                        parameter_name: data[1],
                        parameter_details: data[2]
                    },
                    data[3]
                ]
            }
        %}
    |   null
        {%
            (data) => {
                return [data[0]]
            }
        %}

recur_parameter ->
        %comma parameter
        {%
            (data) => {
                return [...data[1]]
            }
        %}
    |   null                                      {% id %}

#changed array_size to struct_size
# id_array ->
        %open_bracket struct_size %close_bracket id_array_2D
        {%
            (data) => {
                return{
                    type: "array_size_1",
                    size_1: data[1],
                    size_2: data[3]
                }
            }
        %}
    |   null                                      {% id %}

#changed array_size to struct_size
id_array_2D ->
        %open_bracket struct_size %close_bracket
        {%
            (data) => {
                return data[1]
            }
        %}

function_call_statement ->
        %id %open_paren function_call %close_paren
        {%
            (data) => {
                return{
                    type: "function_call",
                    function_name: data[0],
                    arguments: [...data[2]]
                }
            }
        %}

# function_call -> #temporarily changed function_variables to variable_choice
        variable_choice additional_call
        {%
            (data) => {
                return[data[1], data[2]]
            }
        %}
    |   null
        {%
            (data) => {
                return[data[0]]
            }
        %}

# additional_call -> #temporarily changed function_variables to variable_choice
        %comma variable_choice additional_call
        {%
            (data) => {
                return[data[1], ...data[2]]
            }
        %}
    |   null
        {%
            (data) => {
                return[data[0]]
            }
        %}

#changed array_size to struct_size
oper ->
        %arith_oper struct_size oper
        {%
            (data) => {
                return[
                    {
                        operator: data[0],
                        operand: data[1],
                    },
                    ...data[2]
                ]
            }
        %}
    |   null