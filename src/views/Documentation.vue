<template>
	<v-app>
		<Header />
		<v-main>
			<iframe src='https://docs.google.com/document/d/1Y96vCP5-77jvFhs2KkKJKy8S77b1wkaraE7Ckium6i0/edit?usp=sharing' width='1366px' height='623px' frameborder='0'></iframe>
		</v-main>
		<v-footer></v-footer>
	</v-app>
</template>

<script>
	import Header from "@/components/Header.vue";
	export default {
		name: "Documentation",
		components: {
			Header,
		},
	};
</script>

<style>
iframe {
  background: url(../assets/loading.gif) center center no-repeat, url(../assets/loading-gif.gif) center center no-repeat;
	background-size: 100px, 200px;
}
</style>
