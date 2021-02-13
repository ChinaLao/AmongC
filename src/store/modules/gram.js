{
    "lex": {
        "rules": [
            ["\\s+",                          "/* skip whitespace */"],
            ['^[\\"].+[\\"]?',                "return 'str_literal';"],
            ["^[#].+$",                       "return 'comment';"],
            ["^[0-9]+[.][0-9]+$",             "return 'dec_literal';"],
            ["^[0-9]+$",                      "return 'int_literal';"],

            ["^[I][N]$",                      "return 'IN';"],
            ["^[O][U][T]$",                   "return 'OUT';"],
            ["^[i][n][t]$",                   "return 'int';"],
            ["^[d][e][c]$",                   "return 'dec';"],
            ["^[s][t][r][u][c][t]$",          "return 'struct';"],
            ["^[s][t][r]$",                   "return 'str';"],
            ["^[b][o][o][l]$",                "return 'bool';"],
            ["^[e][m][p][t][y]$",             "return 'empty';"],
            ["^[s][h][o][o][t]$",             "return 'shoot';"],
            ["^[s][c][a][n]$",                "return 'scan';"],
            ["^[i][f]$",                      "return 'if';"],
            ["^[e][l][s][e]$",                "return 'else';"],
            ["^[e][l][f]$",                   "return 'elf';"],
            ["^[s][w][i][t][c][h]$",          "return 'switch';"],
            ["^[v][o][t][e]$",                "return 'vote';"],
            ["^[d][e][f][a][u][l][t]$",       "return 'default';"],
            ["^[f][o][r]$",                   "return 'for';"],
            ["^[w][h][i][l][e]$",             "return 'while';"],
            ["^[d][o]$",                      "return 'do';"],
            ["^[k][i][l][l]$",                "return 'kill';"],
            ["^[c][o][n][t][i][n][u][e]$",    "return 'continue';"],
            ["^[t][r][u][e]$",                "return 'bool_literal';"],
            ["^[f][a][l][s][e]$",             "return 'bool_literal';"],
            ["^[r][e][t][u][r][n]$",          "return 'return';"],
            ["^[a][n][d]$",                   "return 'and';"],
            ["^[o][r]$",                      "return 'or';"],
            ["^[v][i][t][a][l]$",             "return 'vital';"],
            ["^[t][r][u][e]$",                "return 'true';"],
            ["^[t][a][s][k]$",                "return 'task';"],
            ["^[c][l][e][a][n]$",             "return 'clean';"],

            ["^[;]$",                         "return ';';"],
            ["^[,]$",                         "return ',';"],
            ["^[.]$",                         "return '.';"],
            ['^[\\"]$',                       "return '\"';"],
            ["^[\\(]$",                       "return '(';"],
            ["^[\\)]$",                       "return ')';"],
            ["^[{]$",                         "return '{';"],
            ["^[}]$",                         "return '}';"],
            ["^[\\[]$",                       "return '[';"],
            ["^[\\]]$",                       "return ']';"],
            ["^[\\:]$",                       "return ':';"],
            ["^[#]$",                         "return '#';"],
            ["^[=][=]$",                      "return '==';"],
            ["^[>][=]$",                      "return '>=';"],
            ["^[<][=]$",                      "return '<=';"],
            ["^[!][=]$",                      "return '!=';"],
            ["^[\\+][=]$",                    "return '+=';"],
            ["^[-][=]$",                      "return '-=';"],
            ["^[/][/][=]$",                   "return '//=';"],
            ["^[/][=]$",                      "return '/=';"],
            ["^[%][=]$",                      "return '%=';"],
            ["^[=]$",                         "return '=';"],
            ["^[\\+][\\+]$",                  "return '++';"],
            ["^[\\+]$",                       "return '+';"],
            ["^[-][-]$",                      "return '--';"],
            ["^[-]$",                         "return '-';"],
            ["^[/][/]$",                      "return '//';"],
            ["^[/]$",                         "return '/';"],
            ["^[%]$",                         "return '%';"],
            ["^[>]$",                         "return '>';"],
            ["^[<]$",                         "return '<';"],
            ["^[*][*][=]$",                   "return '**=';"],
            ["^[*][*]$",                      "return '**';"],
            ["^[*][=]$",                      "return '*=';"],
            ["^[*]$",                         "return '*';"],

            ["[a-z][a-zA-Z0-9]*$",            "return 'id';"],
        ]
    },

    "operators": [
        ["left", "++", "--", "()", "[]", "."],
        ["right", "++", "--", "!"],
        ["left", "**"],
        ["left", "*", "/", "//", "%"],
        ["left", "+", "="],
        ["left", ">", "<", ">=", "<="],
        ["left", "==", "!="],
        ["left", "and"],
        ["left", "or"],
        ["right", "=", "+-", "-=", "*=", "**=", "/=", "//="],
        ["left", ","],
     ],

    "bnf":{

        "expressions": [["e EOF",   "return $1"]],

        "e" :[
           ["e + e",  "$$ = $1+$3"],
           ["e - e",  "$$ = $1-$3"],
           ["e * e",  "$$ = $1*$3"],
           ["e / e",  "$$ = $1/$3"],
           ["e ^ e",  "$$ = Math.pow($1, $3)"],
           ["e !",    "$$ = (function(n) {if(n==0) return 1; return arguments.callee(n-1) * n})($1)"],
           ["e %",    "$$ = $1/100"],
           ["- e",    "$$ = -$2", {"prec": "UMINUS"}],
           ["( e )",  "$$ = $2"],
           ["NUMBER", "$$ = Number(yytext)"],
           ["E",      "$$ = Math.E"],
           ["PI",     "$$ = Math.PI"]
        ]
        
        "program": [["global IN main_statement OUT function", "return $1 $3 $5"]],

        "global": [["global_choice global"], ["comment global"], null]

        "program":
            ["global IN main_statement OUT function"],
        
        "global":
            ["global_choice global", "comment global", null],
        
        "global_choice":
            ["vital_define"],
        
        "data_type":
            ["int", "dec", "str", "bool"],
        
        "vital_define":
            ["vital data_type id = literal recur_vital;"],
        
        "literal":
            ["int_literal", "dec_literal", "str_literal", "bool_literal"],
        
        "recur_vital":
            [",id = literal recur_vital", null],
    }
}