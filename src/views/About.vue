<template>
	<v-app>
		<Header />
		<v-main>
			This is about page and this is very waw
		</v-main>
		<v-footer></v-footer>
	</v-app>
</template>

<script>
	import Header from "@/components/Header.vue";
	export default {
		name: "About",
		components: {
			Header,
		},
	};
</script>

<style></style>
