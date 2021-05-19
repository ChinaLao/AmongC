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
              <h2 class="white--text">Editor</h2>
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
            </v-row>
          </v-col>
          <!-- title of lexeme table -->
          <v-col class="ml-2">
            <v-row>
              <h2 class="white--text">Lexeme Table</h2>
            </v-row>
          </v-col>
        </v-row>

        <!-- inputs and outputs -->
        <v-row align="center">
          <v-col>
            <v-row>
              <prism-editor
                class="background my-editor pt-8"
                v-model="code"
                :highlight="highlighter"
                line-numbers
              ></prism-editor>
            </v-row>
            <v-row>
              <h2 class="success--text">Output</h2>
              <prism-editor
                class="background semOutput pt-8"
                v-model="semantics"
                :highlight="highlighter"
                readonly
              ></prism-editor>
            </v-row>
          </v-col>
          <v-col class="ml-2">
            <v-row>
              <v-data-table
                :headers="lexemeTableHeaders"
                :items="lexeme"
                :items-per-page="-1"
                height="270"
                class="background lexOutput elevation-1"
                dark
                hide-default-footer
                fixed-header
              ></v-data-table>
            </v-row>
            <v-row>
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
            </v-row>
          </v-col>
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
    semantics: null,
    runClicked: false,
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
      this.runClicked = true;
      this.clearOutput();
      this.semantics = "Checking Lexical...";
      await this.$store.dispatch("lexicalAnalyzer/LEXICAL", this.code);
      if(this.error.length <= 0){
        this.semantics += "\nNo Lexical Error";
        this.semantics += "\n\nChecking Syntax...";
        await this.$store.dispatch("lexicalAnalyzer/SYNTAX");
        if(this.error.length <= 0){
          this.semantics += "\nNo Syntax Error";
          // const output = JSON.stringify(this.$store.getters["lexicalAnalyzer/OUTPUT"], null, " ");
          // const statements = JSON.parse(output);
          // this.semantics += "\n\nAST:\n" + await this.$store.dispatch('lexicalAnalyzer/WRITE_JAVASCRIPT', statements);
        }else this.semantics += "\nSyntax Error Found";
      }
      else this.semantics += "\nLexical Error Found";
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
      this.semantics = null;
      this.$store.commit("lexicalAnalyzer/CLEAR_OUTPUTS");
    },
  },
  computed: {
    lexeme() {
      return this.$store.getters["lexicalAnalyzer/LEXEME"];
    },
    error() {
      return this.$store.getters["lexicalAnalyzer/ERROR"];
    },
  },
};
</script>

<style>
.my-editor {
  background: #080728;
  color: #ffff;
  height: 40vh;
  width: 100%;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.semOutput {
  background: #080728;
  color: #ffff;
  height: 27.5vh;
  width: 100%;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.lexOutput {
  border: 2px solid #080728;
  height: 40vh;
  width: 100%;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.errorOutput {
  border: 2px solid #080728;
  height: 27.5vh;
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
