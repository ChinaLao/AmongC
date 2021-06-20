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
    async ANALYZE({ state, commit, dispatch }, tokenStream){
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
              if (tokenStream[index].word === "[") {
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
                    illegalWords: [],
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
                  if (tokenStream[index].word === "[") {
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
                        illegalWords: [],
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

            index += 2; //move forward after opening brace
            index = await dispatch("FUNCTION_BLOCK_EVALUATOR", {
              tokenStream: tokenStream,
              index: index
            });
          }
        }
        index++;
      }

      //second loop to check everything else
      index = tokenStream.findIndex(token => token.word === "IN");
      index = await dispatch("FUNCTION_BLOCK_EVALUATOR", {
        tokenStream: tokenStream,
        index: index+1
      });
    },
    async FIND_INDEX({ commit }, payload){ //returns index to be used if no idea where it is
      const { idStream, variable, struct, location, forDeclare } = payload;
      let index = -1;

      if(idStream) index = location === "element"
        ? struct
          ? idStream.findIndex(id => id.lex === variable.lex && struct === variable.struct)
          : idStream.findIndex(id => id.lex === variable.lex && id.struct === variable.struct)
        : idStream.findIndex(id => id.lex === variable.lex);
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
      const { expectedDtype, expression, evaluateArray, illegalWords, illegalTokens, legalIds } = payload;
      console.log(payload)
      const legalTokens = ["equal", "id"];
      const literals = ["litInt", "litDec", "litStr", "litBool"];
      const dataTypes = state.dataTypes;
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
        if (legalIds.includes(expectedDtype) || expectedDtype === undefined){
          let index = 0;
          if(expectedDtype === undefined && expression[index].word === "=") commit("main/SET_ERROR", {
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
            if (illegalWords.includes(expression[index].word) 
                || (illegalWords.length === 0 
                && !legalTokens.includes(expression[index].token))
                && !literals.includes(expression[index].token)
            ) commit("main/SET_ERROR", {
              type: "sem-error",
              msg: `Cannot use symbol ${expression[index].word} on ${expectedDtype}`,
              line: expression[index].line,
              col: expression[index].col,
              exp: `-`
            },
            {
              root: true
            });
            else {
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
                  || (dtype === undefined && expectedDtype !== undefined) 
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

            }
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
        (!previous || previous.word !== ".") 
        && (!next || next.word !== "(")
      ){
        let idIndex = globals.findIndex(global => global.lex === current.lex);
        if(idIndex >= 0) return globals[idIndex].dtype;
        else{ 
          idIndex = ids.findIndex(id => id.lex === current.lex);
          if(idIndex >= 0) return ids[idIndex].dtype;
          else commit("main/SET_ERROR", {
            type: "sem-error",
            msg: `Undeclared variable (${current.word})a`,
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
      const close = ["}", "OUT"]
      const dataTypes = state.dataTypes;
      const ids = state.ids;
      let blockCounter = 1;
      while (blockCounter > 0) {
        let editable = true;

        if (open.includes(tokenStream[index].word)){
          blockCounter++;
          commit("ADD_ID", { lex: "begin" })
        } else if (close.includes(tokenStream[index].word)){
          if(tokenStream[index+1].word === "while"){
            let counter = index+1;
            while(tokenStream[counter] !== ";" && tokenStream[counter].word !== "{") counter++;
            if (tokenStream[counter] !== ";"){
              //evaluate content of while
              index = counter+1;
            }
          }
          commit("REMOVE_IDS");
          blockCounter--;
        } else {
          if (tokenStream[index].word === "vital") { //if global const
            editable = false;
            index++;
          }
          if (dataTypes.includes(tokenStream[index].word) || (tokenStream[index].token === "id" && tokenStream[index + 1].token === "id")) {
            const dtype = tokenStream[index].token === "id"
              ? await dispatch("CHECK_STRUCT", tokenStream[index])
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
              if (tokenStream[index].word === "[") {
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
                    illegalWords: [],
                    illegalTokens: [],
                    legalIds: [],
                  });
                  if (tokenStream[index].word !== "[") moreArray = false;
                }
              }
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
          } else if(tokenStream[index].token === "id"){
            const variable = tokenStream[index]
            const idIndex = ids.findIndex(id => id.lex === variable.lex);
            if (idIndex < 0) commit("main/SET_ERROR", {
              type: "sem-error",
              msg: `Undeclared variable (${variable.word})`,
              line: variable.line,
              col: variable.col,
              exp: "-"
            },
            {
              root: true
            });

            const dtype = idIndex < 0
              ? undefined
              : ids[idIndex].dtype;

            index++;
            if (tokenStream[index].word === "[") {
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
                  illegalWords: [],
                  illegalTokens: [],
                  legalIds: [],
                });
                if(tokenStream[index].word !== "[") moreArray = false;
              }
            }

            index = await dispatch("VALUE_EVALUATOR", {
              tokenStream: tokenStream,
              index: index,
              dtype: dtype,
              editable: idIndex >= 0 ? ids[idIndex].editable : true,
              variable: variable
            });
          } else if(tokenStream[index].token === "shoot"){
            index += 2;
            let parenCounter = 1;
            while(parenCounter > 0){
              console.log(tokenStream[index], index)
              const expr = [];
              while(tokenStream[index].word !== "," && parenCounter > 0){
                if(tokenStream[index].word === "(") parenCounter++;
                else if(tokenStream[index].word === ")") parenCounter--;
                if(parenCounter > 0) expr.push(tokenStream[index]);
                index++;
                console.log(tokenStream[index])
              }
              await dispatch("SHOOT_EVALUATOR", expr);
              if(parenCounter > 0) index++;
              console.log(tokenStream[index])
            }
          }
        }
        index++;
      }
      return index;
    },
    async VALUE_EVALUATOR({ dispatch, commit }, payload){
      let { tokenStream, index, dtype, editable, variable } = payload;
      const bool = ["<", ">", "<=", ">=", "==", "!=", "!", "and", "or"];
      const int = ["-", "*", "**", "/", "//", "%", "++", "--", "~"];
      const assign = ["-=", "*=", "**=", "/=", "//=", "%="];
      const notBool = [...assign, "++", "--", "="];

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

      const subDtype = notBool.includes(tokenStream[index].word) || dtype === undefined
        ? dtype
        : "bool";

      const expr = [];
      while (tokenStream[index].word !== ";" && tokenStream[index].word !== "," && (tokenStream[index].word !== ")" && tokenStream[index + 1].word !== "{")) {
        expr.push(tokenStream[index]);
        index++;
      }
      const illegalWords = subDtype === "int" || subDtype === "dec"
        ? [...bool, "@"]
        : subDtype === "str"
          ? [...bool, ...int, ...assign]
          : subDtype === "bool"
            ? ["@"]
            : [];

      const illegalTokens = subDtype === "int" || subDtype === "dec"
        ? ["litStr", "litBool"]
        : subDtype === "str"
          ? ["litInt", "litDec", "litBool"]
          : [];

      const legalIds = subDtype === "int" || subDtype === "dec"
        ? ["int", "dec"]
        : subDtype === undefined
          ? []
          : subDtype;

      if (expr.length > 0)
        await dispatch("EXPRESSION_EVALUATOR", {
          expectedDtype: subDtype,
          expression: expr,
          evaluateArray: false,
          illegalWords: illegalWords,
          illegalTokens: illegalTokens,
          legalIds: legalIds,
        });
      return index;
    },
    async SHOOT_EVALUATOR({ state, commit, dispatch }, expression){
      const dataTypes = state.dataTypes;
      const bool = ["<", ">", "<=", ">=", "==", "!=", "!", "and", "or"];
      const int = ["-", "*", "**", "/", "//", "%", "++", "--", "~"];
      // const assign = ["-=", "*=", "**=", "/=", "//=", "%="];
      // const notBool = [...assign, "++", "--", "="];
      const literals = ["litInt", "litDec", "litStr", "litBool"];

      let dtype = null;
      let counter = 0;
      const deleteExpr = [];
      console.log(expression)
      while(dtype !== "empty" && !dataTypes.includes(dtype) && !literals.includes(expression[counter].token) && dtype !== undefined){
        
        dtype = expression[counter].token === "id"
          ? await dispatch("FIND_GROUP", {
              previous: expression[counter - 1],
              current: expression[counter],
              next: expression[counter + 1],
              expression: expression,
              index: counter
            })
          : null;
        counter++;
      }
      if(dtype === null) dtype = expression[counter].token === "litInt"
        ? "int"
        : expression[counter].token === "litDec"
          ? "dec"
          : expression[counter].token === "litStr"
            ? "str"
            : "bool";
      console.log(expression)
      await dispatch("EXPRESSION_EVALUATOR", {
        expectedDtype: dtype,
        expression: expression,
        evaluateArray: false,
        illegalWords: dtype === "int" || dtype === "dec"
          ? ["@"]
          : dtype === "str"
            ? [...bool, ...int]
            : [...bool, ...int, "@", "+"],
        illegalTokens: [],
        legalIds: dtype === "int" || dtype === "dec"
          ? ["int", "dec"]
          : dtype ? dtype : [],
      });
    }





    // async SEMANTICS({state, commit, dispatch}, tokenStream){
    //   let location = "global";
    //   const dataTypes = ["int", "dec", "str", "bool"];
    //   const beginKeywords = ["vote", "switch", "task", "for", "if", "elf", "else", "do"]
    //   const ids = [
    //     {
    //       lex: "begin"
    //     }
    //   ];
    //   const tasks = [];
    //   const structs = [];
    //   const elements = [];

    //   let index = 0;
    //   while(index < tokenStream.length){
    //     if (tokenStream[index].word === "struct") {
    //       const structIndex = structs.findIndex(struct => struct.lex === tokenStream[index + 1].lex);
    //       if (structIndex >= 0) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Duplicate declaration of struct (${tokenStream[index + 1].word})`,
    //         line: tokenStream[index + 1].line,
    //         col: tokenStream[index + 1].col,
    //         exp: "-",
    //       });
    //       structs.push(tokenStream[index + 1]);
    //       const struct = tokenStream[index + 1].word;
    //       index += 3;
    //       while (tokenStream[index].word !== "}") {
    //         while (!dataTypes.includes(tokenStream[index].word) && tokenStream[index].word !== "}") index++;
    //         if (dataTypes.includes(tokenStream[index].word)) {
    //           const dtype = tokenStream[index].word;
    //           index++;
    //           while (tokenStream[index].token === "id") {
    //             tokenStream[index].dtype = dtype;
    //             tokenStream[index].struct = struct;
    //             const elementIndex = elements.findIndex(
    //               element =>
    //                 element.lex === tokenStream[index].lex
    //                 && element.struct === tokenStream[index].struct
    //             );
    //             if (elementIndex >= 0) commit("SET_ERROR", {
    //               type: "sem-error",
    //               msg: `Duplicate declaration of element (${tokenStream[index].word})`,
    //               line: tokenStream[index].line,
    //               col: tokenStream[index].col,
    //               exp: "-",
    //             });
    //             elements.push(tokenStream[index]);
    //             if(tokenStream[index+1].word === "[") index = await dispatch("ARRAY_EVALUATOR", {
    //               index: index+2,
    //               tokenStream: tokenStream,
    //               ids: ids,
    //               tasks: tasks,
    //               structs: structs,
    //               elements: elements
    //             }) - 1;
    //             index += tokenStream[index + 1].word === ","
    //               ? 2
    //               : 1;
    //           }
    //         }
    //       }
    //       index++;
    //     }
    //     if(tokenStream[index].word === "task"){
    //       const taskType = tokenStream[index+1];

    //       let counter = index+3;
    //       let paramCounter = 0;
    //       tokenStream[index+2].parameters = [];
    //       while(
    //             dataTypes.includes(tokenStream[counter].word) 
    //         ||  tokenStream[counter].word !== ")" 
    //         ||  (tokenStream[counter].token === "id" && tokenStream[counter+1].token === "id")
    //       ){
    //         if(
    //               dataTypes.includes(tokenStream[counter].word) 
    //             ||(tokenStream[counter].token === "id" && tokenStream[counter+1].token === "id")
    //           ){
    //           const structIndex = structs.findIndex(struct => struct.lex === tokenStream[counter].lex);
    //           if (structIndex < 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Undeclared struct (${tokenStream[counter].word})`,
    //             line: tokenStream[counter].line,
    //             col: tokenStream[counter].col,
    //             exp: "-",
    //           });
    //           paramCounter++;
    //           tokenStream[index+2].parameters.push(tokenStream[counter].word);
    //         }
    //         counter++;
    //       }

    //       tokenStream[index+2].type = taskType.word;
    //       tokenStream[index+2].paramCount = paramCounter;
    //       const taskIndex = tasks.findIndex(task => task.lex === tokenStream[index+2].lex);
    //       if(taskIndex >= 0) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Duplicate declaration of task (${tokenStream[index+2].word})`,
    //         line: tokenStream[index+2].line,
    //         col: tokenStream[index+2].col,
    //         exp: "-",
    //       });
    //       tasks.push(tokenStream[index+2]);
    //       index = counter-1;

    //     }
    //     if(tokenStream[index].word !== "struct")
    //       index++;
    //   }

    //   index = 0;
    //   while(index < tokenStream.length){
    //     if(tokenStream[index].word === "struct"){
    //       index += 3;
    //       let curlyCounter = 1;
    //       while(curlyCounter > 0){
    //         if(tokenStream[index].word === "{") curlyCounter++;
    //         else if(tokenStream[index].word === "}") curlyCounter--;
    //         index++;
    //       }
    //     }

    //     if(tokenStream[index].word === "IN"){
    //       location = "main";
    //       ids.push(
    //         {
    //         lex: "end"
    //         },
    //         {
    //           lex: "begin"
    //         }
    //       );
    //     } else if(tokenStream[index].word === "OUT"){
    //       let deleteIndex = ids.length-1;
    //       while(ids[deleteIndex].lex !== "begin"){
    //         ids.pop();
    //         deleteIndex--;
    //       }
    //       ids.pop();
    //       location = "udf";
    //     }

    //     index = await dispatch("TYPE_AND_DECLARATION_CHECKER", 
    //       {
    //         index: index, 
    //         tokenStream: tokenStream, 
    //         dataTypes: dataTypes, 
    //         location: location,
    //         ids: ids,
    //         tasks: tasks,
    //         structs: structs,
    //         elements: elements
    //       }
    //     );

    //     if(beginKeywords.includes(tokenStream[index].word)) ids.push(
    //       {
    //         lex: "begin"
    //       }
    //     );
    //     if(tokenStream[index].word === "while"){
    //       index+=2;
    //       let parenCounter = 1;
    //       while(parenCounter > 0){
    //         if(tokenStream[index].word === "(") parenCounter++;
    //         if(tokenStream[index].word === ")") parenCounter--;
    //         index++;
    //       }
    //       if(tokenStream[index].word === "{") ids.push(
    //         {
    //           lex: "begin"
    //         }
    //       );
    //     }
    //     if(tokenStream[index].word === "task"){ 
    //       ids.push({
    //         lex: "begin"
    //       });
    //       const taskIndex = tasks.findIndex(task => task.lex === tokenStream[index+2].lex);
    //       const taskName = taskIndex !== "undefined"
    //         ? tasks[taskIndex]
    //         : taskIndex;
          
    //       let counter = index+=4;
    //       let parenCounter = 1;
    //       while(parenCounter > 0){
    //         if(tokenStream[counter].word === "(") parenCounter++;
    //         else if(tokenStream[counter].word === ")") parenCounter--;
    //         else if(
    //               dataTypes.includes(tokenStream[counter].word) 
    //           ||  (tokenStream[counter].token === "id" && tokenStream[counter+1].token === "id")
    //         ){
    //           tokenStream[counter+1].declared = tokenStream[counter+1].defined = true;
    //           tokenStream[counter+1].editable = true;
    //           tokenStream[counter+1].location = location;
    //           tokenStream[counter+1].dtype = tokenStream[counter].word;
    //           const idIndex = ids.findIndex(id => id.lex === tokenStream[counter+1].lex);
    //           if(idIndex >= 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Duplicate declaration of variable (${tokenStream[counter+1].word})`,
    //             line: tokenStream[counter+1].line,
    //             col: tokenStream[counter+1].col,
    //             exp: "-",
    //           });
    //           ids.push(tokenStream[counter+1]);
    //           counter+=2;
    //         } else counter++;
    //       }
    //       index = counter+2;
    //       let curlyCounter = 1;
    //       while(curlyCounter > 0){
    //         if(tokenStream[index].word === "{") curlyCounter++;
    //         if(tokenStream[index].word === "}") curlyCounter--;

    //         index = await dispatch("TYPE_AND_DECLARATION_CHECKER", 
    //             {
    //               index: index, 
    //               tokenStream: tokenStream, 
    //               dataTypes: dataTypes, 
    //               location: location,
    //               ids: ids,
    //               tasks: tasks,
    //               structs: structs,
    //               elements: elements
    //           }
    //         );

    //         if(tokenStream[index].word === "return"){
    //           if(taskName !== undefined && taskName.type === "empty"){
    //             commit("SET_ERROR", {
    //               type: "sem-error",
    //               msg: "empty task type cannot have a return",
    //               line: tokenStream[index].line,
    //               col: tokenStream[index].col,
    //               exp: "no return",
    //             });
    //           } else if(taskName === undefined){
    //             commit("SET_ERROR", {
    //               type: "programmer-error",
    //               msg: "unhandled error in Among C. Check logs.",
    //               line: tokenStream[index].line,
    //               col: tokenStream[index].col,
    //               exp: "-",
    //             });
    //           } else{
    //             index++;
    //             const {i, counter} = await dispatch("EXPRESSION_EVALUATOR", {
    //               expectedDType: taskName.type,
    //               index: index,
    //               tokenStream: tokenStream,
    //               ids: ids,
    //               tasks: tasks,
    //               structs: structs,
    //               elements: elements
    //             });
    //             index = i;
    //           }
    //         }
    //         index++;
    //       }
    //       index--;
    //     }
    //     if(tokenStream[index].word === "}" || tokenStream[index].word === "kill"){
    //       let deleteIndex = ids.length-1;
    //       while(ids[deleteIndex].lex !== "begin"){
    //         ids.pop();
    //         deleteIndex--;
    //       }
    //       ids.pop();
    //     }
    //     index++;
    //   }
    //   console.log("%cSemantic Errors: ", "color: cyan; font-size: 15px", state.error);
    // },
    // async TYPE_AND_DECLARATION_CHECKER({commit, dispatch}, payload){
    //   let {index, tokenStream, dataTypes, location, ids, tasks, structs, elements} = payload;
    //   const assignOper = ["=", "+=", "-=", "*=", "**=", "/=", "//=", "%="];
    //   const iterate = ["++", "--"]
    //   if(tokenStream[index].word === "vital"){
    //     let moreConst = true;
    //     const dtype = tokenStream[index+1]
    //     while(moreConst){
    //       if(tokenStream[index+2].word === "[") index--;
    //       tokenStream[index+2].declared = tokenStream[index+2].defined = true;
    //       tokenStream[index+2].editable = false;
    //       tokenStream[index+2].location = location;
    //       tokenStream[index+2].dtype = dtype.word;
    //       const idIndex = ids.findIndex(id => id.lex === tokenStream[index+2].lex);
    //       if(idIndex >= 0) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Duplicate declaration of variable (${tokenStream[index+2].word})`,
    //         line: tokenStream[index+2].line,
    //         col: tokenStream[index+2].col,
    //         exp: "-",
    //       });
    //       ids.push(tokenStream[index+2]);
    //       if(tokenStream[index+3].word === "["){
    //         index += 3;
    //         let curlyCounter = 1;
    //         while(tokenStream[index].word !== "{") index++;
    //         while(tokenStream[index].word !== ";" && curlyCounter > 0){
    //           if(tokenStream[index].word === "{") index++;
    //           else if(tokenStream[index].word !== ","){
    //             const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //             {
    //               expectedDType: dtype.word,
    //               index: index,
    //               tokenStream: tokenStream,
    //               ids: ids,
    //               tasks: tasks,
    //               structs: structs,
    //               elements: elements
    //             });
    //             index = i;
    //             curlyCounter = counter;
    //           }
    //           else index++;
    //         }
    //       }
    //       else{
    //         const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //         {
    //           expectedDType: dtype.word,
    //           index: index+4,
    //           tokenStream: tokenStream,
    //           ids: ids,
    //           tasks: tasks,
    //           structs: structs,
    //           elements: elements
    //         });
    //         index = i;
    //       }
    //       if(tokenStream[index].word === ";") moreConst = false;
    //     }
    //   } else if (dataTypes.includes(tokenStream[index].word) || (tokenStream[index].token === "id" && tokenStream[index+1].token === "id")){
    //     if(tokenStream[index].token === "id"){
    //       const structIndex = structs.findIndex(struct => struct.lex === tokenStream[index].lex);
    //       if (structIndex < 0) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Undeclared struct (${tokenStream[index].word})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: "-",
    //       });
    //     }
    //     let moreVar = true;
    //     let dtype = tokenStream[index]
    //     while(moreVar){
    //       if(tokenStream[index+1].word === "[") index--;
    //       tokenStream[index+1].declared = true;
    //       tokenStream[index+1].editable = true;
    //       tokenStream[index+1].location = location;
    //       tokenStream[index+1].dtype = dtype.word;
    //       const idIndex = ids.findIndex(id => id.lex === tokenStream[index+1].lex);
    //       if(idIndex >= 0) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Duplicate declaration of variable (${tokenStream[index+1].word})`,
    //         line: tokenStream[index+1].line,
    //         col: tokenStream[index+1].col,
    //         exp: "-",
    //       });
    //       ids.push(tokenStream[index+1]);

    //       if(tokenStream[index+2].word === "["){
    //         index = await dispatch("ARRAY_EVALUATOR", {
    //           index: index + 3,
    //           tokenStream: tokenStream,
    //           ids: ids,
    //           tasks: tasks,
    //           structs: structs,
    //           elements: elements
    //         }) - 1;
    //         //here
    //         let curlyCounter = 1;
    //         while(tokenStream[index].word !== "=" && tokenStream[index].word !== ";") index++;
    //         if(tokenStream[index].word !== ";")
    //           index++;
    //         while(tokenStream[index].word !== ";" && curlyCounter > 0){
    //           if(tokenStream[index].word === "{") index++;
    //           else if(tokenStream[index].word !== ","){
    //             const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //             {
    //               expectedDType: dtype.word,
    //               index: index,
    //               tokenStream: tokenStream,
    //               ids: ids,
    //               tasks: tasks,
    //               structs: structs,
    //               elements: elements
    //             });
    //             index = i;
    //             curlyCounter = counter;
    //           }
    //           else index++;
    //         }
    //       }
    //       else if(tokenStream[index+2].word === "="){
    //         tokenStream[index+1].defined = true;
    //         const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //         {
    //           expectedDType: dtype.word,
    //           index: index+3,
    //           tokenStream: tokenStream,
    //           ids: ids,
    //           tasks: tasks,
    //           structs: structs,
    //           elements: elements
    //         });
    //         index = i;
    //       } else index+=2;
    //       if(tokenStream[index].word === ";") moreVar = false;
          
    //     }
    //   } else if(tokenStream[index].token === "id"){
    //     const taskIndex = tasks.findIndex(task => task.lex === tokenStream[index].lex);
    //     const idIndex   = ids.findIndex(id => id.lex === tokenStream[index].lex);
    //     const undeclaredMsg = tokenStream[index+1].word === "("
    //       ? "task"
    //       : "variable"
    //     if(taskIndex < 0 && idIndex < 0){
    //       commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Undeclared ${undeclaredMsg} (${tokenStream[index].word})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: "-",
    //       });
    //       while(tokenStream[index].word !== ";" && tokenStream[index].word !== "{"){
    //         if(assignOper.includes(tokenStream[index].word)){
    //           const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //           {
    //             expectedDType: undefined,
    //             index: index+1,
    //             tokenStream: tokenStream,
    //             ids: ids,
    //             tasks: tasks,
    //             structs: structs,
    //             elements: elements
    //           });
    //           index = i;
    //         } else if(tokenStream[index].token === "id" && tokenStream[index-1].word === "."){
    //           let counter = index-1;
    //           while(tokenStream[counter].token !== "id") counter--;
    //           const idIndex = ids.findIndex(id => id.lex === tokenStream[counter].lex);
    //           if (idIndex < 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Variable (${tokenStream[counter].word}) is not a struct`,
    //             line: tokenStream[counter].line,
    //             col: tokenStream[counter].col,
    //             exp: `-`,
    //           });
    //           const elementIndex = elements.findIndex(element => element.lex === tokenStream[index].lex && ids[idIndex].dtype === element.struct);
    //           if(elementIndex < 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Undeclared element (${tokenStream[index].word})`,
    //             line: tokenStream[index].line,
    //             col: tokenStream[index].col,
    //             exp: "-",
    //           });
    //           index++;
    //         }
    //         else index++;
    //       }
    //     } else if(tokenStream[index+1].word !== "("){
    //       if(!ids[idIndex].editable && (assignOper.includes(tokenStream[index+1].word) || iterate.includes(tokenStream[index+1].word))) commit("SET_ERROR", {
    //         type: "sem-error", //+ - * ** / // %
    //         msg: `Illegal re-assignment of vital id (${ids[idIndex].word})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: "-",
    //       });
    //       while(tokenStream[index].word !== ";" && tokenStream[index].word !== "{"){
    //         let dtype;
    //         if(assignOper.includes(tokenStream[index].word)){
    //           if(!dataTypes.includes(ids[idIndex].dtype)){
    //             let counter = index-1;
    //             while(tokenStream[counter].token !== "id") counter--;
    //             const ind = elements.findIndex(element => 
    //               element.lex === tokenStream[counter].lex
    //               && element.struct === ids[idIndex].dtype
    //             );
    //             if(ind >= 0) dtype = elements[ind].dtype;
    //             else dtype = "undefined";
    //           }
    //           const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //           {
    //             expectedDType: dtype || ids[idIndex].dtype,
    //             index: index+1,
    //             tokenStream: tokenStream,
    //             ids: ids,
    //             tasks: tasks,
    //             structs: structs,
    //             elements: elements
    //           });
    //           index = i;
    //         } else if(tokenStream[index].token === "id" && tokenStream[index-1].word === "."){
    //           let counter = index-1;
    //           while(tokenStream[counter].token !== "id") counter--;
    //           const idIndex = ids.findIndex(id => id.lex === tokenStream[counter].lex);
    //           if (idIndex >= 0 && dataTypes.includes(ids[idIndex].dtype)) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Variable (${tokenStream[counter].word}) is not a struct`,
    //             line: tokenStream[counter].line,
    //             col: tokenStream[counter].col,
    //             exp: `-`,
    //           });
    //           const elementIndex = elements.findIndex(element => element.lex === tokenStream[index].lex && ids[idIndex].dtype === element.struct);
    //           if(elementIndex < 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Undeclared element (${tokenStream[index].word})`,
    //             line: tokenStream[index].line,
    //             col: tokenStream[index].col,
    //             exp: "-",
    //           });
    //           index++;
    //         }
    //         else index++;
    //       }
    //     } else if(tokenStream[index+1].word === "("){
    //       let counter = index += 1;
    //       let paramCounter = tokenStream[counter+1].word === ")"
    //         ? 0
    //         : 1;
    //       while(tokenStream[counter].word !== ";"){
    //         if(tokenStream[counter].word === ",") paramCounter++;
    //         counter++;
    //       }
    //       if(paramCounter !== tasks[taskIndex].paramCount) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Mismatched number of parameters (${paramCounter})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: `${tasks[taskIndex].paramCount} parameters`,
    //       });
    //       for(const paramDtype of tasks[taskIndex].parameters){
    //         const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //         {
    //           expectedDType: paramDtype,
    //           index: index,
    //           tokenStream: tokenStream,
    //           ids: ids,
    //           tasks: tasks,
    //           structs: structs,
    //           elements: elements
    //         });
    //         index = i;
    //       }
    //     }
    //   } else if(tokenStream[index].word === "shoot"){
    //     while(tokenStream[index].word !== ";"){
    //       let dtype;
    //       if(tokenStream[index].token === "id"){
    //         if(tokenStream[index+1].word === "("){
    //           const ind = tasks.findIndex(task => task.lex === tokenStream[index].lex);
    //           if(ind < 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Undeclared task (${tokenStream[index].word})`,
    //             line: tokenStream[index].line,
    //             col: tokenStream[index].col,
    //             exp: `-`,
    //           });
    //           else dtype = tasks[ind].type;
    //         } else {
    //           const ind = ids.findIndex(id => id.lex === tokenStream[index].lex);
    //           if(ind < 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Undeclared variable (${tokenStream[index].word})`,
    //             line: tokenStream[index].line,
    //             col: tokenStream[index].col,
    //             exp: `-`,
    //           });
    //           else{
    //             dtype = ids[ind].dtype;
    //             const struct = tokenStream[index];
    //             if(!dataTypes.includes(dtype)){
    //               const legal = ["[", "]"]
    //               while(
    //                 tokenStream[index].word !== "." 
    //                 && (legal.includes(tokenStream[index].word) || tokenStream[index].token === "litInt")
    //               ) index++;
    //               if (tokenStream[index].word === "."){
    //                 index++;
    //                 const elementIndex = elements.findIndex(element => element.lex === tokenStream[index].lex && dtype === element.struct)
    //                 if(elementIndex < 0) commit("SET_ERROR", {
    //                   type: "sem-error",
    //                   msg: `Undeclared element (${tokenStream[index].word})`,
    //                   line: tokenStream[index].line,
    //                   col: tokenStream[index].col,
    //                   exp: `-`,
    //                 });
    //                 dtype = elementIndex < 0
    //                   ? undefined
    //                   : elements[elementIndex].dtype;
    //               } else{
    //                 dtype = undefined;
    //                 commit("SET_ERROR", {
    //                   type: "sem-error",
    //                   msg: `Illegal access of object struct (${struct.word})`,
    //                   line: struct.line,
    //                   col: struct.col,
    //                   exp: `element access`,
    //                 });
    //               }
    //             }
    //           }
    //         }
    //       } else if(tokenStream[index].lex.includes("Lit")){
    //         dtype = tokenStream[index].lex.split("Lit")[0];
    //       }
    //       if(dtype){
    //         const {i, counter} = await dispatch("EXPRESSION_EVALUATOR",
    //         {
    //           expectedDType: dtype,
    //           index: index+1,
    //           tokenStream: tokenStream,
    //           ids: ids,
    //           tasks: tasks,
    //           structs: structs,
    //           elements: elements
    //         });
    //         index = i;
    //       } else index++;
    //     }
    //   }
    //   return index;
    // },
    // async EXPRESSION_EVALUATOR({commit}, payload){
    //   let {expectedDType, index, tokenStream, ids, tasks, structs, elements} = payload;
    //   const numberTokens = ["litInt", "negaLitInt", "litDec"];
    //   const legal = ["litInt", "negaLitInt", "litDec", "litBool", "litStr", "id"];
    //   const numberDTypes = ["int", "dec"];
    //   const numberCompareTokens = ["<", ">", "<=", ">="];
    //   const boolConnector = ["and", "or"];
    //   const dataTypes = ["int", "dec", "str", "bool"];

    //   let errorFound = false;
    //   let err;
    //   let curlyCounter = 1;
    //   let prevStruct = expectedDType;
    //   while(tokenStream[index].word !== ";" && tokenStream[index].word !== "," && curlyCounter > 0){
    //     errorFound = false;
    //     if(tokenStream[index].token === "id" && expectedDType !== undefined){
    //       let idIndex = tokenStream[index+1].word === "("
    //         ? tasks.findIndex(task => task.lex === tokenStream[index].lex)
    //         : ids.findIndex(id => id.lex === tokenStream[index].lex);

    //       if (idIndex < 0 && dataTypes.includes(prevStruct) && tokenStream[index - 1].word === "."){
    //         let counter = index-2;
    //         while(tokenStream[counter].token !== "id") counter--;
    //         commit("SET_ERROR", {
    //           type: "sem-error",
    //           msg: `Variable (${tokenStream[counter].word}) is not a struct`,
    //           line: tokenStream[counter].line,
    //           col: tokenStream[counter].col,
    //           exp: `-`,
    //         });
    //       }

    //       idIndex = idIndex < 0
    //         ? elements.findIndex(element => element.lex === tokenStream[index].lex && prevStruct === element.struct)
    //         : idIndex;
          
    //       let dtype = idIndex < 0
    //         ? null
    //         : tokenStream[index+1].word === "("
    //           ? tasks[idIndex].type
    //           : ids[idIndex].dtype;
          
    //       if (idIndex >= 0)
    //         dtype = dtype
    //           ? dtype
    //           : elements[idIndex].dtype

    //       prevStruct = dtype;

    //       if(
    //         ( !numberDTypes.includes(dtype) 
    //           || !numberDTypes.includes(expectedDType)
    //         ) 
    //         && dtype !== expectedDType 
    //         && expectedDType !== "bool"
    //         && dataTypes.includes(dtype)
    //         && idIndex >= 0
    //       ){
    //         errorFound = true;
    //         err = dtype
    //       }
    //     } else if (numberTokens.includes(tokenStream[index].token) && expectedDType !== undefined){
    //       if(!numberDTypes.includes(expectedDType) && expectedDType !== "bool")  errorFound = true;
    //     } else if (tokenStream[index].token === "litStr" && expectedDType !== undefined){
    //       if(expectedDType !== "str" && expectedDType !== "bool")  errorFound = true;
    //     } else if (tokenStream[index].token === "litBool" && expectedDType !== undefined){
    //       if(expectedDType !== "bool") errorFound = true;
    //     } else if(boolConnector.includes(tokenStream[index].word)){
    //       if(expectedDType !== "bool") commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Keyword (${tokenStream[index].word}) can only be used on bool data types`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: "-",
    //       });
    //     } else if(numberCompareTokens.includes(tokenStream[index].word)){
    //       if(expectedDType === "str") commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Symbol (${tokenStream[index].word}) can only be used on number and bool data types`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: "-",
    //       });
    //     }
    //     if(tokenStream[index].token === "id"){
    //       const idIndex = ids.findIndex(id => id.lex === tokenStream[index].lex);
    //       const taskIndex = tokenStream[index+1].word === "("
    //         ? tasks.findIndex(task => task.lex === tokenStream[index].lex)
    //         : -1;
    //       let elementIndex = -1;
    //       if(tokenStream[index-1].word === "."){
    //         let counter = index-2;
    //         while(tokenStream[counter].token !== "id") counter--;
    //         const structIndex = structs.findIndex(struct => struct.lex === tokenStream[counter].lex);
    //         if(structIndex >= 0) elementIndex = elements.findIndex(element => 
    //           element.lex === tokenStream[index].lex 
    //           && structs[structIndex].dtype === element.struct
    //         );
    //       }
    //       if (idIndex < 0 && taskIndex < 0 && elementIndex < 0) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Undeclared variable (${tokenStream[index].word})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: `-`,
    //       });
    //     }
    //     if ((errorFound || expectedDType === undefined) && legal.includes(tokenStream[index].token)) commit("SET_ERROR", {
    //       type: "sem-error",
    //       msg: `Mismatched data type (${expectedDType}) and value (${err ? err : tokenStream[index].word})`,
    //       line: tokenStream[index].line,
    //       col: tokenStream[index].col,
    //       exp: expectedDType === undefined
    //         ? "-"
    //         : `${expectedDType} value`,
    //     });
    //     index++; 
    //     if(tokenStream[index].word === "{"){
    //       curlyCounter++;
    //       index++;
    //     }
    //     else if(tokenStream[index].word === "}"){
    //       curlyCounter--;
    //       index++;
    //     }
    //   }
    //   return {
    //     i: index,
    //     counter: curlyCounter
    //   };
    // }, 
    // async ARRAY_EVALUATOR({ commit }, payload) {
    //   let {index, tokenStream, ids, tasks, structs, elements} = payload;
    //   let bracketCounter = 1;
    //   const dataTypes = ["int", "dec", "str", "bool"];
    //   while(bracketCounter > 0){
    //     if(tokenStream[index].word === "[") bracketCounter++;
    //     else if(tokenStream[index].word === "]") bracketCounter--;
    //     else if(tokenStream[index].token === "id"){
    //       const idIndex = ids.findIndex(id => id.lex === tokenStream[index].lex);
    //       const taskIndex = tokenStream[index+1].word === "("
    //         ? tasks.findIndex(task => task.lex === tokenStream[index].lex)
    //         : -1;
    //       let elementIndex;
    //       if (tokenStream[index-1].word === "."){
    //         let counter = index-2;
    //         while(tokenStream[counter].token !== "id") counter--;
    //         const ind = ids.findIndex(id => id.lex === tokenStream[counter].lex);
    //         if(ind >= 0){
    //           elementIndex = elements.findIndex(element => 
    //             element.lex === tokenStream[index].lex
    //             && ids[ind].dtype === element.struct
    //           )
    //           if (elementIndex < 0) commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Undeclared element (${tokenStream[index].word})`,
    //             line: tokenStream[index].line,
    //             col: tokenStream[index].col,
    //             exp: `-`,
    //           });
    //           else if (elements[elementIndex].dtype !== "int") commit("SET_ERROR", {
    //             type: "sem-error",
    //             msg: `Cannot access using variable with ${elements[elementIndex].dtype} value (${tokenStream[index].word})`,
    //             line: tokenStream[index].line,
    //             col: tokenStream[index].col,
    //             exp: `-`,
    //           });
    //         }
    //       }
    //       if (idIndex < 0 && taskIndex < 0 && elementIndex < 0) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Undeclared ${tokenStream[index + 1].word === "(" ? 'task' : 'variable'} (${tokenStream[index].word})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: `-`,
    //       });
    //       else if (idIndex >= 0 && ids[idIndex].dtype !== "int" && dataTypes.includes(ids[idIndex].dtype)) commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Cannot access using variable with ${ids[idIndex].dtype} value (${tokenStream[index].word})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: `-`,
    //       });
    //       else if (taskIndex >= 0 && ids[taskIndex].dtype !== "int") commit("SET_ERROR", {
    //         type: "sem-error",
    //         msg: `Cannot access using variable with ${tasks[taskIndex].type} task (${tokenStream[index].word})`,
    //         line: tokenStream[index].line,
    //         col: tokenStream[index].col,
    //         exp: `-`,
    //       });
    //     }
    //     index++;
    //   }
    //   return index;
    // },
  },
};