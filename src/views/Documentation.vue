<template>
	<v-app>
		<Header />
		<v-main>
			<iframe src='https://docs.google.com/document/d/1inXdy0Ukz-_Vbiqkjyo22C-A7IL4meQQ/edit?usp=sharing&ouid=104522512141934682822&rtpof=true&sd=true' width='1349px' height='580px' frameborder='0'></iframe>
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
