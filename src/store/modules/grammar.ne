@{%
    const moo = require("moo");

    const lexer = moo.compile({
        
        //special characters
        arith_oper: "arithOper",
        relation_oper: "relationOper",
        assign_oper: "assignOper", 
        
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
        quote: "quote",
        sharp: "sharp",
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
        dec_literal: "litDec",
        int_literal: "litInt",
        id: "id", 
    }); 
%}

@lexer lexer

program -> 
        global %IN main_statement %OUT function

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
        negation %int_literal 
    |   negation %dec_literal 
    |   %quote %str_literal %quote
    |   %bool_literal


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
        %id variable_array
    |   literal
    |   function_call_statement
    |   struct_statement
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
    |   struct_statement

struct_size ->
        %id
    |   %int_literal
    |   function_call_statement
    |   compute_choice

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

array_define_first ->
        %equal %open_brace literal additional_literal_1D %close_brace
    |   %open_bracket array_size %close_bracket array_define_second
    |   null

array_define_second ->
        %equal %open_brace %open_brace literal additional_literal_1D %close_brace additional_literal_2D %close_brace
    |   null

additional_literal_1D ->
        %comma literal additional_literal_1D
    |   null

additional_literal_2D ->
        %comma %open_brace literal additional_literal_1D %close_brace additional_literal_2D
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
        %scan %open_paren %id recur_id %close_paren %terminator

#added %dot %id recur_id; added recur_id to ending of productions
recur_id ->
        assign_array id_choice recur_id
    |   %comma %id recur_id
    |   %dot %id recur_id
    |   null

id_choice ->
        %dot %id assign_array
    |   null

#added id production set 
digit_choice ->
        negation %int_literal
    |   negation %dec_literal
    |   negation %id

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

condition_choice ->
        notter %id
    # |   literal removed literal
    |   notter compute_choice

oper_choice ->
        %relation_oper
    |   %logical_oper

#this is new
notter ->
        %not
    |   null

#this is new
enclosed_condition ->
        %open_paren condition_choice additional_condition %close_paren
    |   condition_choice additional_condition

#NEW
next_condition ->
        oper_choice condition recur_condition
    |   null

#removed a production set; updated the others
condition -> 
        condition_choice next_condition
    |   notter enclosed_condition recur_condition

recur_condition ->
        additional_condition
    |   null

additional_condition ->
        oper_choice condition_choice recur_condition
    |   extra_condition
    |   null

extra_condition -> 
        oper_choice condition

for_int ->
        %int
    |   null

for_initial ->
        for_int %id %equal for_initial_extra
    |   null

for_initial_extra ->
        array_size oper

iterate_choice ->
        iterate_choice %int_literal
    |   iterate_choice %dec_literal
    |   %quote %str_literal %quote
    |   function_call_statement
    |   struct_statement

iterate_statement ->
        %id unary
    |   unary %id
    |   %id %assign_oper iterate_choice
    |   null

recur_for_condition ->
        %logical_oper for_condition
    |   null

for_condition ->
        %id oper_choice array_size recur_for_condition
    |   null

loop_statement ->
        %loopFor %open_paren for_initial %terminator for_condition %terminator iterate_statement %close_paren statement
    |   %loopWhile %open_paren condition %close_paren statement
    |   %loopDo statement %loopWhile %open_paren condition %close_paren %terminator

if_statement ->
        %stateIf %open_paren condition %close_paren statement else_choice

else_choice ->
        %elf %open_paren condition %close_paren statement else_choice
    |   %stateElse statement
    |   null

switch_statement ->
        %stateSwitch %open_paren %id %close_paren %open_brace %vote vote_choice %colon function_statement %kill %terminator vote %stateDefault %colon function_statement %close_brace

vote_choice ->
        negation %int_literal
    |   %quote %str_literal %quote

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
    |   %id
    |   null

struct_declare ->
        %struct %id %open_brace recur_struct %close_brace

recur_declare ->
        %comma parameter_define

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

struct_choice ->
        %open_bracket array_size %close_bracket extra_struct
    |   null

extra_struct ->
        %open_bracket array_size %close_bracket
    |   null

element_choice ->
        %open_bracket array_size %close_bracket element_option
    |   null

element_option ->
        %open_bracket array_size %close_bracket
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
    |   null

recur_parameter ->
        %comma data_type %id array_parameter recur_parameter
    |   null

id_array ->
        %open_bracket array_size %close_bracket id_array_2D
    |   null

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
        %sharp %singleComment
    # |   null       