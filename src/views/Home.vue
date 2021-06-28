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
              <v-chip class="ml-5 mt-2" small :color="lexicalOutput" v-show="lexicalError !== null">
                <v-icon small class="mr-1">
                  {{ lexicalError ? 'clear' : 'done' }}
                </v-icon>
                Lexical
              </v-chip>
              <v-chip class="ml-5 mt-2" small :color="syntaxOutput" v-show="syntaxError !== null">
                <v-icon small class="mr-1">
                  {{ syntaxError ? 'clear' : 'done' }}
                </v-icon>
                Syntax
              </v-chip>
              <v-chip class="ml-5 mt-2" small :color="semanticsOutput" v-show="semanticsError !== null">
                <v-icon small class="mr-1">
                  {{ semanticsError ? 'clear' : 'done' }}
                </v-icon>
                Semantics
              </v-chip>
            </v-row>
          </v-col>
        </v-row>

        <!-- inputs and outputs -->
        <v-row align="center" class="mb-1">
          <v-row class="ml-1">
            <codemirror
              @cursorActivity="highlight"
              ref="codeEditor"
              v-model="code"
              :options="cmOptions"
            />
          </v-row>
          <v-row>
            <v-col>
              <h2 class="success--text ml-1">Lexeme Table</h2>
              <v-data-table
                :headers="lexemeTableHeaders"
                :items="lexeme"
                :items-per-page="-1"
                height="180"
                class="#1C1C1C lexOutput elevation-1"
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
                class="#1C1C1C errorOutput elevation-1"
                dark
                hide-default-footer
                fixed-header
              ></v-data-table>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-main>
    <v-footer class="primary justify-center" dark>
      <span class="mr-10"> Among C Compiler &copy; 2021 </span>
      <span class="ml-16"> China Marie Lao </span>
      <span class="ml-5"> | </span>
      <span class="ml-5"> Clarissa Faye Gamboa </span>
      <span class="ml-5"> | </span>
      <span class="ml-5"> Celeste June Panganiban </span>
      <span class="ml-5"> | </span>
      <span class="ml-5 mr-10"> Kendrell Derek Acibar </span>
      <span class="ml-16"> Moo.js </span>
      <span class="ml-5"> | </span>
      <span class="ml-5"> Nearley </span>
    </v-footer>
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";

import { codemirror, CodeMirror } from 'vue-codemirror';

require("codemirror/addon/mode/simple.js");

import "codemirror/lib/codemirror.css";
import "codemirror/theme/yonce.css";
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/scroll/simplescrollbars.css";

import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/lint/lint";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/display/fullscreen";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/search";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/comment/comment";

CodeMirror.defineSimpleMode("amongc", {
  start: [
    { regex: /"(?:[^"\\]|\\.)*"/, token: "string" },
    { regex: /[~]?[0-9]{1,9}([.][0-9]{1,5})?/, token: "number" },
    { regex: /(?:true|false)\b/, token: "number" },
    {
      regex: /(?:IN|OUT|struct|shoot|scan|if|elf|else|switch|vote|default|for|while|do|kill|return|and|or|vital|task|clean)\b/,
      token: "keyword"
    },
    { regex: /(?:int|dec|str|bool|empty)\b/, token: "atom" },
    { regex: /[-+/*%=<>!@]+/, token: "tag" },
    { regex: /[a-z][a-z0-9A-Z]{1,14}/, token: "variable" },
    { regex: /#.*/, token: "comment "},

  ],
  comment: [
    { regex: /#.*/, token: "comment"}
  ],
  meta: { dontIndentStates: ["comment"], lineComment: "#"}
})


export default {
  name: "Home",
  components: {
    Header,
    codemirror
  },
  data() {
    const self = this;
    return{
      cmOptions: {
        tabSize: 2,
        theme: "yonce",
        mode: "amongc",
        lineNumbers: true,
        line: true,
        autofocus: true,
        lineWiseCopyCut: true,
        autoCloseBrackets: {
          pairs: '(){}[]""',
          explode: "[]{}()"
        },
        matchBrackets: true,
        styleActiveLine: true,
        scrollbarStyle: "overlay",
        lint: true,
        dragDrop: false,
        extraKeys: {
          "Ctrl-Enter": () => self.run(),
          "Ctrl-/": (cm) => cm.execCommand("toggleComment"),
          Tab: (cm) => cm.replaceSelection("  ", "end")
        }
      },
      cmCursorPos: {
        line: 1,
        ch: 0
      },
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
    }
  },
  methods: {
    highlight(cursor) {
      const { ch, line } = cursor.getCursor();
      this.cmCursorPos = Object.assign({}, this.cmCursorPos, {
        ch,
        line: line + 1
      });
    },
    async run() {
      if(this.code === null || this.code === "") return;
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
      this.lexicalError = null;
      this.syntaxError = null;
      this.semanticsError = null;
      this.$store.commit("lexical/CLEAR");
      this.$store.commit("main/CLEAR");
      this.$store.commit("semantics/CLEAR");
    },
  },
  watch: {

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
.CodeMirror {
  background: #2c2c2c;
  color: #ffff;
  height: 38vh;
  width: 178vh;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.lexOutput {
  border: 2px solid #1C1C1C;
  height: 28vh;
  width: 100%;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.errorOutput {
  border: 2px solid #1C1C1C;
  height: 28vh;
  width: 100%;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.bg {
  background-image: url("../assets/background.gif");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
