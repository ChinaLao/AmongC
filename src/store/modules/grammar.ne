@{%
    const moo = require("moo");

    const lexer = moo.compile({
    
        //special characters
        arith_oper: [
            "+"," +","+ "," + ",
            "-"," -","- "," - ",
            "*"," *","* "," * ",
            "/"," /","/ "," / ",
            "%"," %","% "," % ",
            "**"," **","** "," ** ",
            "//"," //","// "," // ",
        ],
        relation_oper: [
            ">"," >","> "," > ",
            "<"," <","< "," < ",
            "=="," ==","== "," == ",
            "!="," !=","!= "," != ",
            ">="," >=",">= "," >= ",
            "<="," <=","<= "," <= ",
        ],
        assign_oper: [
            "="," =","= "," = ",
            "+="," +=","+= "," += ",
            "-="," -=","-= "," -= ",
            "*="," *=","*= "," *= ",
            "/="," /=","/= "," /= ",
            "**="," **=","**= "," **= ",
            "//*"," //*","//* "," //* ",
            "*="," *=","*= "," *= ",
        ], 
        
        not: ["!"],
        equal: ["="," =","= "," = "],
        unary_oper: ["++","++ ","--","-- "],
        open_paran: ["("," (","( "," ( "],
        close_paran: [")"," )",") "," ) "],
        open_bracket: ["["," [","[ "," [ "],
        close_bracket: ["]"," ]","] "," ] "],
        open_brace: ["{"," {","{ "," { "],
        close_brace: ["}", "}","} "," } "],
        terminator: [";"], //end of statement
        comma: [","," ,",", "," , "],
        dot: ["."],
        colon: [":"," :",": "," : "],
        semicolon:[";","; "], //for for loop
        space: [" ", "\t"],
        //  \": /^[\\"]$/,
        
        //unit keywords
        IN: "IN", 
        OUT: "OUT",
        int: "int ",
        dec: "dec ",
        struct: "struct ",
        str: "str ",
        bool: "bool ",
        empty: "empty ",
        shoot: "shoot",
        scan: "scan",
        if: "if",
        else: "else",
        elf: "elf",
        switch: "switch",
        vote: "vote ",
        default: "default",
        for: "for",
        while: "while",
        do: "do",
        kill: "kill",
        continue: "continue",
        bool_literal: "true",
        return: "return",
        vital: "vital ",
        task: "task ",
        clean: "clean",
        logical_oper: ["and","or"],

        //multicharacter construct

        str_literal: [/[\\"].+[\\"]?/],
        comment: [/[#].+/],
        dec_literal: [/[0-9]+[.][0-9]+/],
        int_literal: [/[0-9]+/],
        id: [/[a-z][a-zA-Z0-9]*/], 
    }); 
%}

@lexer lexer

program -> 
        global %space %IN %space main_statement %space %OUT %space function

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

literal -> 
        %int_literal 
    |   %dec_literal 
    |   %str_literal 
    |   %bool_literal

vital_define -> 
        %vital data_type %id %equal literal recur_vital %terminator

recur_vital -> 
        %comma %id %equal literal recur_vital
    |   null

declare_choice -> 
        variable 
    |   array 
    |   struct_define 
    |   null

recur_assign -> 
        %equal %id assign_choice recur_assign 
    |   null

assign_choice -> 
        recur_assign %equal variable_choice 
    |   assign_array recur_assign %equal variable_choice 
    |   assign_struct recur_assign %equal variable_choice

data_declare -> 
        data_type %id declare_choice %terminator

assign_statement ->
        %id assign_choice %terminator

variable_array ->
        assign_array
    |   null

variable_choice ->
        %id variable_array
    |   literal
    |   function_statement
    |   struct_statement
    |   compute_choice
    |   condition

variable ->
        %equal variable_choice recur_variable
    |   recur_variable
    |   null

recur_variable ->
        %comma %id variable
    |   null

array_size ->
        struct_size
    |   struct_statement

struct_size ->
        %id
    |   %int_literal
    |   function_statement
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
         %open_bracket array_size %close_bracket array_define_first

array_define_first ->
        %equal %open_brace literal additional_literal_1D %close_brace
    |   %open_bracket array_size %close_bracket array_define_second
    |   null

array_define_second ->
        %equal %open_brace %open_brace literal %comma additional_literal_1D %close_brace additional_literal_2D
    |   null

additional_literal_1D ->
        %comma literal additional_literal_1D
    |   null

additional_literal_2D ->
        %comma %open_brace literal %comma additional_literal_1D %close_brace additional_literal_2D
    |   null

main_statement ->
        statement_choice main_statement
    |   comment main_statement
    |   null

statement ->
        statement_choice
        %open_brace function_statement %close_brace

function_statement -> 
        statement_choice function_statement
    |   null

statement_choice ->
        data_declare
    |   assign_statement
    |   out_statement
    |   in_statement
    |   loop_statement
    |   if_statement
    |   switch_statement
    |   iterate_statement %terminator
    |   return_statement
    |   function_statement %terminator
    |   control_statement
    |   %clean %open_paran %close_paran %terminator

control_statement ->
        %continue %terminator
    |   %kill %terminator
    |   null

out_statement ->
        %shoot %open_paran output %close_paran %terminator

output -> 
        variable_choice recur_output

recur_output ->
        %comma output
    |   null

in_statement ->
        %scan %open_paran %id recur_id %close_paran %terminator

recur_id ->
        assign_array id_choice
    |   %comma %id recur_id
    |   null

id_choice ->
        %dot %id assign_array
    |   null

digit_choice ->
        %int_literal
    |   %dec_literal

compute_choice -> 
        digit_choice %arith_oper compute_choice recur_compute
    |   %open_paran digit_choice additional_compute %close_paran recur_compute
    |   compute

compute ->
        digit_choice

recur_compute ->
        additional_compute
    |   null

additional_compute ->
        %arith_oper digit_choice recur_compute
    |   extra_compute

extra_compute ->
        %arith_oper compute_choice

condition_choice ->
        %id
    |   literal
    |   compute_choice

oper_choice ->
        %relation_oper
    |   %logical_oper

condition -> 
        condition_choice oper_choice condition recur_condition
    |   %not %open_paran condition_choice additional_condition %close_paran recur_condition
    |   condition_choice

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

for_initial ->
        for_int %id %equal for_initial_extra
    |   null

for_initial_extra ->
        array_size oper

iterate_choice ->
        %int_literal
    |   %dec_literal
    |   %str_literal
    |   function_statement
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
        %for %open_paran for_initial %semicolon for_condition %semicolon iterate_statement %close_paran statement
    |   %while %open_paran condition %close_paran statement
    |   %do statement %while %open_paran condition %close_paran %terminator

if_statement ->
        %if %open_paran condition %close_paran statement else_choice

else_choice ->
        %elf %open_paran condition %close_paran statement else_choice
    |   %else statement
    |   null

switch_statement ->
        %switch %open_paran %id %close_paran %open_brace %vote vote_choice %colon statement %kill %terminator vote %default %colon statement %close_brace

vote_choice ->
        %int_literal
    |   %str_literal

vote ->
        %vote vote_choice %colon statement %kill %terminator vote
    |   null

return_statement ->
        %return return_choice %terminator

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

struct_define ->
        %id %id parameter_define %terminator

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
    |   assign_struct_size
    |   null

function ->
        %task function_data_type %id %open_paran parameter %close_paran %open_brace function_statement %close_brace function
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

function_statement ->
        %id %open_paran function_call %close_paran

function_call ->
        variable_choice
    |   null

unary ->
        %unary_oper

oper ->
        %arith_oper array_size oper
    |   null

comment ->
        %comment
    |   null       