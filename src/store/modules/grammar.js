// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["global", (lexer.has("IN") ? {type: "IN"} : IN), "main_statement", (lexer.has("OUT") ? {type: "OUT"} : OUT), "function", (lexer.has("eof") ? {type: "eof"} : eof)]},
    {"name": "global", "symbols": ["global_choice", "global"]},
    {"name": "global", "symbols": []},
    {"name": "global_choice", "symbols": ["vital_define"]},
    {"name": "global_choice", "symbols": ["data_declare"]},
    {"name": "global_choice", "symbols": ["struct_declare"]},
    {"name": "global_choice", "symbols": [(lexer.has("singleComment") ? {type: "singleComment"} : singleComment)]},
    {"name": "vital_define", "symbols": [(lexer.has("vital") ? {type: "vital"} : vital), "data_type", (lexer.has("id") ? {type: "id"} : id), (lexer.has("equal") ? {type: "equal"} : equal), "literal", "recur_vital", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "data_declare", "symbols": ["data_type", (lexer.has("id") ? {type: "id"} : id), "declare_choice", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "struct_declare", "symbols": [(lexer.has("struct") ? {type: "struct"} : struct), (lexer.has("id") ? {type: "id"} : id), (lexer.has("open_brace") ? {type: "open_brace"} : open_brace), "first_struct", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace)]},
    {"name": "main_statement", "symbols": ["statement_choice", "main_statement"]},
    {"name": "main_statement", "symbols": []},
    {"name": "function", "symbols": [(lexer.has("task") ? {type: "task"} : task), "function_data_type", (lexer.has("id") ? {type: "id"} : id), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "parameter", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), (lexer.has("open_brace") ? {type: "open_brace"} : open_brace), "function_statement", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace), "function"]},
    {"name": "function", "symbols": [(lexer.has("singleComment") ? {type: "singleComment"} : singleComment), "function"]},
    {"name": "function", "symbols": []},
    {"name": "data_type", "symbols": [(lexer.has("int") ? {type: "int"} : int)]},
    {"name": "data_type", "symbols": [(lexer.has("dec") ? {type: "dec"} : dec)]},
    {"name": "data_type", "symbols": [(lexer.has("str") ? {type: "str"} : str)]},
    {"name": "data_type", "symbols": [(lexer.has("bool") ? {type: "bool"} : bool)]},
    {"name": "function_data_type", "symbols": ["data_type"]},
    {"name": "function_data_type", "symbols": [(lexer.has("empty") ? {type: "empty"} : empty)]},
    {"name": "negation", "symbols": [(lexer.has("negative") ? {type: "negative"} : negative)]},
    {"name": "negation", "symbols": []},
    {"name": "int_literal", "symbols": [(lexer.has("posi_int_literal") ? {type: "posi_int_literal"} : posi_int_literal)]},
    {"name": "int_literal", "symbols": [(lexer.has("nega_int_literal") ? {type: "nega_int_literal"} : nega_int_literal)]},
    {"name": "literal", "symbols": ["int_literal"]},
    {"name": "literal", "symbols": [(lexer.has("dec_literal") ? {type: "dec_literal"} : dec_literal)]},
    {"name": "literal", "symbols": [(lexer.has("str_literal") ? {type: "str_literal"} : str_literal), "string_access"]},
    {"name": "literal", "symbols": [(lexer.has("bool_literal") ? {type: "bool_literal"} : bool_literal)]},
    {"name": "string_access", "symbols": [(lexer.has("access") ? {type: "access"} : access), (lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)]},
    {"name": "string_access", "symbols": []},
    {"name": "recur_vital", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("id") ? {type: "id"} : id), (lexer.has("equal") ? {type: "equal"} : equal), "literal", "recur_vital"]},
    {"name": "recur_vital", "symbols": []},
    {"name": "declare_choice", "symbols": ["variable"]},
    {"name": "declare_choice", "symbols": ["array"]},
    {"name": "declare_choice", "symbols": []},
    {"name": "recur_assign", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal), (lexer.has("id") ? {type: "id"} : id), "assign_struct", "recur_assign"]},
    {"name": "recur_assign", "symbols": []},
    {"name": "assign_choice", "symbols": ["assign_struct", "recur_assign", "string_access", (lexer.has("equal") ? {type: "equal"} : equal), "variable_choice"]},
    {"name": "assign_statement", "symbols": ["assign_choice", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "iterate_choice", "symbols": ["iterate_unary"]},
    {"name": "iterate_choice", "symbols": ["string_access"]},
    {"name": "choice", "symbols": ["struct_statement_choice", "iterate_choice"]},
    {"name": "choice", "symbols": ["function_call_statement_choice", "iterate_choice"]},
    {"name": "choice", "symbols": ["first_compute_choice"]},
    {"name": "choice", "symbols": ["first_condition_choice"]},
    {"name": "variable_choice", "symbols": [(lexer.has("id") ? {type: "id"} : id), "choice"]},
    {"name": "variable_choice", "symbols": ["condition_less"]},
    {"name": "variable", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal), "variable_choice", "recur_variable"]},
    {"name": "variable", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("id") ? {type: "id"} : id), "recur_variable"]},
    {"name": "recur_variable", "symbols": ["array"]},
    {"name": "recur_variable", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal), "variable_choice", "recur_variable"]},
    {"name": "recur_variable", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("id") ? {type: "id"} : id), "recur_variable"]},
    {"name": "recur_variable", "symbols": []},
    {"name": "struct_unary", "symbols": [(lexer.has("assign_oper") ? {type: "assign_oper"} : assign_oper), "iterate_choice"]},
    {"name": "struct_unary", "symbols": ["id_array", (lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper)]},
    {"name": "struct_size_choice", "symbols": ["id_array"]},
    {"name": "struct_size_choice", "symbols": ["function_call_statement_choice"]},
    {"name": "struct_size_choice", "symbols": ["first_compute_choice"]},
    {"name": "struct_size_choice", "symbols": ["struct_unary"]},
    {"name": "struct_size", "symbols": [(lexer.has("id") ? {type: "id"} : id), "struct_size_choice"]},
    {"name": "struct_size", "symbols": [(lexer.has("posi_int_literal") ? {type: "posi_int_literal"} : posi_int_literal)]},
    {"name": "struct_size", "symbols": ["compute_choice_less"]},
    {"name": "struct_size", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper), (lexer.has("id") ? {type: "id"} : id), "id_array"]},
    {"name": "assign_struct_2D", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)]},
    {"name": "assign_struct_2D", "symbols": []},
    {"name": "assign_struct_size", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "assign_struct_2D"]},
    {"name": "assign_array_2D", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)]},
    {"name": "assign_array_2D", "symbols": []},
    {"name": "assign_array", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "assign_array_2D"]},
    {"name": "array_recur_choice", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "declare_choice"]},
    {"name": "array_recur_choice", "symbols": []},
    {"name": "array", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "array_define_first", "recur_variable"]},
    {"name": "array_define_first", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal), (lexer.has("open_brace") ? {type: "open_brace"} : open_brace), "condition", "additional_literal_1D", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace)]},
    {"name": "array_define_first", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "array_define_second"]},
    {"name": "array_define_first", "symbols": []},
    {"name": "array_define_second", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal), (lexer.has("open_brace") ? {type: "open_brace"} : open_brace), (lexer.has("open_brace") ? {type: "open_brace"} : open_brace), "condition", "additional_literal_1D", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace), "additional_literal_2D", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace)]},
    {"name": "additional_literal_1D", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "condition", "additional_literal_1D"]},
    {"name": "additional_literal_1D", "symbols": []},
    {"name": "additional_literal_2D", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("open_brace") ? {type: "open_brace"} : open_brace), "condition", "additional_literal_1D", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace), "additional_literal_2D"]},
    {"name": "additional_literal_2D", "symbols": []},
    {"name": "statement", "symbols": ["statement_choice"]},
    {"name": "statement", "symbols": [(lexer.has("open_brace") ? {type: "open_brace"} : open_brace), "function_statement", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace)]},
    {"name": "function_statement", "symbols": ["statement_choice", "function_statement"]},
    {"name": "function_statement", "symbols": []},
    {"name": "statement_choice", "symbols": ["data_declare"]},
    {"name": "statement_choice", "symbols": ["out_statement"]},
    {"name": "statement_choice", "symbols": ["in_statement"]},
    {"name": "statement_choice", "symbols": ["loop_statement"]},
    {"name": "statement_choice", "symbols": ["if_statement"]},
    {"name": "statement_choice", "symbols": ["switch_statement"]},
    {"name": "statement_choice", "symbols": [(lexer.has("id") ? {type: "id"} : id), "id_start_statement"]},
    {"name": "statement_choice", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper), (lexer.has("id") ? {type: "id"} : id), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "statement_choice", "symbols": ["return_statement"]},
    {"name": "statement_choice", "symbols": ["control_statement"]},
    {"name": "statement_choice", "symbols": [(lexer.has("clean") ? {type: "clean"} : clean), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "statement_choice", "symbols": [(lexer.has("singleComment") ? {type: "singleComment"} : singleComment)]},
    {"name": "id_start_statement", "symbols": [(lexer.has("id") ? {type: "id"} : id), "struct_define_choice"]},
    {"name": "id_start_statement", "symbols": ["assign_statement"]},
    {"name": "id_start_statement", "symbols": ["iterate_statement_choice", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "id_start_statement", "symbols": ["function_call_statement_choice", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "struct_define_choice", "symbols": ["parameter_define", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "function_call_statement_choice", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "function_call", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "iterate_statement_choice", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper)]},
    {"name": "iterate_statement_choice", "symbols": [(lexer.has("assign_oper") ? {type: "assign_oper"} : assign_oper), "iterate_choice"]},
    {"name": "iterate_statement_choice", "symbols": []},
    {"name": "control_statement", "symbols": [(lexer.has("control") ? {type: "control"} : control), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "control_statement", "symbols": [(lexer.has("kill") ? {type: "kill"} : kill), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "out_statement", "symbols": [(lexer.has("shoot") ? {type: "shoot"} : shoot), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "output", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "output", "symbols": ["variable_choice", "recur_output"]},
    {"name": "recur_output", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "variable_choice", "recur_output"]},
    {"name": "recur_output", "symbols": []},
    {"name": "in_statement", "symbols": [(lexer.has("scan") ? {type: "scan"} : scan), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "in_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "in_choice_choice", "symbols": ["id_array"]},
    {"name": "in_choice_choice", "symbols": ["struct_statement_choice"]},
    {"name": "in_choice", "symbols": [(lexer.has("id") ? {type: "id"} : id), "in_choice_choice", "recur_id"]},
    {"name": "recur_id", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "in_choice"]},
    {"name": "recur_id", "symbols": []},
    {"name": "id_choice", "symbols": [(lexer.has("dot") ? {type: "dot"} : dot), (lexer.has("id") ? {type: "id"} : id), "assign_array"]},
    {"name": "id_choice", "symbols": []},
    {"name": "digit_choice", "symbols": ["notter", "digit_notter"]},
    {"name": "digit_another_choice", "symbols": ["function_call_statement_choice"]},
    {"name": "digit_another_choice", "symbols": ["struct_statement_choice"]},
    {"name": "digit_notter", "symbols": ["int_literal"]},
    {"name": "digit_notter", "symbols": [(lexer.has("dec_literal") ? {type: "dec_literal"} : dec_literal)]},
    {"name": "digit_notter", "symbols": ["negation", (lexer.has("id") ? {type: "id"} : id), "digit_another_choice"]},
    {"name": "compute_choice", "symbols": ["digit_choice", (lexer.has("arith_oper") ? {type: "arith_oper"} : arith_oper), "compute_choice", "recur_compute"]},
    {"name": "compute_choice", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "digit_choice", "additional_compute", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "recur_compute"]},
    {"name": "compute_choice", "symbols": ["compute"]},
    {"name": "compute", "symbols": ["digit_choice"]},
    {"name": "compute", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "digit_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "recur_compute", "symbols": ["additional_compute"]},
    {"name": "recur_compute", "symbols": []},
    {"name": "additional_compute", "symbols": [(lexer.has("arith_oper") ? {type: "arith_oper"} : arith_oper), "digit_choice", "recur_compute"]},
    {"name": "additional_compute", "symbols": ["extra_compute"]},
    {"name": "extra_compute", "symbols": [(lexer.has("arith_oper") ? {type: "arith_oper"} : arith_oper), "compute_choice"]},
    {"name": "iterate_statement_condition", "symbols": ["unary_choice", "iterate_unary"]},
    {"name": "iterate_statement_condition", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper), "unary_choice", "iterate_statement_extra"]},
    {"name": "iterate_statement_condition_less", "symbols": ["struct_statement_choice", "iterate_unary"]},
    {"name": "iterate_statement_condition_less", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper), "unary_choice", "iterate_statement_extra"]},
    {"name": "condition_choice", "symbols": ["notter", "condition_notter"]},
    {"name": "condition_notter_choice", "symbols": ["string_access"]},
    {"name": "condition_notter_choice", "symbols": ["first_compute_choice"]},
    {"name": "condition_notter", "symbols": ["negation", (lexer.has("id") ? {type: "id"} : id), "condition_notter_choice"]},
    {"name": "condition_notter", "symbols": ["literal"]},
    {"name": "condition_notter", "symbols": ["iterate_statement_condition_less"]},
    {"name": "condition_notter", "symbols": ["compute_choice_less"]},
    {"name": "first_compute_choice", "symbols": [(lexer.has("arith_oper") ? {type: "arith_oper"} : arith_oper), "compute_choice", "recur_compute"]},
    {"name": "digit_choice_less", "symbols": ["notter", "digit_notter_less"]},
    {"name": "digit_notter_less", "symbols": ["int_literal"]},
    {"name": "digit_notter_less", "symbols": [(lexer.has("dec_literal") ? {type: "dec_literal"} : dec_literal)]},
    {"name": "compute_choice_less_less", "symbols": [(lexer.has("arith_oper") ? {type: "arith_oper"} : arith_oper), "compute_choice", "recur_compute"]},
    {"name": "compute_choice_less_less", "symbols": ["negation", (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "digit_choice", "additional_compute", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "recur_compute"]},
    {"name": "compute_choice_less", "symbols": ["digit_choice_less", (lexer.has("arith_oper") ? {type: "arith_oper"} : arith_oper), "compute_choice", "recur_compute"]},
    {"name": "compute_choice_less", "symbols": ["negation", (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "digit_choice", "additional_compute", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "recur_compute"]},
    {"name": "compute_less", "symbols": ["digit_choice_less"]},
    {"name": "compute_less", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "digit_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "first_condition_choice", "symbols": ["oper_choice", "condition", "recur_condition"]},
    {"name": "condition_choice_less", "symbols": ["notter", "condition_notter_less"]},
    {"name": "choice_choice", "symbols": ["compute_choice_less_less"]},
    {"name": "choice_choice", "symbols": []},
    {"name": "condition_notter_less", "symbols": [(lexer.has("str_literal") ? {type: "str_literal"} : str_literal), "string_access"]},
    {"name": "condition_notter_less", "symbols": [(lexer.has("bool_literal") ? {type: "bool_literal"} : bool_literal)]},
    {"name": "condition_notter_less", "symbols": ["int_literal", "choice_choice"]},
    {"name": "condition_notter_less", "symbols": [(lexer.has("dec_literal") ? {type: "dec_literal"} : dec_literal), "choice_choice"]},
    {"name": "condition_notter_less", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper), "unary_choice"]},
    {"name": "condition_extra_less", "symbols": ["condition_choice_less"]},
    {"name": "condition_extra_less", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "condition_less_choice", "symbols": ["oper_choice", "condition", "recur_condition"]},
    {"name": "condition_less_choice", "symbols": []},
    {"name": "condition_less", "symbols": ["condition_extra_less", "condition_less_choice"]},
    {"name": "condition_less", "symbols": ["notter", (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition_extra", "additional_condition", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "recur_condition"]},
    {"name": "oper_choice", "symbols": [(lexer.has("relation_oper") ? {type: "relation_oper"} : relation_oper)]},
    {"name": "oper_choice", "symbols": [(lexer.has("logical_oper") ? {type: "logical_oper"} : logical_oper)]},
    {"name": "notter", "symbols": [(lexer.has("not") ? {type: "not"} : not)]},
    {"name": "notter", "symbols": []},
    {"name": "condition_extra", "symbols": ["condition_choice"]},
    {"name": "condition_extra", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "condition", "symbols": ["condition_extra", "oper_choice", "condition", "recur_condition"]},
    {"name": "condition", "symbols": ["notter", (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition_extra", "additional_condition", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "recur_condition"]},
    {"name": "condition", "symbols": ["condition_extra"]},
    {"name": "recur_condition", "symbols": ["additional_condition"]},
    {"name": "recur_condition", "symbols": []},
    {"name": "additional_condition", "symbols": ["oper_choice", "condition_choice", "recur_condition"]},
    {"name": "additional_condition", "symbols": ["extra_condition"]},
    {"name": "extra_condition", "symbols": ["oper_choice", "condition"]},
    {"name": "for_int", "symbols": [(lexer.has("int") ? {type: "int"} : int)]},
    {"name": "for_int", "symbols": []},
    {"name": "for_choice", "symbols": ["compute_choice"]},
    {"name": "for_choice", "symbols": ["notter", "for_notter"]},
    {"name": "for_notter", "symbols": ["iterate_statement"]},
    {"name": "for_initial", "symbols": ["for_int", (lexer.has("id") ? {type: "id"} : id), (lexer.has("equal") ? {type: "equal"} : equal), "for_choice", "for_initial_extra"]},
    {"name": "for_initial", "symbols": []},
    {"name": "for_initial_extra", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "for_initial"]},
    {"name": "for_initial_extra", "symbols": []},
    {"name": "iterate_statement_extra", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "iterate_statement"]},
    {"name": "iterate_statement_extra", "symbols": []},
    {"name": "iterate_choice", "symbols": ["int_literal"]},
    {"name": "iterate_choice", "symbols": [(lexer.has("dec_literal") ? {type: "dec_literal"} : dec_literal)]},
    {"name": "iterate_choice", "symbols": [(lexer.has("id") ? {type: "id"} : id), "digit_another_choice"]},
    {"name": "unary_choice", "symbols": [(lexer.has("id") ? {type: "id"} : id), "struct_statement_choice"]},
    {"name": "iterate_statement", "symbols": ["unary_choice", "iterate_unary"]},
    {"name": "iterate_statement", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper), "unary_choice", "iterate_statement_extra"]},
    {"name": "iterate_statement", "symbols": []},
    {"name": "iterate_unary", "symbols": [(lexer.has("unary_oper") ? {type: "unary_oper"} : unary_oper), "iterate_statement_extra"]},
    {"name": "iterate_unary", "symbols": [(lexer.has("assign_oper") ? {type: "assign_oper"} : assign_oper), "iterate_choice", "iterate_statement_extra"]},
    {"name": "recur_for_condition", "symbols": [(lexer.has("logical_oper") ? {type: "logical_oper"} : logical_oper), "for_condition"]},
    {"name": "recur_for_condition", "symbols": []},
    {"name": "for_condition_extra", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "for_condition"]},
    {"name": "for_condition_extra", "symbols": []},
    {"name": "for_choice_extra", "symbols": ["for_choice"]},
    {"name": "for_choice_extra", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "for_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "for_condition", "symbols": ["condition", "for_condition_extra"]},
    {"name": "for_condition", "symbols": []},
    {"name": "loop_statement", "symbols": [(lexer.has("loopFor") ? {type: "loopFor"} : loopFor), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "for_initial", (lexer.has("terminator") ? {type: "terminator"} : terminator), "for_condition", (lexer.has("terminator") ? {type: "terminator"} : terminator), "iterate_statement", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "statement"]},
    {"name": "loop_statement", "symbols": [(lexer.has("loopWhile") ? {type: "loopWhile"} : loopWhile), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "statement"]},
    {"name": "loop_statement", "symbols": [(lexer.has("loopDo") ? {type: "loopDo"} : loopDo), "statement", (lexer.has("loopWhile") ? {type: "loopWhile"} : loopWhile), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "if_statement", "symbols": [(lexer.has("stateIf") ? {type: "stateIf"} : stateIf), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "statement", "else_choice"]},
    {"name": "else_choice", "symbols": [(lexer.has("stateElse") ? {type: "stateElse"} : stateElse), "statement"]},
    {"name": "else_choice", "symbols": [(lexer.has("elf") ? {type: "elf"} : elf), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "condition", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), "statement", "else_choice"]},
    {"name": "else_choice", "symbols": []},
    {"name": "switch_choice", "symbols": ["notter", "switch_notter"]},
    {"name": "switch_choice", "symbols": [(lexer.has("str_literal") ? {type: "str_literal"} : str_literal), (lexer.has("access") ? {type: "access"} : access), (lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)]},
    {"name": "switch_notter", "symbols": [(lexer.has("id") ? {type: "id"} : id), "digit_another_choice", "string_access"]},
    {"name": "switch_statement", "symbols": [(lexer.has("stateSwitch") ? {type: "stateSwitch"} : stateSwitch), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "switch_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren), (lexer.has("open_brace") ? {type: "open_brace"} : open_brace), (lexer.has("vote") ? {type: "vote"} : vote), "vote_choice", (lexer.has("colon") ? {type: "colon"} : colon), "function_statement", (lexer.has("kill") ? {type: "kill"} : kill), (lexer.has("terminator") ? {type: "terminator"} : terminator), "vote", (lexer.has("stateDefault") ? {type: "stateDefault"} : stateDefault), (lexer.has("colon") ? {type: "colon"} : colon), "function_statement", (lexer.has("close_brace") ? {type: "close_brace"} : close_brace)]},
    {"name": "vote_choice", "symbols": ["int_literal"]},
    {"name": "vote_choice", "symbols": [(lexer.has("str_literal") ? {type: "str_literal"} : str_literal), "string_access"]},
    {"name": "vote", "symbols": [(lexer.has("vote") ? {type: "vote"} : vote), "vote_choice", (lexer.has("colon") ? {type: "colon"} : colon), "function_statement", (lexer.has("kill") ? {type: "kill"} : kill), (lexer.has("terminator") ? {type: "terminator"} : terminator), "vote"]},
    {"name": "vote", "symbols": []},
    {"name": "return_statement", "symbols": [(lexer.has("stateReturn") ? {type: "stateReturn"} : stateReturn), "return_first_choice", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "return_first_choice", "symbols": ["return_choice"]},
    {"name": "return_first_choice", "symbols": [(lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "return_choice", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "return_choice", "symbols": ["variable_choice"]},
    {"name": "return_choice", "symbols": []},
    {"name": "recur_declare", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "parameter_define"]},
    {"name": "first_struct", "symbols": ["data_type", (lexer.has("id") ? {type: "id"} : id), "parameter_define", (lexer.has("terminator") ? {type: "terminator"} : terminator), "recur_struct"]},
    {"name": "recur_struct", "symbols": ["data_type", (lexer.has("id") ? {type: "id"} : id), "parameter_define", (lexer.has("terminator") ? {type: "terminator"} : terminator), "recur_struct"]},
    {"name": "recur_struct", "symbols": []},
    {"name": "struct_define", "symbols": [(lexer.has("id") ? {type: "id"} : id), "parameter_define", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "assign_struct", "symbols": ["struct_choice", "element"]},
    {"name": "struct_statement", "symbols": [(lexer.has("id") ? {type: "id"} : id), "struct_choice", "element"]},
    {"name": "struct_statement_choice", "symbols": ["struct_choice", "element"]},
    {"name": "struct_choice", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "extra_struct"]},
    {"name": "struct_choice", "symbols": []},
    {"name": "extra_struct", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)]},
    {"name": "extra_struct", "symbols": []},
    {"name": "element_choice", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "element_option"]},
    {"name": "element_choice", "symbols": []},
    {"name": "element_option", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)]},
    {"name": "element_option", "symbols": []},
    {"name": "element", "symbols": [(lexer.has("dot") ? {type: "dot"} : dot), (lexer.has("id") ? {type: "id"} : id), "element_choice"]},
    {"name": "element", "symbols": []},
    {"name": "recur_define", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("id") ? {type: "id"} : id), "assign_struct_size", "recur_define"]},
    {"name": "recur_define", "symbols": []},
    {"name": "parameter_define", "symbols": ["assign_struct_size", "recur_define"]},
    {"name": "parameter_define", "symbols": []},
    {"name": "array_parameter", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket)]},
    {"name": "array_parameter", "symbols": []},
    {"name": "parameter", "symbols": ["data_type", (lexer.has("id") ? {type: "id"} : id), "array_parameter", "recur_parameter"]},
    {"name": "parameter", "symbols": [(lexer.has("id") ? {type: "id"} : id), (lexer.has("id") ? {type: "id"} : id), "array_parameter", "recur_parameter"]},
    {"name": "parameter", "symbols": []},
    {"name": "recur_parameter", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "recur_parameter_again"]},
    {"name": "recur_parameter", "symbols": []},
    {"name": "recur_parameter_again", "symbols": ["data_type", (lexer.has("id") ? {type: "id"} : id), "array_parameter", "recur_parameter"]},
    {"name": "recur_parameter_again", "symbols": [(lexer.has("id") ? {type: "id"} : id), (lexer.has("id") ? {type: "id"} : id), "array_parameter", "recur_parameter"]},
    {"name": "id_array", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "id_array_2D"]},
    {"name": "id_array_2D", "symbols": [(lexer.has("open_bracket") ? {type: "open_bracket"} : open_bracket), "struct_size", (lexer.has("close_bracket") ? {type: "close_bracket"} : close_bracket), "id_array_2D"]},
    {"name": "function_variables_choice", "symbols": ["function_call_statement_choice"]},
    {"name": "function_variables_choice", "symbols": ["struct_statement_choice"]},
    {"name": "function_variables_choice", "symbols": ["first_compute_choice"]},
    {"name": "function_variables_choice", "symbols": ["first_condition_choice"]},
    {"name": "function_variables", "symbols": [(lexer.has("id") ? {type: "id"} : id), "function_variables_choice"]},
    {"name": "function_variables", "symbols": ["literal"]},
    {"name": "function_variables", "symbols": ["compute_choice_less"]},
    {"name": "function_variables", "symbols": ["condition_less"]},
    {"name": "function_call_statement", "symbols": [(lexer.has("id") ? {type: "id"} : id), (lexer.has("open_paren") ? {type: "open_paren"} : open_paren), "function_call", (lexer.has("close_paren") ? {type: "close_paren"} : close_paren)]},
    {"name": "function_call", "symbols": ["function_variables", "additional_call"]},
    {"name": "function_call", "symbols": []},
    {"name": "additional_call", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "function_variables", "additional_call"]},
    {"name": "additional_call", "symbols": []},
    {"name": "oper", "symbols": [(lexer.has("arith_oper") ? {type: "arith_oper"} : arith_oper), "struct_size", "oper"]},
    {"name": "oper", "symbols": []}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
