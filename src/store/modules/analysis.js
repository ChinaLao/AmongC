const JisonLex = require("jison-lex");
//const Parser = require("jison").Parser;
export default {
    namespaced: true,
    state: {
        analysis: [],
        "bnf": { //global main function
            "program":[
                ["global IN main_statement OUT function"]
            ],
            "global":[
                [null],
                ["global_choice global"],
                ["comment global"],
                
            ],
            "global_choice":[
                ["vital_define"]
            ],
            "data_type":[
                ["int"], 
                ["dec"], 
                ["str"], 
                ["bool"]
            ],
            "vital_define":[
                ["vital data_type id = literal recur_vital;"]
            ],
            "literal":[
                ["int_literal"],
                ["dec_literal"],
                ["str_literal"],
                ["bool_literal"]
            ],
            "recur_vital":[
                [null],
                [",id = literal recur_vital"],
                
            ]

        },//vital int num = 5;
    //    ebnf :{
    //     data_type : ["int", "dec", "str", "bool"],
    //     literal :  ["int_literal", "dec_literal", "str_literal", "bool_literal"],
    //     recur_vital : [[",", "id", "=", literal, recur_vital], null],
    //     vital_define : ["vital", data_type, "id", "=", literal, recur_vital]
    //    }
    }, // vital int num = 5;
    getters: {
        ANALYSIS: (state) => state.analysis,
    },
    mutations: {
        SET_ANALYSIS(state, payload) {
            state.analysis = payload;
        },
    },
     actions: {
        GET_ANALYSIS({ state, commit, rootState}, payload) {
            // const grammar = {
            //     bnf: state.bnf,
            // };
            const syntaxG = rootState.syntax.grammar;
            // const parser = new Parser(syntaxG);
            // console.log(parser.parse("int"));
            let line = [];
            let i = 0;
            let foundProperty;
            let isPropFound = false;
            syntaxG.forEach((element, index) => {
                while(i === element.line){
                    const properties = Object.keys(state.ebnf); //returns array of properties
                    // properties.forEach(property => {
                    //     if(ebnf[property].includes(element.word)) {
                    //         foundProperty = ebnf[property]; 
                    //         isPropFound = true;
                    //     }
                    // });
                    while(i < ebnf[properties] && !isPropFound){
                        if(ebnf[properties][i].includes(element.word)) {
                            foundProperty = ebnf[properties]; 
                            isPropFound = true;
                        }
                        i++;
                    }
                    if(isPropFound){

                    }
                }
            });

            // commit("SET_ANALYSIS");
        },
    },
};
