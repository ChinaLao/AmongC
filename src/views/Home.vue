<template>
	<v-app>
		<Header />
		<v-main>
			<v-container>
				<v-row class="my-1" align="center">
					<v-col cols="6">
						<v-row class="mb-1">
							<prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers></prism-editor>
						</v-row>
						<v-row>
							<prism-editor class="errorOutput" v-model="error" :highlight="highlighter" line-numbers readonly></prism-editor>
						</v-row>
					</v-col>
					<v-col class="ml-1">
						<v-row class="mb-1">
							<prism-editor class="output" v-model="lexical" :highlight="highlighter" line-numbers readonly></prism-editor>
						</v-row>
						<v-row>
							<prism-editor class="output" v-model="syntax" :highlight="highlighter" line-numbers readonly></prism-editor>
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
	import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css';
	import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-tomorrow.css';
	export default {
		name: "Home",
		components: {
			Header,
			PrismEditor
		},
		data: () => ({ 
			code: null,
		}),
    methods: {
      highlighter(code) {
        return highlight(code, languages.js);
      },
    },
  };
</script>

<style>
  .my-editor {
    background: #080728;
    color: #ffff;
		height: 55vh;
    font-family: Consolas;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }

	.output {
    border: 2px solid #080728;
		height: 37.5vh;
    font-family: Consolas;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }

	.errorOutput {
    border: 2px solid #080728;
		height: 20vh;
    font-family: Consolas;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }

  .prism-editor__textarea:focus {
    outline: none;
  }
</style>