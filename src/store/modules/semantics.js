export default {
  namespaced: true,
  state: {
    dataTypes: ["int", "dec", "str", "bool"],
    ids: [],
    globalIds: [],
    structs: [],
    elements: [],
    tasks: [],
  },
  mutations: {
    ADD_ID(state, variable){
      state.ids.push(variable);
    },
    REMOVE_IDS(state){
      const ids = state.ids;
      let deleteIndex = ids.length-1;
      while(deleteIndex >= 0 && ids[deleteIndex].lex !== "begin"){
        ids.pop();
        deleteIndex--;
      }
      ids.pop();
    },
    ADD_GLOBAL(state, variable){
      state.globalIds.push(variable);
    },
    ADD_STRUCT(state, variable) {
      state.structs.push(variable);
    },
    ADD_ELEMENT(state, variable) {
      state.elements.push(variable);
    },
    ADD_TASK(state, variable) {
      state.tasks.push(variable);
    },
    CLEAR(state){
      state.ids = [];
      state.globalIds = [];
      state.structs = [];
      state.elements = [];
      state.tasks = [];
    }
  },
  actions: {
    async ANALYZE({ rootState, state, commit, dispatch }, tokenStream){
      const dataTypes = state.dataTypes;
      const globals = state.globalIds;
      const structs = state.structs;
      const elements = state.elements;
      const tasks = state.tasks;
      //first loop to get all tasks, structs, and global variables
      let index = 0;
      while(index < tokenStream.length){
        let editable = true; //for illegal re-assignment later

        //skip main function
        if(tokenStream[index].word === "IN"){
          while(tokenStream[index].word !== "OUT") 
            index++;
        }

        else{
          if(tokenStream[index].word === "vital"){ //if global const
            editable = false;
            index++;
          }
          if(dataTypes.includes(tokenStream[index].word)){ //if declarations
            const dtype = tokenStream[index].word; //to store the data type
            index++; //moves forward to the id
            let moreDeclare = true; //for single-line declarations

            while(moreDeclare){
              const global = tokenStream[index];
              global.dtype = dtype;
              global.editable = editable;

              const idIndex = await dispatch("FIND_INDEX", { //find the index
                idStream: globals, 
                variable: global, 
                struct: undefined, 
                location: "variable",
                forDeclare: true
              });

              index++;
              if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
                if(tokenStream[index].word === "@") index++;
                let moreArray = true;
                while(moreArray){
                  index++;
                  const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                    tokenStream: tokenStream,
                    index: index,
                    open: "[",
                    close: "]"
                  });
                  index = i;
                  await dispatch("EXPRESSION_EVALUATOR", {
                    expectedDtype: "int",
                    expression: expr,
                    evaluateArray: true,
                    illegalTokens: [],
                    legalIds: [],
                  });
                  if(tokenStream[index].word !== "[") moreArray = false;
                }
              }

              if(idIndex < 0) commit("ADD_GLOBAL", global); //if no duplicate

              while(tokenStream[index].word !== "," && tokenStream[index].word !== ";") index++; //for next id
              if(tokenStream[index].word === ";") moreDeclare = false; //end of declaration
              else index++; //more declaration; found a comma
            }
          } else if(tokenStream[index].word === "struct"){ //if struct declarations
            index++; //move forward to struct name
            const struct = tokenStream[index].word; //for elements later

            const structIndex = await dispatch("FIND_INDEX", { //find index
              idStream: structs,
              variable: tokenStream[index],
              struct: undefined,
              location: "struct",
              forDeclare: true
            });

            if(structIndex < 0) commit("ADD_STRUCT", tokenStream[index]); //if no duplicate
            
            //add all elements to array
            index += 2; //move forward to dtype

            while(tokenStream[index].word !== "}"){ //while struct is not yet done
              if(dataTypes.includes(tokenStream[index].word)){
                const dtype = tokenStream[index].word; //to get the data type
                index++; //move forward to id
                let moreElement = true;
                while(moreElement){
                  const element = tokenStream[index];
                  element.editable = true;
                  element.dtype = dtype
                  element.struct = struct;

                  const elementIndex = await dispatch("FIND_INDEX", { //find index
                    idStream: elements,
                    variable: element,
                    struct: undefined,
                    location: "element",
                    forDeclare: true
                  });

                  index++;
                  if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
                    if(tokenStream[index].word === "@") index++;
                    let moreArray = true;
                    while(moreArray){
                      index++;
                      const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                        tokenStream: tokenStream,
                        index: index,
                        open: "[",
                        close: "]"
                      });
                      index = i;
                      await dispatch("EXPRESSION_EVALUATOR", {
                        expectedDtype: "int",
                        expression: expr,
                        evaluateArray: true,
                        illegalTokens: [],
                        legalIds: [],
                      });
                      if (tokenStream[index].word !== "[") moreArray = false;
                    }
                  }

                  if(elementIndex < 0) commit("ADD_ELEMENT", element); //if no duplicate

                  while(tokenStream[index].word !== "," && tokenStream[index].word !== ";") index++;
                  if(tokenStream[index].word === ";") moreElement = false;
                  else index++;
                }
              }
              index++;
            }
          } else if(tokenStream[index].word === "task"){ //if task declarations
            index++; //move forward to task dtype
            const taskType = tokenStream[index].word;
            index++; //move forward to task name
            const task = tokenStream[index];
            task.dtype = taskType;
            task.paramCount = 0;
            task.parameters = [];

            while(tokenStream[index].word !== ")"){ //get all parameters
              if(dataTypes.includes(tokenStream[index].word)
                || (tokenStream[index].token === "id" && tokenStream[index + 1].token === "id")
              ){
                task.parameters.push(tokenStream[index].word);
                task.paramCount++;
              }
              index++;
            }
            const taskIndex = await dispatch("FIND_INDEX", { //find index
              idStream: tasks,
              variable: task,
              struct: undefined,
              location: "task",
              forDeclare: true
            });
            if(taskIndex < 0) commit("ADD_TASK", task); //if no duplicate

            index += 2;
            let curlyCounter = 1;
            while(curlyCounter > 0){
              if(tokenStream[index].word === "{") curlyCounter++;
              else if(tokenStream[index].word === "}") curlyCounter--;
              if(curlyCounter > 0) index++;
            }
          }
        }
        index++;
      }

      //second loop to check everything else
      index = tokenStream.findIndex(token => token.word === "IN");
      index = await dispatch("FUNCTION_BLOCK_EVALUATOR", {
        tokenStream: tokenStream,
        index: index
      });
    },
    async FIND_INDEX({ state, commit }, payload){ //returns index to be used if no idea where it is
      const { idStream, variable, struct, location, forDeclare } = payload;
      let index = -1;
      const globals = state.globalIds;

      if(idStream) index = location === "element"
        ? struct
          ? idStream.findIndex(id => id.lex === variable.lex && struct === variable.struct)
          : idStream.findIndex(id => id.lex === variable.lex && id.struct === variable.struct)
        : idStream.findIndex(id => id.lex === variable.lex);
      if(index < 0) index = globals.findIndex(global => global.lex === variable.lex);
      if(index >= 0 && forDeclare){
        commit("main/SET_ERROR", {
          type: "sem-error",
          msg: `Duplicate declaration of ${location} (${variable.word})`,
          line: variable.line,
          col: variable.col,
          exp: "-"
        },
        {
          root: true
        });
      }
      return index;
    },
    async EXPRESSION_EVALUATOR({ state, commit, dispatch }, payload){
      const { expectedDtype, expression, evaluateArray, illegalTokens, legalIds } = payload;
      const dataTypes = state.dataTypes;
      const illegalBool = ["-=", "*=", "**=", "/=", "//=", "%="];
      const illegalStr = ["++", "--", ...illegalBool];
      const illegalAssign = ["=", "+=", ...illegalStr];
      if(evaluateArray){
        let index = 0;
        while(index < expression.length){
          if(expression[index].token === "id"){
            const dtype = await dispatch("FIND_GROUP", {
              previous: expression[index-1],
              current: expression[index],
              next: expression[index+1],
              expression: expression,
              index: index
            });
            if(dtype !== expectedDtype && (dataTypes.includes(dtype) || dtype === undefined)) commit("main/SET_ERROR", {
              type: "sem-error",
              msg: `Cannot access using ${dtype} (${expression[index].word})`,
              line: expression[index].line,
              col: expression[index].col,
              exp: `${expectedDtype} value`
            },
            {
              root: true
            });
          }
          index++;
        }
      } else{
        if (legalIds && legalIds.includes(expectedDtype) || expectedDtype === undefined){
          let index = 0;
          if(expectedDtype === undefined && illegalAssign && illegalAssign.includes(expression[index].word))
            commit("main/SET_ERROR", {
              type: "sem-error",
              msg: `Cannot set value of ${expectedDtype}`,
              line: expression[0].line,
              col: expression[0].col,
              exp: `-`
            },
            {
              root: true
            });
          while(index < expression.length){
            const dtype = expression[index].token === "id"
              ? await dispatch("FIND_GROUP", {
                  previous: expression[index - 1],
                  current: expression[index],
                  next: expression[index + 1],
                  expression: expression,
                  index: index
                })
              : null;
            if (!legalIds.includes(dtype) 
                && (dataTypes.includes(dtype) 
                    || dtype === "empty"
                    || (dtype === undefined 
                        && expectedDtype !== undefined) 
                    || illegalTokens.includes(expression[index].token))
            ) commit("main/SET_ERROR", {
              type: "sem-error",
              msg: `Mismatched types of ${expectedDtype} and ${dtype === null ? expression[index].token : dtype} (${expression[index].word})`,
              line: expression[index].line,
              col: expression[index].col,
              exp: `${expectedDtype} value`
            },
            {
              root: true
            });
            index++;
          }
        } 
      }
    },
    async FIND_GROUP({ state, commit }, payload){ //returns data type or undefined
      let { previous, current, next, expression, index } = payload;
      const dataTypes = state.dataTypes;
      const globals = state.globalIds;
      const ids = state.ids;
      const tasks = state.tasks;
      const elements = state.elements;
      
      if( //if not an element or task
        current.token === "id"
        && (!previous || previous.word !== ".") 
        && (!next || next.word !== "(")
      ){
        let idIndex = globals.findIndex(global => global.lex === current.lex);
        if(idIndex >= 0) return globals[idIndex].dtype;
        else{ 
          idIndex = ids.findIndex(id => id.lex === current.lex);
          if(idIndex >= 0) return ids[idIndex].dtype;
          else commit("main/SET_ERROR", {
            type: "sem-error",
            msg: `Undeclared identifier (${current.word})`,
            line: current.line,
            col: current.col,
            exp: "-"
          },
          {
            root: true
          });
          return undefined;
        }
      } else if(next && next.word === "("){ //if task
        let taskIndex = tasks.findIndex(task => task.lex === current.lex);
        if(taskIndex >= 0) return tasks[taskIndex].dtype
        else{
          commit("main/SET_ERROR", {
            type: "sem-error",
            msg: `Undeclared task (${current.word})`,
            line: current.line,
            col: current.col,
            exp: "-"
          },
          {
            root: true
          });
          return undefined;
        }
      } else if(previous && previous.word === "."){ //if element
        index -= 2;
        if(expression[index].word === "]"){
          let moreBracket = true;
          while(moreBracket){
            index--;
            if(expression[index].word === "[" && expression[index-1].word !== "]") moreBracket = false;
            index--;
          }
        }
        const idIndex = ids.findIndex(id => id.lex === expression[index].lex);
        if (idIndex < 0 || dataTypes.includes(ids[idIndex].dtype)){
          commit("main/SET_ERROR", {
            type: "sem-error",
            msg: `${current.word} is not an element of ${expression[index].word} (${idIndex < 0 ? 'undefined' : ids[idIndex].dtype})`,
            line: current.line,
            col: current.col,
            exp: "-"
          },
            {
              root: true
            });
          return undefined;
        } else{
          const elementIndex = elements.findIndex(element => element.lex === current.lex && element.struct === ids[idIndex].dtype);
          if(elementIndex < 0){
            commit("main/SET_ERROR", {
              type: "sem-error",
              msg: `Undeclared element (${current.word})`,
              line: current.line,
              col: current.col,
              exp: "-"
            },
            {
              root: true
            });
            return undefined;
          } else {
            return elements[elementIndex].dtype;
          }
        }
      }
    },
    async CHECK_STRUCT({ state, commit }, id){ //returns the struct or undefined\
      const structs = state.structs;
      const structIndex = structs.findIndex(struct => struct.lex === id.lex);
      if(structIndex < 0){
        commit("main/SET_ERROR", {
          type: "sem-error",
          msg: `Undeclared struct (${id.word})`,
          line: id.line,
          col: id.col,
          exp: "-"
        },
          {
            root: true
          });
        return undefined;
      } else return structs[structIndex].word;
    },
    async ADD_TO_EXPRESSION_SET({}, payload){
      let { tokenStream, index, open, close } = payload;
      let setCounter = 1;
      const expression = [];
      while (setCounter > 0) {
        if (tokenStream[index].word === open) setCounter++;
        else if (tokenStream[index].word === close) setCounter--;
        else expression.push(tokenStream[index]);
        index++;
      }
      return{
        i: index,
        expr: expression
      };
    },
    async FUNCTION_BLOCK_EVALUATOR({ state, commit, dispatch }, payload){
      let { tokenStream, index } = payload;
      const open = ["vote", "switch", "task", "for", "if", "elf", "else", "do", "IN"];
      const close = ["}", "OUT", "kill", "EOF"]
      const dataTypes = state.dataTypes;
      const globals = state.globalIds;
      const tasks = state.tasks;
      let blockCounter = 1;
      let foundWhile = false;
      while (blockCounter > 0) {
        const ids = state.ids;
        let editable = true;
        if (open.includes(tokenStream[index].word) || (foundWhile && tokenStream[index].word === "{")){
          blockCounter++;
          commit("ADD_ID", { lex: "begin" })
          if(foundWhile) foundWhile = false;
        } else if (close.includes(tokenStream[index].word) || (foundWhile && tokenStream[index].word === ";")){
          if((tokenStream[index+1] && tokenStream[index+1].word !== "while") || tokenStream[index].word === "EOF"){
            commit("REMOVE_IDS");
            blockCounter--;
          }
          if(foundWhile) foundWhile = false;
        }
        if(tokenStream[index].word === "while") foundWhile = true;
        if (tokenStream[index].word === "vital") { //if global const
          editable = false;
          index++;
        }
        if (dataTypes.includes(tokenStream[index].word) || (tokenStream[index].token === "id" && tokenStream[index + 1].token === "id")) {
          const dtype = tokenStream[index].token === "id"
            ? await dispatch("CHECK_STRUCT", tokenStream[index])
              ? await dispatch("CHECK_STRUCT", tokenStream[index])
              : null
            : tokenStream[index].word;
          index++; //moves forward to the id
          let moreDeclare = true; //for single-line declarations

          while (moreDeclare) {
            const variable = tokenStream[index];
            variable.dtype = dtype;
            variable.editable = editable;
            const idIndex = await dispatch("FIND_INDEX", { //find the index
              idStream: ids,
              variable: variable,
              struct: undefined,
              location: "variable",
              forDeclare: true
            });

            let moreArray = true;
            index++;
            if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
              if (tokenStream[index].word === "@") index++;
              while(moreArray){
                index++;
                const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                  tokenStream: tokenStream,
                  index: index,
                  open: "[",
                  close: "]"
                });
                index = i;
                await dispatch("EXPRESSION_EVALUATOR", {
                  expectedDtype: "int",
                  expression: expr,
                  evaluateArray: true,
                  illegalTokens: [],
                  legalIds: [],
                });
                if (tokenStream[index].word !== "[") moreArray = false;
              }
            }
            if (tokenStream[index+1].word === "{") {
              index++;
              let moreVal = true;
              while (moreVal) {
                index++;
                const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                  tokenStream: tokenStream,
                  index: index,
                  open: "{",
                  close: "}"
                });
                index = i;

                const illegalTokens = dtype === "int" || dtype === "dec"
                  ? ["litStr", "litBool"]
                  : dtype === "str"
                    ? ["litInt", "litDec", "litBool"]
                    : [];

                const legalIds = dtype === "int" || dtype === "dec"
                  ? ["int", "dec"]
                  : dtype === "bool"
                    ? ["int", "dec", "str", "bool"]
                    : dtype === undefined
                      ? []
                      : dtype;

                await dispatch("EXPRESSION_EVALUATOR", {
                  expectedDtype: dtype,
                  expression: expr,
                  evaluateArray: false,
                  illegalTokens: illegalTokens,
                  legalIds: legalIds,
                });
                if (tokenStream[index].word !== "[") moreVal = false;
              }
            }
            else
              index = await dispatch("VALUE_EVALUATOR", {
                tokenStream: tokenStream,
                index: index,
                dtype: dtype,
                editable: true,
                variable: variable,
              });

            if (idIndex < 0) commit("ADD_ID", variable); //if no duplicate

            while (tokenStream[index].word !== "," && tokenStream[index].word !== ";") index++; //for next id
            if (tokenStream[index].word === ";") moreDeclare = false; //end of declaration
            else index++; //more declaration; found a comma
          }
        } else if(tokenStream[index].token === "id" && tokenStream[index+1].word !== "("){
          const variable = tokenStream[index];
          const variableIndex = index;
          let idIndex = ids.findIndex(id => id.lex === variable.lex);
          let searchList;
          if(idIndex >= 0) searchList = ids;
          else{
            idIndex = globals.findIndex(global => global.lex === variable.lex);
            if(idIndex >= 0) searchList = globals;
          } 

          const dtype = idIndex < 0
            ? undefined
            : searchList[idIndex].dtype;

          index++;
          if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
            if (tokenStream[index].word === "@") index++;
            let moreArray = true;
            while(moreArray){
              index++;
              const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                tokenStream: tokenStream,
                index: index,
                open: "[",
                close: "]"
              });
              index = i;
              await dispatch("EXPRESSION_EVALUATOR", {
                expectedDtype: "int",
                expression: expr,
                evaluateArray: true,
                illegalTokens: [],
                legalIds: [],
              });
              if(tokenStream[index].word !== "[") moreArray = false;
            }
          }
          const editable = idIndex >= 0 
            ? searchList[idIndex].editable === false
              ? tokenStream[index].word === "="
                ? false
                : true
              : true
            : true;
          index = await dispatch("VALUE_EVALUATOR", {
            tokenStream: tokenStream,
            index: tokenStream[index].word === "."
              ? variableIndex
              : index,
            dtype: dtype,
            editable: editable,
            variable: variable
          });
        } else if(tokenStream[index].token === "id" && tokenStream[index+1].word === "("){
          let paramCount;
          let parameters;
          const dtype = await dispatch("FIND_GROUP", {
            previous: tokenStream[index - 1],
            current: tokenStream[index],
            next: tokenStream[index + 1],
            expression: tokenStream[index],
            index: 0
          });
          if(dtype){
            const taskIndex = tasks.findIndex(task => task.lex === tokenStream[index].lex);
            paramCount = tasks[taskIndex].paramCount;
            parameters = [...tasks[taskIndex].parameters];
          }
          index += 2;
          let parenCounter = 1;
          let parameterCount = 0;
          while(parenCounter > 0){
            const expr = [];
            while(tokenStream[index].word !== "," && parenCounter > 0){
              if(tokenStream[index].word === "(") parenCounter++;
              if(tokenStream[index].word === ")") parenCounter--;
              if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
                if (tokenStream[index].word === "@") index++;
                let moreArray = true;
                while (moreArray) {
                  index++;
                  const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                    tokenStream: tokenStream,
                    index: index,
                    open: "[",
                    close: "]"
                  });
                  index = i;
                  await dispatch("EXPRESSION_EVALUATOR", {
                    expectedDtype: "int",
                    expression: expr,
                    evaluateArray: true,
                    illegalTokens: [],
                    legalIds: [],
                  });
                  if (tokenStream[index].word !== "[") moreArray = false;
                }
              }
              if(tokenStream[index].word !== "," && tokenStream[index].word !== ")"){
                if(parenCounter > 0 && tokenStream[index].word !== ")") expr.push(tokenStream[index]);
                index++;
              }
            }
            if(tokenStream[index].word !== ";") index++;
            if(expr.length > 0){
              await dispatch("PARAMETER_EVALUATOR", {
                expression: expr,
                parameters: parameters,
                paramCount: paramCount,
                parameterCount: parameterCount,
              })
              parameterCount++;
            }
          }
          if (parameterCount < paramCount) commit("main/SET_ERROR", {
            type: "sem-error",
            msg: `Insufficient number of parameters foundd`,
            line: tokenStream[index-2].line,
            col: tokenStream[index-2].col,
            exp: `${paramCount} number of parameters`
          },
          {
            root: true
          });
        } else if(tokenStream[index].token === "shoot"){
          index += 2;
          let parenCounter = 1;
          while(parenCounter > 0){
            const expression = [];
            while(tokenStream[index].word !== "," && parenCounter > 0){
              if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
                if (tokenStream[index].word === "@") index++;
                let moreArray = true;
                while (moreArray) {
                  index++;
                  const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                    tokenStream: tokenStream,
                    index: index,
                    open: "[",
                    close: "]"
                  });
                  index = i;
                  await dispatch("EXPRESSION_EVALUATOR", {
                    expectedDtype: "int",
                    expression: expr,
                    evaluateArray: true,
                    illegalTokens: [],
                    legalIds: [],
                  });
                  if (tokenStream[index].word !== "[") moreArray = false;
                }
              }
              if(tokenStream[index].word === "(") parenCounter++;
              else if(tokenStream[index].word === ")") parenCounter--;
              if(parenCounter > 0) expression.push(tokenStream[index]);
              index++;
            }
            await dispatch("SHOOT_EVALUATOR", expression);
            if(parenCounter > 0) index++;
          }
        } else if(tokenStream[index].token === "task"){
          index += 4;
          let parenCounter = 1;
          while(parenCounter > 0){
            if(tokenStream[index].word === "(") parenCounter++;
            else if(tokenStream[index].word === ")") parenCounter--;
            else if (dataTypes.includes(tokenStream[index].word) || (tokenStream[index].token === "id" && tokenStream[index + 1].token === "id")) {
              const dtype = tokenStream[index].token === "id"
                ? await dispatch("CHECK_STRUCT", tokenStream[index])
                : tokenStream[index].word;
              index++; //moves forward to the id
              const variable = tokenStream[index];
              variable.dtype = dtype;
              variable.editable = editable;
              const idIndex = await dispatch("FIND_INDEX", { //find the index
                idStream: ids,
                variable: variable,
                struct: undefined,
                location: "variable",
                forDeclare: true
              });

              let moreArray = true;
              index++;
              if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
                if (tokenStream[index].word === "@") index++;
                while (moreArray) {
                  index+=2;
                  if (tokenStream[index].word !== "[") moreArray = false;
                }
              }
              if (idIndex < 0) commit("ADD_ID", variable); //if no duplicate

              while (tokenStream[index].word !== "," && tokenStream[index].word !== ")") index++; //for next id
            }
            if(tokenStream[index].word !== ")")
              index++;
          }
        }
        
        index++;
      }
      return index;
    },
    async PARAMETER_EVALUATOR({ commit, dispatch }, payload){
      const { expression, parameters, paramCount, parameterCount } = payload;
      if (paramCount < parameterCount + 1) commit("main/SET_ERROR", {
        type: "sem-error",
        msg: `Extra parameter found`,
        line: expression[0].line,
        col: expression[0].col,
        exp: `${paramCount} number of parameters`
      },
      {
        root: true
      });
      else {
        const dtype = parameters ? parameters[parameterCount] : undefined;
        const illegalTokens = dtype === "int" || dtype === "dec"
          ? ["litStr", "litBool"]
          : dtype === "str"
            ? ["litInt", "litDec", "litBool"]
            : [];

        const legalIds = dtype === "int" || dtype === "dec"
          ? ["int", "dec"]
          : dtype === "bool"
            ? ["int", "dec", "str", "bool"]
            : dtype === undefined
              ? []
              : dtype;

        await dispatch("EXPRESSION_EVALUATOR", {
          expectedDtype: dtype,
          expression: expression,
          evaluateArray: false,
          illegalTokens: illegalTokens,
          legalIds: legalIds,
        });
      }
    },
    async VALUE_EVALUATOR({ state, dispatch, commit }, payload){
      let { tokenStream, index, dtype, editable, variable } = payload;
      const dataTypes = state.dataTypes;
      const tokens = ["litInt", "litDec", "litStr", "litBool", "id"];

      if (!editable) commit("main/SET_ERROR", {
        type: "sem-error",
        msg: `Illegal re-assignment of vital variable (${variable.word})`,
        line: variable.line,
        col: variable.col,
        exp: "-"
      },
      {
        root: true
      });

      const expr = [];
      while (tokenStream[index].word !== ";" 
        && tokenStream[index].word !== "," 
        && (tokenStream[index].word !== ")" 
        && tokenStream[index + 1].word !== "{")
      ) {
        if (tokenStream[index].word === "[" || tokenStream[index].word === "@") {
          if (tokenStream[index].word === "@") index++;
          let moreArray = true;
          while (moreArray) {
            index++;
            const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
              tokenStream: tokenStream,
              index: index,
              open: "[",
              close: "]"
            });
            index = i;
            await dispatch("EXPRESSION_EVALUATOR", {
              expectedDtype: "int",
              expression: expr,
              evaluateArray: true,
              illegalTokens: [],
              legalIds: [],
            });
            if (tokenStream[index].word !== "[") moreArray = false;
          }
        }
        expr.push(tokenStream[index]);
        if (tokenStream[index].word !== ";"
          && tokenStream[index].word !== ","
          && (tokenStream[index].word !== ")"
            && tokenStream[index + 1].word !== "{"))
          index++;
      }

      if(!dataTypes.includes(dtype) && dtype !== undefined){
        let exprCounter = 0;
        while(exprCounter < expr.length){
          if(tokens.includes(expr[exprCounter].token)){
            dtype = await dispatch("FIND_GROUP", {
              previous: expr[exprCounter - 1],
              current: expr[exprCounter],
              next: expr[exprCounter + 1],
              expression: expr,
              index: exprCounter
            });
          }
          exprCounter++;
        }
      } else if (dtype === undefined) expr.unshift(variable);

      const illegalTokens = dtype === "int" || dtype === "dec"
        ? ["litStr", "litBool"]
        : dtype === "str"
          ? ["litInt", "litDec", "litBool"]
          : [];

      const legalIds = dtype === "int" || dtype === "dec"
        ? ["int", "dec"]
        : dtype === "bool"
          ? ["int", "dec", "str", "bool"]
          : dtype === undefined
            ? []
            : dtype;

      if (expr.length > 0){
        await dispatch("EXPRESSION_EVALUATOR", {
          expectedDtype: dtype,
          expression: expr,
          evaluateArray: false,
          illegalTokens: illegalTokens,
          legalIds: legalIds,
        });
      }
      return index;
    },
    async SHOOT_EVALUATOR({ state, dispatch }, expression){
      const dataTypes = state.dataTypes;
      const literals = ["litInt", "litDec", "litStr", "litBool"];
      const tasks = state.tasks;
      const ids = state.ids;
      const elements = state.elements;
      const globals = state.globalIds;

      let dtype = null;
      let counter = 0;
      while(counter < expression.length && dtype !== "empty" && !dataTypes.includes(dtype) && dtype !== undefined && !literals.includes(expression[counter].token)){
        let idIndex;
        if(expression[counter+1] && expression[counter+1].word === "("){
          idIndex = tasks.findIndex(task => 
            task.lex === expression[counter].lex
          );
          if(idIndex < 0) dtype = undefined;
          else dtype = tasks[idIndex].dtype
        }
        else{
          if(dtype === null){
            idIndex = ids.findIndex(id => id.lex === expression[counter].lex);
            if(idIndex >= 0) dtype = ids[idIndex].dtype;
            else{
              idIndex = globals.findIndex(id => id.lex === expression[counter].lex);
              if(idIndex >= 0) dtype = globals[idIndex].dtype;
            }
          }
          else if(!dataTypes.includes(dtype)){
            idIndex = elements.findIndex(element => element.word === expression[counter].word && dtype === element.struct);
            if(idIndex >= 0 ) dtype = elements[idIndex].dtype;
          }
          if(idIndex >= 0){
            if(!dataTypes.includes(dtype)){
              if(counter+1 < expression.length)
                counter++;
              if (expression[counter] && expression[counter].word === "[" || expression[counter].word === "@") {
                if (expression[counter].word === "@") counter++;
                let moreArray = true;
                while (moreArray) {
                  counter++;
                  const { i, expr } = await dispatch("ADD_TO_EXPRESSION_SET", {
                    tokenStream: expression,
                    index: counter,
                    open: "[",
                    close: "]"
                  });
                  counter = i;
                  await dispatch("EXPRESSION_EVALUATOR", {
                    expectedDtype: "int",
                    expression: expr,
                    evaluateArray: true,
                    illegalTokens: [],
                    legalIds: [],
                  });
                  if (expression[counter].word !== "[") moreArray = false;
                }
              }
            }
          } else dtype = undefined;
        }
        counter++;
      }
      if(counter >= expression.length) counter--;
      if(dtype === null) dtype = expression[counter].token === "litInt"
        ? "int"
        : expression[counter].token === "litDec"
          ? "dec"
          : expression[counter].token === "litStr"
            ? "str"
            : "bool";
      await dispatch("EXPRESSION_EVALUATOR", {
        expectedDtype: dtype,
        expression: expression,
        evaluateArray: false,
        illegalTokens: [],
        legalIds: dtype === "int" || dtype === "dec"
          ? ["int", "dec"]
          : dtype ? dtype : [],
      });
    }
  },
};