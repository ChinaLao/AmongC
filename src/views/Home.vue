<template>
  <v-app>
    <Header />
    <v-main class="bg" dark>
      <v-container>
        <!-- top -->
        <v-row class="my-1">
          <!-- buttons -->
          <v-col>
            <v-row>
              <h2 class="white--text ml-1">Editor</h2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    plain
                    fab
                    small
                    color="success darken-2"
                    :loading="runClicked"
                    :disabled="!code || code === ''"
                    @click="run()"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>play_arrow</v-icon>
                  </v-btn>
                </template>
                <span>Analyze Program</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    plain
                    fab
                    small
                    color="error"
                    :disabled="!runClicked"
                    @click="stop()"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>stop</v-icon>
                  </v-btn>
                </template>
                <span>Stop Analyzing</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    plain
                    fab
                    small
                    color="error"
                    :disabled="!code || code === '' || runClicked"
                    @click="clearCode()"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>backspace</v-icon>
                  </v-btn>
                </template>
                <span>Clear All</span>
              </v-tooltip>
              <v-chip class="ml-5 mt-2" small :color="lexicalOutput" v-show="lexical">
                <v-icon small class="mr-1" v-show="lexicalError">
                  clear
                </v-icon>
                <v-icon small class="mr-1" v-show="!lexicalError">
                  done
                </v-icon>
                Lexical
              </v-chip>
              <v-chip class="ml-5 mt-2" small :color="syntaxOutput" v-show="syntax">
                <v-icon small class="mr-1" v-show="syntaxError">
                  clear
                </v-icon>
                <v-icon small class="mr-1" v-show="!syntaxError">
                  done
                </v-icon>
                Syntax
              </v-chip>
              <v-chip class="ml-5 mt-2" small :color="semanticsOutput" v-show="semantics">
                <v-icon small class="mr-1" v-show="semanticsError">
                  clear
                </v-icon>
                <v-icon small class="mr-1" v-show="!semanticsError">
                  done
                </v-icon>
                Semantics
              </v-chip>
            </v-row>
          </v-col>
        </v-row>

        <!-- inputs and outputs -->
        <v-row align="center" class="mb-1">
          <v-row class="ml-1">
            <prism-editor
              class="background my-editor pt-8"
              v-model="code"
              :highlight="highlighter"
              line-numbers
            ></prism-editor>
          </v-row>
          <v-row>
            <v-col>
              <h2 class="white--text ml-1">Lexeme Table</h2>
              <v-data-table
                :headers="lexemeTableHeaders"
                :items="lexeme"
                :items-per-page="-1"
                height="180"
                class="background lexOutput elevation-1"
                dark
                hide-default-footer
                fixed-header
              ></v-data-table>
            </v-col>
            <v-col>
              <h2 class="error--text">Errors</h2>
              <v-data-table
                :headers="errorTableHeaders"
                :items="error"
                :items-per-page="-1"
                height="180"
                class="background errorOutput elevation-1"
                dark
                hide-default-footer
                fixed-header
              ></v-data-table>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-main>
    <v-footer class="primary center" dark>Among C Compiler &copy; 2021</v-footer>
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
export default {
  name: "Home",
  components: {
    Header,
    PrismEditor,
  },
  data: () => ({
    code: null,
    output: null,
    runClicked: false,
    lexicalError: null,
    syntaxError: null,
    semanticsError: null,
    lexemeTableHeaders: [
      {
        text: "Lexeme",
        align: "center",
        sortable: false,
        value: "word",
      },
      {
        text: "Token",
        align: "center",
        sortable: false,
        value: "lex",
      },
      {
        text: "Description",
        align: "center",
        sortable: false,
        value: "description",
      },
      {
        text: "Line",
        align: "center",
        sortable: false,
        value: "line",
      },
      {
        text: "Column",
        align: "center",
        sortable: false,
        value: "col"
      },
    ],
    errorTableHeaders: [
      {
        text: "Error Type",
        align: "center",
        sortable: false,
        value: "type",
      },
      {
        text: "Error Message",
        align: "center",
        sortable: false,
        value: "msg",
      },
      {
        text: "Expected",
        align: "center",
        sortable: false,
        value: "exp",
      },
      {
        text: "Line",
        align: "center",
        sortable: false,
        value: "line",
      },
      {
        text: "Column",
        align: "center",
        sortable: false,
        value: "col",
      }
    ],
  }),
  methods: {
    highlighter(code) {
      return highlight(code, languages.js);
    },
    async run() {
      console.clear();
      this.clearOutput();
      this.runClicked = true;

      this.output = "Checking Lexical...";
      const tokens = await this.$store.dispatch("lexical/ANALYZE", this.code); //gets tokenized with spaces
      if(this.error.length <= 0){ //if no lex-error
        this.lexicalError = false;
        this.output += "\nNo Lexical Error\n\nChecking Syntax...";
        await this.$store.dispatch("syntax/ANALYZE", tokens); //check syntax and pass the tokens with spaces

        if(this.error.length <= 0){ //if no syn-error
          this.syntaxError = false;
          this.output += "\nNo Syntax Error\n\nChecking Semantics...";
          await this.$store.dispatch("semantics/ANALYZE", tokens); 

          if(this.error.length <= 0){
            this.semanticsError = false;
            this.output += "\nNo Semantics Error"
          }
          else{
            this.output += "\nSemantics Error Found"
            this.semanticsError = true;
            console.log("%cSemantic Errors: ", "color: cyan; font-size: 15px", this.error);
          }

        }else{
          this.syntaxError = true;
          this.output += "\nSyntax Error Found";
          console.log("%Syntax Errors: ", "color: cyan; font-size: 15px", this.error);
        }
      }
      else{
        this.output += "\nLexical Error Found";
        this.lexicalError = true;
        console.log("%cLexical Errors: ", "color: cyan; font-size: 15px", this.error);
      }
      this.runClicked = false;
    },
    stop() {
      this.runClicked = false;
    },
    clearCode() {
      this.code = "";
      this.clearOutput();
    },
    clearOutput() {
      this.output = null;
      this.lexical = false;
      this.syntax = false;
      this.semantics = false;
      this.lexicalError = false;
      this.syntaxError = false;
      this.semanticsError = false;
      this.$store.commit("lexical/CLEAR");
      this.$store.commit("main/CLEAR");
      this.$store.commit("semantics/CLEAR");
    },
  },
  computed: {
    lexeme() {
      return this.$store.getters["lexical/LEXEME"];
    },
    error() {
      const error = this.$store.getters["main/ERROR"];
      error.sort((a, b) => a.col - b.col);
      error.sort((a, b) => a.line - b.line);
      return error;
    },
    lexical(){
      if(this.lexicalError !== null) return true;
      else return false;
    },
    syntax(){
      if(!this.lexicalError && this.syntaxError !== null) return true;
      else return false;
    },
    semantics(){
      if(!this.lexicalError && !this.syntaxError && this.semanticsError !== null) return true;
      else return false;
    },
    lexicalOutput(){
      if(this.lexicalError) return "error darken-2";
      else return "success darken-2"
    },
    syntaxOutput(){
      if(this.syntaxError) return "error darken-2";
      else return "success darken-2"
    },
    semanticsOutput(){
      if(this.semanticsError) return "error darken-2";
      else return "success darken-2"
    },
  },
};
</script>

<style>
.my-editor {
  background: #080728;
  color: #ffff;
  height: 40vh;
  width: 170vh;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.lexOutput {
  border: 2px solid #080728;
  height: 28vh;
  width: 100%;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.errorOutput {
  border: 2px solid #080728;
  height: 28vh;
  width: 100%;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.prism-editor__textarea:focus {
  outline: none;
}

.bg {
  background-image: url("../assets/background.gif");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
