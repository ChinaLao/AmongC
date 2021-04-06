@{%
    const moo = require("moo");
    //const IndentationLexer = require("moo-indentation-lexer")

    const lexer = moo.compile({

        //special characters
        assign_oper: ["appendAssign", "assignOper"], 
        arith_oper: ["arithOper", "append"],
        relation_oper: ["relationOper", "comparison"],
        
        equal: "equal",
        not: "not",
        unary_oper: "unary",
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
    |   %singleComment

vital_define -> 
        %vital data_type %id %equal literal recur_vital %terminator

#temporarily moved %id to declare_choice
data_declare -> 
        data_type %id declare_choice %terminator 

struct_declare ->
        %struct %id %open_brace first_struct %close_brace

#changed comment to %singleComment; it's on statement_choice
main_statement ->
        statement_choice main_statement
    #|   %singleComment main_statement
    |   null

#changed comment to %singleComment
function ->
        %task function_data_type %id %open_paren parameter %close_paren %open_brace function_statement %close_brace function
    |   %singleComment function
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

literal -> 
        int_literal 
    |   %dec_literal 
    |   %str_literal string_access
    |   %bool_literal

#changed array_size to struct_size
string_access ->
        %access %open_bracket struct_size %close_bracket
    |   null

recur_vital -> 
        %comma %id %equal literal recur_vital
    |   null

# declare_choice_choice ->
#         variable 
#     |   array 

declare_choice -> 
        # %id declare_choice_choice
        variable 
    |   array 
    |   null

#recur_assign -> 
  #      %equal %id recur_assign
  #  |   assign_choice
  #  |   null

#assign_choice -> 
  #      recur_assign %equal variable_choice 
  #  |   assign_array recur_assign %equal variable_choice 
  #  |   assign_struct recur_assign %equal variable_choice

#created new recur_assign, assign_choice
recur_assign -> 
        %equal %id assign_struct recur_assign
    |   null

#added string_access
assign_choice -> 
        assign_struct recur_assign string_access %equal variable_choice
       
assign_statement ->
        assign_choice %terminator 

#BAKA DI NA TO KAILANGAN
# variable_array ->
#         assign_array
#     |   null

iterate_choice ->
        %unary_oper
    |   %assign_oper iterate_choice
    |   %access %open_bracket struct_size %close_bracket
   # |   null

choice_choice_choice ->
        first_compute_choice
    |   first_condition_choice
    |   iterate_choice
    |   null

choice ->
        struct_new choice_choice_choice #iterate_choice
    |   function_call_statement_choice choice_choice_choice #iterate_choice
    |   iterate_choice #(di ka na kailangan)
    |   first_compute_choice #added this for computes with id at the start
    |   first_condition_choice #added this for conditions with id at the start
    |   null

#ambiguity (wala na ata)
variable_choice ->
       # compute_choice
        #%id variable_array string_access
       # literal
    # |   %str_literal access
    # |   %bool_literal
        %id choice
    #|  compute_choice_less #changed compute_choice to compute_choice_less
    |  condition_less #changed condition to condition_less
    |  notter negation %open_paren variable_choice_choice

variable_choice_choice ->
        condition %close_paren oper_condition
    |   compute_choice %close_paren oper_compute

variable -> 
        %equal variable_choice recur_variable
    |   %comma %id recur_variable
    #|   recur_variable
    #|   null

recur_variable ->
        array
     |  %equal variable_choice recur_variable
    |   %comma %id recur_variable
    |   null

#DI KA NA ATA KAILAGAN HOHO
# array_size ->
#         struct_size 
#     #|   struct_statement array_unary
#     #|   unary struct_statement

# array_unary ->
#         unary
#     |   null

#changed unary to %unary_oper
struct_unary ->
        %assign_oper iterate_choice
    |   id_array %unary_oper

#added this to remove ambiguity with id
struct_size_choice ->
        id_array
    |   function_call_statement_choice
    |   first_compute_choice #added this for computes with id at the start
    |   struct_unary

#added struct_size_choice
#changed unary to %unary_oper
struct_size ->
        %id struct_size_choice
    #|   %posi_int_literal (removed bc of ambiguity)
    |   compute_choice_less #changed compute_choice to compute_choice_less
    |   %unary_oper %id struct_statement_choice #changed id_array to struct_statement_choice

assign_struct_2D ->
        %open_bracket struct_size %close_bracket
    |   null

assign_struct_size ->
        %open_bracket struct_size %close_bracket assign_struct_2D

#changed array_size to struct_size
assign_array_2D ->
        %open_bracket struct_size %close_bracket 
    |   null

#changed array_size to struct_size
assign_array ->
         %open_bracket struct_size %close_bracket assign_array_2D

array_recur_choice ->
        %comma declare_choice
    |   null

#changed array_size to struct_size
array ->
        %open_bracket struct_size %close_bracket array_define_first recur_variable

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
    |   out_statement 
    |   in_statement 
    |   loop_statement 
    |   if_statement 
    |   switch_statement 
    |   %id id_start_statement
    |   %unary_oper %id %terminator #kulang to
    |   return_statement
    |   control_statement 
    |   %clean %open_paren %close_paren %terminator
    |   %singleComment

id_start_statement ->
        %id struct_define_choice
    |   assign_statement
    |   iterate_statement_choice %terminator
    |   function_call_statement_choice %terminator
    
struct_define_choice ->
        parameter_define %terminator

function_call_statement_choice ->
        %open_paren function_call %close_paren

#changed unary to %unary_oper
iterate_statement_choice ->
        %unary_oper
    |   %assign_oper iterate_choice
    |   null

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
       struct_new
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
        %arith_oper compute_choice

digit_choice_less ->
        notter digit_notter_less

digit_notter_less ->
        int_literal
    |   %dec_literal

compute_choice_less_less -> 
        oper_compute
    |   negation %open_paren compute_choice %close_paren oper_compute

compute_choice_less -> 
        digit_choice_less oper_compute
    |   negation %open_paren compute_choice %close_paren oper_compute

# compute_less ->
#         digit_choice_less
#     |   %open_paren digit_choice %close_paren

#changed unary to %unary_oper
iterate_statement_condition ->
        unary_choice iterate_unary
    |   %unary_oper unary_choice iterate_statement_extra

#changed unary to %unary_oper
iterate_statement_condition_less ->
        struct_statement_choice iterate_unary
    |   %unary_oper unary_choice iterate_statement_extra

condition_choice ->
        notter condition_notter

#added this to remove ambiguity
# condition_notter_choice ->
#        %access %open_bracket struct_size %close_bracket
#     |  first_compute_choice #added this for computes with id at the start
#     |   first_condition_choice
#     |   null

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

condition ->
        conditional 
    |   notter %open_paren condition %close_paren oper_condition

conditional ->
        condition_choice oper_condition

oper_condition ->
        oper_choice condition
    |   null

first_condition_choice ->
    oper_choice condition

condition_choice_less ->
        notter condition_notter_less

choice_choice ->
    compute_choice_less_less
    | null

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

# condition_extra_less ->
#         condition_choice_less
#     |   %open_paren condition_choice %close_paren

# condition_less_choice ->
#         oper_choice condition recur_condition
#     |   null

#changed oper_choice condition recur_condition to condition_less_choice
condition_less -> 
        condition_choice_less oper_condition
    |   notter %open_paren condition %close_paren oper_condition

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

unary_choice ->
        %id struct_statement_choice
    #|   struct_statement_choice

iterate_statement ->
        unary_choice iterate_unary
    |   %unary_oper unary_choice iterate_statement_extra
    |   null

#changed unary to %unary_oper
iterate_unary ->
        %unary_oper iterate_statement_extra
    |   %assign_oper iterate_choice iterate_statement_extra

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
        condition for_condition_extra
    |   null

loop_statement ->
        %loopFor %open_paren for_initial %terminator for_condition %terminator iterate_statement %close_paren statement
    |   %loopWhile %open_paren condition %close_paren statement
    |   %loopDo statement %loopWhile %open_paren condition %close_paren %terminator

if_statement ->
        %stateIf %open_paren variable_choice %close_paren statement else_choice

else_choice ->
        %stateElse statement
    |   %elf %open_paren condition %close_paren statement else_choice
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

return_statement ->
        %stateReturn return_first_choice %terminator

return_first_choice ->
        return_choice
    |   %open_paren return_choice %close_paren

return_choice -> 
        variable_choice
    |   null

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

struct_statement_choice ->
        struct_choice

#temporarily removed string_access from struct_choice, extra_struct, element_choice, element_option (think about this)
#changed array_size to struct_size
struct_choice ->
        %open_bracket struct_size %close_bracket extra_struct element
    |   null

#changed array_size to struct_size
extra_struct ->
        %open_bracket struct_size %close_bracket
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
    |   null

parameter_define ->
        assign_struct_size recur_define
    |   null

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

#added this to remove ambiguity
function_variables_choice ->
        #id_array
        function_call_statement_choice
    |   struct_statement_choice
    |   first_compute_choice #added this for computes with id at the start
    |   first_condition_choice #added this for conditions with id at the start

#added function_variables_choice
function_variables ->
        %id function_variables_choice
    |   literal
    |   compute_choice_less #changed compute_choice to compute_choice_less
    |   condition_less #changed condition to condition_less

function_call_statement ->
        %id %open_paren function_call %close_paren

function_call ->
        function_variables additional_call
    |   null

additional_call ->
        %comma function_variables additional_call
    |   null

#TANGGALIN NAKITA AH
# unary ->
#         %unary_oper

#changed array_size to struct_size
oper ->
        %arith_oper struct_size oper
    |   null

#TANGGALIN NAKITA AH
# comment ->
#         %singleComment