<template>
  <v-app>
    <Header />
    <v-main>
      <v-container>
        <v-row class="my-1">
          <v-col cols="6">
            <v-row>
              <h2 class="primary--text">Editor</h2>
              <v-btn
                plain
                fab
                small
                color="success darken-2"
                :loading="runClicked"
                :disabled="!code || code === ''"
                @click="run()"
              >
                <v-icon>play_arrow</v-icon>
              </v-btn>
              <v-btn
                plain
                fab
                small
                color="error lighten-2"
                :disabled="!runClicked"
                @click="stop()"
              >
                <v-icon>stop</v-icon>
              </v-btn>
              <v-btn
                plain
                fab
                small
                color="error lighten-2"
                :disabled="!code || code === '' || runClicked"
                @click="code = ''"
              >
                <v-icon>backspace</v-icon>
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="5" class="ml-2">
            <v-row>
              <h2>Lexeme Table</h2>
            </v-row>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="6">
            <v-row>
              <prism-editor
                class="my-editor pt-8"
                v-model="code"
                :highlight="highlighter"
                line-numbers
              ></prism-editor>
            </v-row>
          </v-col>
          <v-col cols="5" class="ml-2">
            <v-row>
              <v-data-table
                :headers="lexemeTableHeaders"
                :items="lexeme"
                :items-per-page="4"
                height="200"
                class="output elevation-1"
              ></v-data-table>
            </v-row>
            <v-row>
              <h2 class="error--text">Errors</h2>
              <v-data-table
                :headers="errorTableHeaders"
                :items="lexeme"
                :items-per-page="1"
                height="120"
                class="errorOutput elevation-1"
              ></v-data-table>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer class="center">Among C Compiler &copy; 2021</v-footer>
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
    error: [],
    runClicked: false,
    lexemeTableHeaders: [
      {
        text: "Lexeme",
        align: "start",
        sortable: false,
        value: "token",
      },
    ],
    errorTableHeaders: [
      {
        text: "Lexeme",
        align: "start",
        sortable: false,
        value: "token",
      },
    ],
  }),
  methods: {
    highlighter(code) {
      return highlight(code, languages.js);
    },
    run() {
      this.runClicked = true;
      this.$store.dispatch("lexical/GET_LEXEME", this.code);
      console.log(this.lexeme);
      this.runClicked = false;
    },
    stop() {
      this.runClicked = false;
    },
  },
  computed: {
    lexeme() {
      return this.$store.getters["lexical/LEXEME"];
    },
  },
};
</script>

<style>
.my-editor {
  background: #080728;
  color: #ffff;
  height: 72vh;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.output {
  border: 2px solid #080728;
  height: 40vh;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.errorOutput {
  border: 2px solid #080728;
  height: 27.5vh;
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.prism-editor__textarea:focus {
  outline: none;
}
</style>
