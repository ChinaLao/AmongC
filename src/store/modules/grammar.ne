@{%
    const moo = require("moo");
    //const IndentationLexer = require("moo-indentation-lexer")

    const lexer = moo.compile({

        //special characters
        assign_oper: ["appendAssign", "minusEqual", "multiplyEqual", "divideEqual", "exponentEqual", "floorEqual", "moduloEqual"], 
        append: "append", //added this for string append
        arith_oper: ["minus", "multiply", "divide", "exponent", "floor", "modulo"], //removed append
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
    }); 
%}

@lexer lexer

program -> 
        global %IN main_statement %OUT function %eof

#changed comment to %singleComment; moved it to global_choice
global -> 
        global_choice global
    #|   %singleComment global 
    |   null

global_choice -> 
        vital_define 
    |   data_declare
    |   struct_declare
    #|   %singleComment

vital_define -> #changed %equal literal recur_vital to declare_choice
        %vital data_type %id vital_declare_choice %terminator

vital_declare_choice ->
        vital_variable recur_vital
    |   vital_array recur_vital

recur_vital ->  #changed %id %equal literal recur_vital to variable, array
        %comma %id vital_choices recur_vital
    |   null

vital_choices ->
        vital_variable
    |   vital_array

#temporarily moved %id to declare_choice
data_declare -> 
        data_type %id declare_choice %terminator 

declare_choice -> 
        # %id declare_choice_choice
        variable 
    |   array 
    |   null

struct_declare ->
        %struct %id %open_brace first_struct %close_brace

#changed comment to %singleComment; it's on statement_choice
main_statement ->
        statement_choice main_statement
    #|   %singleComment main_statement
    |   null

#changed comment to %singleComment
function ->
        %task function_data_type %id %open_paren parameter %close_paren %open_brace in_function_statement %close_brace function
    #|   %singleComment function
    |   null

data_type -> 
        %int 
    |   %dec 
    |   %str 
    |   %bool

function_data_type -> 
        data_type 
    |   %empty

negation ->
        %negative
    |   null

int_literal ->
        %posi_int_literal
    |   %nega_int_literal

#not used so removed
# literal -> 
#         int_literal 
#     |   %dec_literal 
#     |   %str_literal string_access
#     |   %bool_literal

#changed array_size to struct_size
string_access ->
        %access %open_bracket struct_size %close_bracket
    |   null

# declare_choice_choice ->
#         variable 
#     |   array 

#recur_assign -> 
  #      %equal %id recur_assign
  #  |   assign_choice
  #  |   null

#assign_choice -> 
  #      recur_assign %equal variable_choice 
  #  |   assign_array recur_assign %equal variable_choice 
  #  |   assign_struct recur_assign %equal variable_choice

#HERE
#created new recur_assign, assign_choice
# recur_assign -> 
#         %equal %id iterate_id recur_assign #changed struct_choice to iterate_id
#     |   null

# #new
# recur_assign_choice ->
#        struct_new iterate_first_choice choice_choice #changed choice_choice_choice to choice_choice
#     |   function_call_statement_choice iterate_first_choice choice_choice #changed choice_choice_choice to choice_choice
#     |   iterate_choice choice_choice #changed choice_choice_choice to choice_choice
#     #     struct_new choice_choice_choice #iterate_choice
#     # |   function_call_statement_choice choice_choice_choice #iterate_choice
#      #   first_choice iterate_choice choice_choice_choice #(di ka na kailangan)
#     |   first_compute_choice #variable_next_choice #added this for computes with id at the start
#     |   first_condition_choice #variable_next_choice #added this for conditions with id at the start
#     #|   null

# #new
# assign_choice_choice ->
#         recur_assign_choice
#     |   recur_assign recur_choice_choice

# #new
# recur_choice ->
#         %id assign_choice_choice #struct_choice string_access
#     #|   choice #variable_next_choice
#     |   condition_notter_less oper_condition
#     |   not_many not_choice #repeated !!!
#     |   %negative negative_choice 
#     |   %open_paren variable_choice %close_paren variable_next_null #changed choice to variable_choice

# #new
# recur_choice_choice ->
#         %equal variable_choice
#     |   null
#UP TO HERE COMMENTED BC I USED RECUR_VARIABLE INSTEAD

#added string_access
assign_choice -> #temporarily changed assign_struct to struct_choice
        iterate_id string_access %equal recur_variable #variable_choice #changed struct_choice to iterate_id #changed recur_choice to recur_variable
       
assign_statement ->
        assign_choice %terminator 

#BAKA DI NA TO KAILANGAN
# variable_array ->
#         assign_array
#     |   null

#added for iterate with ids
iterate_id ->
       struct_new
    |   null

iterate_intdec ->
        int_literal
    |   %dec_literal
    |   %id iterate_id #added this for ids

#not used so removed
# first_choice ->
#         struct_new
#     |   function_call_statement_choice
#     |   null

#ambiguity (wala na ata)
# variable_choice ->
#        # compute_choice
#         #%id variable_array string_access
#        # literal
#     # |   %str_literal access
#     # |   %bool_literal
#         variable_choice_choice
       # %id choice
    #|  compute_choice_less #changed compute_choice to compute_choice_less
    #|  condition_choice_less oper_condition #changed condition_less to condition_choice_less oper_condition
    #|  notter negation %open_paren variable_choice_choice
   # |   condition_less

variable_next_choice ->
        oper_choice condition
    |   null

#not used so removed
# variable_next ->
#         oper_condition
#     |   oper_compute
    #|   null

variable_next_null ->
    oper_choice condition
|   arith_oper compute_choice #changed %arith_oper to arith_oper
|   null

# new_choice -> #added this to remove ambiguity with notter
#         conditional 
#     |   %open_paren condition %close_paren variable_next

iterate_choice ->
        %unary_oper
    |   %assign_oper iterate_intdec
    |   %access %open_bracket struct_size %close_bracket
    #|   null

iterate_first_choice ->
        iterate_choice
    |   null

#changed choice_choice_choice to choice_choice
choice_choice ->
        first_compute_choice oper_condition
    |   first_condition_choice oper_compute
    #|   iterate_choice
    |   null

choice ->
        struct_new iterate_first_choice choice_choice #changed choice_choice_choice to choice_choice
    |   function_call_statement_choice iterate_first_choice choice_choice #changed choice_choice_choice to choice_choice
    |   iterate_choice choice_choice #changed choice_choice_choice to choice_choice
    #     struct_new choice_choice_choice #iterate_choice
    # |   function_call_statement_choice choice_choice_choice #iterate_choice
     #   first_choice iterate_choice choice_choice_choice #(di ka na kailangan)
    |   first_compute_choice oper_condition #added oper_condition #variable_next_choice #added this for computes with id at the start
    |   first_condition_choice oper_compute #added oper_compute #variable_next_choice #added this for conditions with id at the start
    |   null

#removed bc unused
# choice_less -> 
#         struct_new choice_choice #changed choice_choice_choice to choice_choice
#     |   function_call_statement_choice choice_choice #changed choice_choice_choice to choice_choice
#     #     struct_new choice_choice_choice #iterate_choice
#     # |   function_call_statement_choice choice_choice_choice #iterate_choice
#      #   first_choice iterate_choice choice_choice_choice #(di ka na kailangan)
#     |   first_compute_choice #variable_next_choice #added this for computes with id at the start
#     |   first_condition_choice #variable_next_choice #added this for conditions with id at the start
#     |   null

negative_choice ->
        %open_paren compute_choice %close_paren oper_compute
    |   %id choice #changed choice_less to choice

not_many ->
        %not not_again
    
not_again ->
        %not not_again
    |   null

not_choice ->
        %open_paren condition %close_paren oper_condition
    |   %id choice

# negative_many ->
#         %negative negative_again

# negative_again ->
#         %negative negative_again
#     |   null

variable_again ->
        %equal recur_variable
    #|   %comma %id declare_choice
    |   null

variable_recur ->
        struct_new iterate_first_choice choice_choice variable_again #changed iterate_id back to struct_new
    |   function_call_statement_choice iterate_first_choice choice_choice variable_again
    |   iterate_choice choice_choice
    |   first_compute_choice oper_condition #added oper_condition
    |   first_condition_choice oper_compute #added oper_compute
    |   variable_again #changed %comma %id variable_again to variable_again

# oper_choices ->
#         oper_condition oper_choices
#     |   oper_compute oper_choices

variable_recur_iterate ->
        struct_new choice_choice #variable_again #changed iterate_id back to struct_new
    #|   function_call_statement_choice iterate_first_choice choice_choice variable_again
    #|   iterate_choice choice_choice
    |   first_compute_choice oper_condition #added oper_condition
    |   first_condition_choice oper_compute #added oper_compute
    #|   variable_again #changed %comma %id variable_again to variable_again

recur_variable ->
        %id variable_recur
    |   condition_notter_less oper_condition #oper_compute
    |   not_many not_choice 
    |   %negative negative_choice 
    |   %open_paren variable_choice %close_paren variable_next_null
    |   %unary_oper %id variable_recur_iterate #added this ++id

variable ->
        %equal recur_variable recur_array
    |   %comma %id declare_choice 

vital_variable ->
        %equal recur_variable recur_array
    #|   %comma %id declare_choice 


# variable_recur_assign ->
#         %equal recur_variable_choice #variable_repeat
#     |   recur_variable_assign
#     |   null

# recur_variable_assign ->
#         struct_new iterate_first_choice choice_choice
#     |   function_call_statement_choice iterate_first_choice choice_choice
#     |   iterate_choice choice_choice
#     |   first_compute_choice 
#     |   first_condition_choice

# recur_id_choices ->
#         recur_variable_assign
#     |   variable_recur_assign recur_variable

# recur_variable_choice ->
#         %id recur_id_choices
#     #|   choice #variable_next_choice
#     |   condition_notter_less oper_condition
#     |   not_many not_choice #repeated !!!
#     |   %negative negative_choice 
#     |   %open_paren variable_choice %close_paren variable_next_null #changed choice to variable_choice

# variable -> #changed recur_variable to declare_choice
#         %equal recur_variable_choice #recur_variable #variable_choice recur_variable
#     |   %comma %id declare_choice #changed variable_choice to %id
#     #|   recur_variable
#     #|   null

# recur_variable -> #changed recur_variable to declare_choice, removed array
#         #array
#         %equal variable_choice #%id recur_variable
#         %comma %id declare_choice
#     |   null

variable_choice ->
        %id choice #variable_next_choice
  # |   condition_less_choice_choice
    |   condition_notter_less oper_condition
    |   not_many not_choice #repeated !!!
    |   %negative negative_choice 
    |   %open_paren variable_choice %close_paren variable_next_null #changed choice to variable_choice
    #|   condition
    #|   compute_choice
    #     condition %close_paren oper_condition
    # |   compute_choice %close_paren oper_compute

#DI KA NA ATA KAILAGAN HOHO
# array_size ->
#         struct_size 
#     #|   struct_statement array_unary
#     #|   unary struct_statement

# array_unary ->
#         unary
#     |   null

#changed unary to %unary_oper
struct_unary -> #changed iterate_choice to iterate_intdec
        %assign_oper iterate_intdec
    |   id_array %unary_oper

#added this to remove ambiguity with id
struct_size_choice ->
        iterate_id iterate_unary_null #changed id_array to struct_new iterate_unary #changed struct_new to iterate_id
    |   function_call_statement_choice iterate_unary_null
    |   first_compute_choice #added this for computes with id at the start
    |   %unary_oper unary_choice
    #|   null
    #|   struct_unary 

#added struct_size_choice
#changed unary to %unary_oper
struct_size ->
        %id struct_size_choice
    #|   %posi_int_literal (removed bc of ambiguity)
    |   struct_compute_choice #changed compute_choice to compute_choice_less #changed compute_choice_less to struct_compute_choice
    |   %unary_oper %id iterate_id #changed id_array to struct_choice #changed struct_choice to iterate_id

#for negative numbers
oper_compute_none ->
        %arith_oper compute_choice
    |   %append append_choice

#added this for negative numbers
struct_compute_choice ->
        %posi_int_literal oper_compute
    |   %nega_int_literal oper_compute_none
    |   negation %open_paren compute_choice %close_paren oper_compute

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

# array_recur_choice ->
#         %comma declare_choice
#     |   null

vital_array -> #changed recur_variable to recur_array
        %open_bracket struct_size %close_bracket vital_array_define_first #recur_array

#changed array_size to struct_size
vital_array_define_first ->
        %equal %open_brace condition additional_literal_1D %close_brace
    |   %open_bracket struct_size %close_bracket vital_array_define_second
    #|   null

vital_array_define_second ->
        %equal %open_brace %open_brace condition additional_literal_1D %close_brace additional_literal_2D %close_brace
    #|   null #(di ko alam bakit dapat wala to, i am so confused but it fixed it)

#added this for array
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
    |   null #(di ko alam bakit dapat wala to, i am so confused but it fixed it)

additional_literal_1D ->
        %comma condition additional_literal_1D
    |   null

additional_literal_2D ->
        %comma %open_brace condition additional_literal_1D %close_brace additional_literal_2D
    |   null

statement ->
        #statement_choice #temporarily removed
       %open_brace function_statement %close_brace

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
    |   %unary_oper %id iterate_id %terminator #kulang to #changed assign_next_choice to iterate_id
    #|   return_statement #removed for main functio
    #|   control_statement 
    |   %clean %open_paren %close_paren %terminator
    #|   %singleComment

#removed bc unused
# assign_next_choice ->
#         struct_choice
#     |   null

statement_in_function ->
        #function_statement_choice #temporarily removed
        %open_brace in_function_statement %close_brace

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
    |   %unary_oper %id iterate_id %terminator #kulang to #changed assign_next_choice to iterate_id
    |   return_statement
    #|   control_statement 
    |   %clean %open_paren %close_paren %terminator
    #|   %singleComment

id_start_statement ->
        %id struct_define_choice
    |   iterate_id iterate_statement_choice %terminator #changed struct_choice to iterate_id
    |   assign_statement
    #|   iterate_statement_choice %terminator #removed bc of ambiguity
    |   function_call_statement_choice %terminator

#added this for function
function_loop_statement ->
        %loopFor %open_paren for_initial %terminator for_condition %terminator iterate_statement %close_paren statement_in_function
    |   %loopWhile %open_paren variable_choice %close_paren statement_in_function #changed condition to variable_choice
    |   %loopDo statement_in_function %loopWhile %open_paren variable_choice %close_paren %terminator #changed condition to variable_choice

#added this for function
function_if_statement -> #bakit variable_choice to??? yung iba condition ha
        %stateIf %open_paren variable_choice %close_paren statement_in_function function_else_choice

#added this for function
function_else_choice -> 
        %stateElse statement_in_function
    |   %elf %open_paren variable_choice %close_paren statement_in_function function_else_choice #changed condition to variable_choice
    #|   %singleComment function_else_choice
    |   null

#added this for function
function_switch_statement ->
        %stateSwitch %open_paren switch_choice %close_paren %open_brace %vote vote_choice %colon in_function_statement %kill %terminator vote %stateDefault %colon in_function_statement %close_brace

struct_define_choice ->
        parameter_define %terminator

function_call_statement_choice ->
        %open_paren function_call %close_paren

#changed unary to %unary_oper
iterate_statement_choice -> #changed interate_choice to iterate_intdec
        %unary_oper
    |   %assign_oper iterate_intdec
    #|   null

# control_statement ->
#         %control %terminator
#     |   %kill %terminator

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
        %comma %id in_choice_choice recur_id #added recur_id
    |   null

#not used so removed
# id_choice ->
#         %dot %id assign_array
#     |   null

digit_choice ->
        notter digit_notter

#added this to remove ambiguity PERO PARANG MERON PA RIN E
digit_another_choice ->
        #id_array
        #function_call_statement_choice
        struct_new
    |   null

digit_another_choice_iterate ->
        function_call_statement_choice
    |   struct_new %unary_oper
    |   %unary_oper
    |   null

#TEKA LANG, COMMENT LANG SAGLIT TONG DIGIT_NOTTER KASI GUMAWA AKO BAGO
#moved function_call_statement, struct_statement to digit_another_choice
# digit_notter ->
#         int_literal
#     |   %dec_literal
#     |   negation %id digit_another_choice #this is still an ambiguity (di ba hindi na????)

# compute_choice -> 
#         digit_choice %arith_oper compute_choice recur_compute
#     |   %open_paren digit_choice additional_compute %close_paren recur_compute
#     |   compute

# compute ->
#         digit_choice
#     |   %open_paren digit_choice %close_paren

# recur_compute ->
#         additional_compute
#     |   null

# additional_compute ->
#         %arith_oper digit_choice recur_compute
#     |   extra_compute

# extra_compute ->
#         %arith_oper compute_choice

combined ->
        compute_choice
    |   condition

compute_choice ->
        computation
    |   negation %open_paren combined %close_paren oper_compute

computation ->
        digit_choice oper_compute

#TEKA COMMENT KA LANG SAGLIT KASI MAY BAGO
# oper_compute ->
#         arith_oper compute_choice
#     |   null

# close ->
#         %close_paren
#     |   null

oper_compute ->
        %arith_oper compute_choice
    |   %append append_choice
    |   null

digit_notter ->
        int_literal
    |   %dec_literal
    |   %negative %id digit_another_choice_iterate
    |   %id digit_another_choice_iterate
    |   %unary_oper %id digit_another_choice

append_choice ->
        compute_choice
    |   %str_literal string_append

string_append ->
        %append string_append_choice append_again
    |   null

first_compute_choice ->
        %arith_oper compute_choice variable_next_choice
    |   %append append_choice

#TEKA LANG COMMENT KO LANG TO SAGLIT KASI MAY BAGO HA
#added this for computes that have id at the start
# first_compute_choice -> 
#         arith_oper compute_choice variable_next_choice #close #changed %arith_oper to arith_oper

digit_notter_less ->
        int_literal
    |   %dec_literal

#not used so removed
# compute_choice_less_less -> 
#         oper_compute
#     |   negation %open_paren compute_choice %close_paren oper_compute

#removed bc unused
# compute_choice_less -> #changed digit_choice_less to digit_notter_less
#         digit_notter_less oper_compute
#     |   negation %open_paren compute_choice %close_paren oper_compute

# compute_less ->
#         digit_choice_less
#     |   %open_paren digit_choice %close_paren

#not used so removed
#changed unary to %unary_oper
# iterate_statement_condition ->
#         unary_choice iterate_unary
#     |   %unary_oper unary_choice iterate_statement_extra

#not used so removed
#changed unary to %unary_oper
# iterate_statement_condition_less -> #changed struct_statement_choice to struct_choice
#         struct_choice iterate_unary
#     |   %unary_oper unary_choice iterate_statement_extra

# condition_choice ->
#         condition_notter

#added this to remove ambiguity
# condition_notter_choice ->
#        %access %open_bracket struct_size %close_bracket
#     |  first_compute_choice #added this for computes with id at the start
#     |   first_condition_choice
#     |   null

# condition_extra ->
#         condition_choice
#     |   %open_paren condition_choice %close_paren

# condition -> 
#         condition_extra oper_choice condition recur_condition
#     |   notter %open_paren condition_extra additional_condition %close_paren recur_condition
#     |   condition_extra

# recur_condition ->
#         additional_condition
#     |   null

# additional_condition ->
#         oper_choice condition_choice recur_condition
#     |   extra_condition
    
# extra_condition ->
#         oper_choice condition

#removed bc unused
# condition_notter_choice ->
#         struct_new #iterate_choice
#     |   function_call_statement_choice #iterate_choice
#     #|   iterate_choice #(di ka na kailangan)
#     |   first_compute_choice #added this for computes with id at the start
#     |   null

#added condition_notter_choice
condition_notter ->
        negation %id digit_another_choice_iterate #changed condition_notter_choice to digit_another_choice_iterate#condition_notter_choice #may problem pa to kasi pwedeng i-negate yung string access
    #|   literal
    |   %str_literal string_choice #changed string_access to string_choice
    |   %bool_literal
    |   int_literal oper_compute
    |   %dec_literal oper_compute
    #|   iterate_statement_condition
    |   %unary_oper %id digit_another_choice #changed condition_notter_choice to digit_another_choice
    #|   %unary_oper unary_choice iterate_statement_extra
    #|   compute_choice_less #changed compute_choice to compute_choice_less

condition -> #moved conditional, and notter %open_paren... to conditional_choice
        notter conditional_choice
       
conditional_choice -> #added this to remove ambiguity with notter
        conditional 
    |   %open_paren combined %close_paren oper_condition

conditional -> #changed condition_choice to condition_notter
        condition_notter oper_condition

oper_condition ->
        oper_choice condition
    |   null

first_condition_choice ->
    oper_choice condition #variable_next_choice

# condition_choice_less -> #removed notter
#         condition_notter_less

# choice_choice ->
#     compute_choice_less_less
#     | null

#listed all literals to remove ambiguity of their next 
condition_notter_less ->
     #   literal
        %str_literal string_choice #changed string_access to string_choice
    |   %bool_literal
    |   int_literal oper_compute
    |   %dec_literal oper_compute
    #|   iterate_statement_condition
    |   %unary_oper unary_choice 
    #iterate_statement_extra #ambiguity on iterate_statement_extra (dugtong to sa taas pero baka di na)
    #|   compute_choice_less_less

string_append_choice ->
        %str_literal
    |   %id in_choice_choice

string_choice ->
        string_access
    |   %append string_append_choice append_again #changed %str_literal to string_append_choice

append_again ->
        %append string_append_choice append_again #changed %str_literal to string_append_choice
    |   null

# condition_extra_less ->
#         condition_choice_less
#     |   %open_paren condition_choice %close_paren

# condition_less_choice ->
#         oper_choice condition recur_condition
#     |   null

#not used so removed
#changed oper_choice condition recur_condition to condition_less_choice
# condition_less -> #moved condition_choice.... and %open_paren... to condition_less_choice_choice
#         notter condition_less_choice_choice

#not used so removed   
# condition_less_choice_choice -> #added this to remove ambiguity with notter
#         condition_notter_less oper_condition
#     |   notter %open_paren condition %close_paren oper_condition
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
    |   notter iterate_statement

#removed bc unused
#changed for_notter_choice (deleted) to digit_another_choice
# for_notter -> 
#         #literal
#        #negation %id digit_another_choice string_access
#        iterate_statement

for_initial ->
        for_int %id %equal for_choice for_initial_extra
    |   null
    
for_initial_extra ->
        %comma for_initial
    |   null

iterate_statement_extra ->
        %comma iterate_statement
    |   null

#deleted for now, this is a duplicate
#changed iterate_choice_choice (deleted) to digit_another_choice
# iterate_choice ->
#         int_literal
#     |   %dec_literal
#     |   %id digit_another_choice 

unary_choice -> #changed struct_statement_choice to struct_choice
        %id iterate_id #changed struct_choice to iterate_id
    #|   struct_statement_choice

iterate_statement ->
        unary_choice iterate_unary
    |   %unary_oper unary_choice iterate_statement_extra
    |   null

iterate_unary_null -> #changed iterate_choice to iterate_intdec
        %unary_oper iterate_statement_extra
    |   %assign_oper iterate_intdec iterate_statement_extra
    |   null

#changed unary to %unary_oper
iterate_unary -> #changed iterate_choice to iterate_intdec
        %unary_oper iterate_statement_extra
    |   %assign_oper iterate_intdec iterate_statement_extra

#not used so removed
# recur_for_condition ->
#         %logical_oper for_condition
#     |   null

for_condition_extra ->
        %comma for_condition
    |   null

#not used so removed
# for_choice_extra ->
#         for_choice
#     |   %open_paren for_choice %close_paren

for_condition ->
        variable_choice for_condition_extra #changed condition to variable_choice
    |   null

loop_statement ->
        %loopFor %open_paren for_initial %terminator for_condition %terminator iterate_statement %close_paren statement
    |   %loopWhile %open_paren variable_choice %close_paren statement #changed condition to variable_choice
    |   %loopDo statement %loopWhile %open_paren variable_choice %close_paren %terminator #changed condition to variable_choice

if_statement ->
        %stateIf %open_paren variable_choice %close_paren statement else_choice

else_choice ->
        %stateElse statement
    |   %elf %open_paren variable_choice %close_paren statement else_choice #changed condition to variable_choice
   # |   %singleComment function_else_choice
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
        struct_new iterate_first_choice choice_choice #changed choice_choice_choice to choice_choice
    |   function_call_statement_choice iterate_first_choice choice_choice #changed choice_choice_choice to choice_choice
    |   iterate_choice choice_choice #changed choice_choice_choice to choice_choice
    #     struct_new choice_choice_choice #iterate_choice
    # |   function_call_statement_choice choice_choice_choice #iterate_choice
     #   first_choice iterate_choice choice_choice_choice #(di ka na kailangan)
    |   first_compute_choice oper_condition #added oper_condition #variable_next_choice #added this for computes with id at the start
    |   first_condition_choice oper_compute #added oper_compute #variable_next_choice #added this for conditions with id at the start
    #|   null

return_choice ->
        %id choice #variable_next_choice
  # |   condition_less_choice_choice
    |   condition_notter_less oper_condition #oper_compute
    |   not_many not_choice #repeated !!!
    |   %negative negative_choice 
    |   %open_paren variable_choice_null %close_paren #return_next_choice 
    |   null

variable_choice_null ->
        %id choice #variable_next_choice
  # |   condition_less_choice_choice
    |   condition_notter_less oper_condition
    |   not_many not_choice #repeated !!!
    |   %negative negative_choice 
    |   %open_paren variable_choice_null %close_paren variable_next_null
    |   null

return_statement ->
        %stateReturn return_choice %terminator

# return_first_choice ->
#         variable_choice
#     #|   %open_paren %id %close_paren
#     #|   null

# return_choice -> 
#         variable_choice
#     #|   null

#not used so removed
# recur_declare ->
#         %comma parameter_define

first_struct -> 
        data_type %id parameter_define %terminator recur_struct

recur_struct -> 
        data_type %id parameter_define %terminator recur_struct
    |   null

struct_define ->
        %id parameter_define %terminator

#not used so removed
# assign_struct ->
#         struct_choice element

#not used so removed
# struct_statement ->
#         %id struct_choice element

struct_new ->
        %open_bracket struct_size %close_bracket extra_struct element
    |   %dot %id element_choice

# struct_statement_choice ->
#         struct_choice

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
    #|   recur_define
    |   null

parameter_define ->
        assign_struct_size recur_define
    #|   recur_define
    #|   null

array_parameter ->
        %open_bracket %close_bracket
    |   null

parameter -> 
        data_type %id array_parameter recur_parameter
    |   %id %id array_parameter recur_parameter 
    |   null

recur_parameter ->
        %comma recur_parameter_again
    |   null

recur_parameter_again ->
        data_type %id array_parameter recur_parameter
    |   %id %id array_parameter recur_parameter

#KAILANGAN KA PA BA, OH ID_ARAY
#changed array_size to struct_size
id_array ->
        %open_bracket struct_size %close_bracket id_array_2D
    |   null #(bakit ba pinapatanggal yung null?)

#changed array_size to struct_size
id_array_2D ->
        %open_bracket struct_size %close_bracket id_array_2D
    |   null #(may automatic null na ba to???)

#not used so removed
#added this to remove ambiguity
# function_variables_choice -> #parang may ambiguity to
#         #id_array
#         function_call_statement_choice
#     |   struct_choice #changed struct_statement_choice to struct_choice
#     |   first_compute_choice #added this for computes with id at the start
#     |   first_condition_choice #added this for conditions with id at the start

#not used so removed
#added function_variables_choice
# function_variables ->
#         %id function_variables_choice
#     |   literal
#     |   compute_choice_less #changed compute_choice to compute_choice_less
#     |   condition_less #changed condition to condition_less

#not used so removed
# function_call_statement ->
#         %id %open_paren function_call %close_paren

function_call -> #temporarily changed function_variables to variable_choice
        variable_choice additional_call
    |   null

additional_call -> #temporarily changed function_variables to variable_choice
        %comma variable_choice additional_call
    |   null

#TANGGALIN NAKITA AH
# unary ->
#         %unary_oper

#not used so removed
#changed array_size to struct_size
# oper ->
#         arith_oper struct_size oper #changed %arith_oper to arith_oper
#     |   null

#TANGGALIN NAKITA AH
# comment ->
#         %singleComment

arith_oper ->
        %arith_oper
    |   %append