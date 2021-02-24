@{%
    const moo = require("moo");

    const lexer = moo.compile({
        
        //unary: ["++", "--"],
        //appendAssign: "+=", //added for string append
        //assignOper: ["-=", "**=", "*=", "//=", "/=", "%="],
        //comparison: ["==", "!="],
        //relationOper: [">=", "<=", ">", "<"],
        //equal: "=",
        //append: "+",
        //arithOper: [ "-", "**", "*", "//", "/", "%"],

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
        //space: [" ", "\t"],
        //quote: "quote",
       // sharp: "sharp",
        //  \": /^[\\"]$/,
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

        //multicharacter construct

        str_literal: "litStr",
        singleComment: "singleComment",
        int_literal: ["litInt", "negaLitInt"],
        posi_int_literal: "litInt",
        dec_literal: "litDec",
        access: "access",
        
        id: "id", 

        eof: "EOF",
    }); 
%}

@lexer lexer

program -> 
        global %IN main_statement %OUT function %eof

global -> 
        global_choice global
    |   comment global 
    |   null

global_choice -> 
        vital_define 
    |   data_declare
    |   struct_declare

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

literal -> 
        %int_literal 
    |   %dec_literal 
    |   %str_literal string_access
    |   %bool_literal

string_access ->
        %access %open_bracket array_size %close_bracket
    |   null

vital_define -> 
        %vital data_type %id %equal literal recur_vital %terminator

recur_vital -> 
        %comma %id %equal literal recur_vital
    |   null

#removed struct_define
declare_choice -> 
        variable 
    |   array 
    # |   struct_define 
    |   null

recur_assign -> 
        %equal %id recur_assign
    |   assign_choice
    |   null

assign_choice -> 
        recur_assign %equal variable_choice 
    |   assign_array recur_assign %equal variable_choice 
    |   assign_struct recur_assign %equal variable_choice
    # |   %terminator #added terminator for id = id = id;

data_declare -> 
        data_type %id declare_choice %terminator 

#removed %id at the start
assign_statement ->
        assign_choice %terminator 

variable_array ->
        assign_array
    |   null

#temporarily removed id from the start of variable_array
variable_choice ->
        %id string_access variable_array
    |   literal
    |   function_call_statement string_access
    |   struct_statement string_access
    |   compute_choice
    |   condition

variable ->
        %equal variable_choice recur_variable
    |   recur_variable
    |   null

recur_variable ->
        %comma %id declare_choice
    |   null

array_size ->
        struct_size 
    |   struct_statement array_unary
    |   unary struct_statement

array_unary ->
        unary
    |   null

struct_unary ->
        %assign_oper iterate_choice
    |   id_array unary
    
struct_size ->
        %id id_array 
    |   %posi_int_literal
    |   function_call_statement 
    |   compute_choice
    |   unary %id id_array 
    |   %id struct_unary

assign_struct_2D ->
        %open_bracket struct_size %close_bracket
    |   null

assign_struct_size ->
        %open_bracket struct_size %close_bracket assign_struct_2D

assign_array_2D ->
        %open_bracket array_size %close_bracket 
    |   null

assign_array ->
         %open_bracket array_size %close_bracket assign_array_2D

array ->
         %open_bracket array_size %close_bracket array_define_first recur_variable

# array_choice -> BAKA DI KA NA KAILANGAN
#         for_choice
#     |   iterate_statement
#     |   null

#changed array_choice to condition
#added string_access
array_define_first ->
        %equal %open_brace condition additional_literal_1D %close_brace
    |   %open_bracket array_size %close_bracket string_access array_define_second
    |   null

array_define_second ->
        %equal %open_brace %open_brace condition additional_literal_1D %close_brace additional_literal_2D %close_brace
    |   null

additional_literal_1D ->
        %comma condition additional_literal_1D
    |   null

additional_literal_2D ->
        %comma %open_brace condition additional_literal_1D %close_brace additional_literal_2D
    |   null

main_statement ->
        statement_choice main_statement
    |   comment main_statement
    |   null

statement ->
        statement_choice
    |   %open_brace function_statement %close_brace
    # |   null

function_statement -> 
        statement_choice function_statement
    |   null

#added %id id_start_statement; removed three production sets
statement_choice ->
        data_declare
    # |   assign_statement //
    |   out_statement 
    |   in_statement 
    |   loop_statement 
    |   if_statement 
    |   switch_statement 
    |   %id id_start_statement
    |   unary %id %terminator #added terminator
    # |   iterate_statement %terminator //
    |   return_statement
    # |   function_call_statement %terminator
    |   control_statement 
    |   %clean %open_paren %close_paren %terminator
    |   comment

#this is new
id_start_statement ->
        %id struct_define_choice
    |   assign_statement
    |   iterate_statement_choice %terminator
    |   function_call_statement_choice %terminator
    

# %id parameter_define %terminator

#this is new
struct_define_choice ->
        parameter_define %terminator

#this is new
function_call_statement_choice ->
        %open_paren function_call %close_paren

#this is new
iterate_statement_choice ->
        unary 
    |   %assign_oper iterate_choice
    |   null

control_statement ->
        %control %terminator
    |   %kill %terminator
    # |   null

out_statement ->
        %shoot %open_paren output %close_paren %terminator

output -> 
        variable_choice recur_output

recur_output ->
        %comma output
    |   null

in_statement -> #id, array element, structure
        %scan %open_paren in_choice %close_paren %terminator

#this is new
in_choice ->
        %id id_array recur_id 
    |   struct_statement recur_id 

#updated based on in_choice
recur_id ->
        %comma in_choice
    |   null

id_choice ->
        %dot %id assign_array
    |   null

#added id production set 
digit_choice ->
        notter digit_notter

#added string_access #removed it na why kasi meron
digit_notter ->
        %int_literal
    |   %dec_literal
    |   negation %id id_array 
    |   function_call_statement 
    |   struct_statement 

compute_choice -> 
        digit_choice %arith_oper compute_choice recur_compute
    |   %open_paren digit_choice additional_compute %close_paren recur_compute
    |   compute

compute ->
        digit_choice
    |   %open_paren digit_choice %close_paren

recur_compute ->
        additional_compute
    |   null

additional_compute ->
        %arith_oper digit_choice recur_compute
    |   extra_compute

extra_compute ->
        %arith_oper compute_choice

#this is new
iterate_statement_condition ->
        unary_choice iterate_unary
    |   unary unary_choice iterate_statement_extra

condition_choice ->
        notter condition_notter
    
condition_notter ->
        negation %id 
    |   literal
    |   compute_choice
    |   iterate_statement_condition

oper_choice ->
        %relation_oper
    |   %logical_oper

#this is new
notter ->
        %not
    |   null

#changed condtion_choice to condition_extra to add parenthesis
condition_extra ->
        condition_choice
    |   %open_paren condition_choice %close_paren

condition -> 
        condition_extra oper_choice condition recur_condition
    |   notter %open_paren condition_extra additional_condition %close_paren recur_condition
    |   condition_extra

recur_condition ->
        additional_condition
    |   null

additional_condition ->
        oper_choice condition_choice recur_condition
    |   extra_condition
    
extra_condition ->
        oper_choice condition

for_int ->
        %int
    |   null

for_choice -> 
        compute_choice
    |   notter for_notter 
    
#added string_access
for_notter -> #this is new
        literal
    |   negation %id %id_array string_access
    |   function_call_statement string_access
    |   struct_statement string_access
    |   iterate_statement

for_initial ->
        for_int %id %equal for_choice for_initial_extra
    |   null
    
for_initial_extra ->
        %comma for_initial
    |   null

#this is new
iterate_statement_extra ->
        %comma iterate_statement
    |   null

#removed str_literal; added id_array
iterate_choice ->
        %int_literal
    |   %dec_literal
    |   function_call_statement 
    |   struct_statement 
    |   %id id_array 

#this is new
unary_choice ->
        %id id_array
    |   struct_statement

iterate_statement ->
        unary_choice iterate_unary
    |   unary unary_choice iterate_statement_extra
    |   null

#this is new
iterate_unary ->
        unary iterate_statement_extra
    |   %assign_oper iterate_choice iterate_statement_extra

recur_for_condition ->
        %logical_oper for_condition
    |   null

for_condition_extra ->
        %comma for_condition
    |   null

#changed for_choice to for_choice extra to add parenthesis
for_choice_extra ->
        for_choice
    |   %open_paren for_choice %close_paren

# for_condition -> 
#         for_choice_extra oper_choice for_choice_extra recur_for_condition for_condition_extra
#     |   null

for_condition ->
        condition for_condition_extra
    |   null

loop_statement ->
        %loopFor %open_paren for_initial %terminator for_condition %terminator iterate_statement %close_paren statement
    |   %loopWhile %open_paren condition %close_paren statement
    |   %loopDo statement %loopWhile %open_paren condition %close_paren %terminator

if_statement ->
        %stateIf %open_paren condition %close_paren statement else_choice

else_choice ->
        %stateElse statement
    |   %elf %open_paren condition %close_paren statement else_choice
    |   null

#added literal string access
switch_choice -> #this is new
        notter switch_notter
    |   %str_literal %access %open_bracket array_size %close_bracket

#added string_access
switch_notter -> #this is new
        %id id_array string_access
    |   function_call_statement string_access
    |   struct_statement string_access

switch_statement ->
        %stateSwitch %open_paren switch_choice %close_paren %open_brace %vote vote_choice %colon function_statement %kill %terminator vote %stateDefault %colon function_statement %close_brace

vote_choice ->
        %int_literal
    |   %str_literal string_access

vote ->
        %vote vote_choice %colon function_statement %kill %terminator vote
    |   null

return_statement ->
        %stateReturn return_first_choice %terminator

#this is new
return_first_choice ->
        return_choice
    |   %open_paren return_choice %close_paren

return_choice -> 
        variable_choice
    |   %id
    |   null

struct_declare ->
        %struct %id %open_brace first_struct %close_brace

recur_declare ->
        %comma parameter_define

first_struct -> #this is new
        data_type %id parameter_define %terminator recur_struct

recur_struct -> 
        data_type %id parameter_define %terminator recur_struct
    |   null

#removed id
struct_define ->
        %id parameter_define %terminator

assign_struct ->
        struct_choice element
    
struct_statement ->
        %id struct_choice element

#added string_access #DOUBLE CHECK MO TONG CFG MO, BUTI NA LANG LEX ERROR HAY NAKO KA 
struct_choice ->
        %open_bracket array_size %close_bracket string_access extra_struct
    |   null

#added string_access #DOUBLE CHECK MO TONG CFG MO, BUTI NA LANG LEX ERROR HAY NAKO KA 
extra_struct ->
        %open_bracket array_size %close_bracket string_access
    |   null

#added string_access #DOUBLE CHECK MO TONG CFG MO, BUTI NA LANG LEX ERROR HAY NAKO KA
element_choice ->
        %open_bracket array_size %close_bracket string_access element_option
    |   null

#added string_access #DOUBLE CHECK MO TONG CFG MO, BUTI NA LANG LEX ERROR HAY NAKO KA
element_option ->
        %open_bracket array_size %close_bracket string_access
    |   null

element ->
        %dot %id element_choice
    |   null

recur_define ->
        %comma %id parameter_define
    |   null

parameter_define ->
        recur_define
    |   assign_struct_size recur_define
    |   null

function ->
        %task function_data_type %id %open_paren parameter %close_paren %open_brace function_statement %close_brace function
    |   comment function
    |   null

array_parameter ->
        %open_bracket %close_bracket
    |   null

parameter -> 
        data_type %id array_parameter recur_parameter
    |   %id %id array_parameter recur_parameter #this is new
    |   null

recur_parameter ->
        %comma recur_parameter_again
    |   null

#this is new
recur_parameter_again ->
        data_type %id array_parameter recur_parameter
    |   %id %id array_parameter recur_parameter
    

#this is new
id_array ->
        %open_bracket array_size %close_bracket id_array_2D
    |   null

#this is new
id_array_2D ->
        %open_bracket array_size %close_bracket id_array_2D
    |   null

function_variables ->
        %id id_array
    |   literal
    |   function_call_statement
    |   struct_statement
    |   compute_choice
    |   condition

function_call_statement ->
        %id %open_paren function_call %close_paren

function_call ->
        function_variables additional_call
    |   null

additional_call ->
        %comma function_variables additional_call
    |   null

unary ->
        %unary_oper

oper ->
        %arith_oper array_size oper
    |   null

comment ->
        %singleComment
    # |   null       