<template>
	<v-app-bar
		app
		absolute
		color="primary"
		dark
		class="text-h4 font-weight-bold"
	>
		<v-row class="mt-n1">
			<v-col cols="5">
				<v-avatar class="mx-5 mt-n1" tile size="50">
					<v-img
						@click="goto('Home')"
						:src="require('@/assets/logo.png')"
					></v-img>
				</v-avatar>
				<span
					@click="goto('Home')"
				>Among C</span>
			</v-col>
			<v-col cols="4">
				<span class="font-italic">dankpink.exe</span>
			</v-col>
			<v-col class="ml-12" cols="1">
				<span
					@click="goto('Documentation')"
				>Documentation</span>
			</v-col>
		</v-row>
	</v-app-bar>
</template>

<script>
	export default {
		name: "Header",
		methods: {
			goto(val){
				this.$router.push({ name: val});
			}
		}
	};
</script>

<style></style>
