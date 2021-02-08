<template>
	<v-app-bar
		app
		absolute
		color="primary"
		dark
		class="text-h4 font-weight-bold"
	>
		<v-row>
			<v-avatar class="mx-5" tile size="50">
				<v-img
					:src="require('@/assets/logo.png')"
				></v-img>
			</v-avatar>
			<span class="mt-1">Among C</span>
		</v-row>
	</v-app-bar>
</template>

<script>
	export default {
		name: "Header",
	};
</script>

<style></style>
