<template>
	<v-app>
		<Header />
		<v-main>
			<v-container>
			</v-container>
		</v-main>
		<v-footer class="center">Among C Compiler &copy; 2021</v-footer>
	</v-app>
</template>

<script>
	import Header from "@/components/Header.vue";
	// @ is an alias to /src
	export default {
		name: "Home",
		components: {
			Header,
		},
		data: () => ({}),
		methods: {},
		computed: {},
	};
</script>
