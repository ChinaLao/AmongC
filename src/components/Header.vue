<template>
	<v-app-bar
		app
		absolute
		color="primary"
		dark
	>
		<v-row>
			<v-col class="mt-1" cols="10">
				<v-avatar class="mx-5 mt-n3" tile size="50">
					<v-img
						@click="goto('Home')"
						:src="require('@/assets/logo.png')"
					></v-img>
				</v-avatar>
				<span 
					class="mt-1 text-h4 font-weight-bold" 
					@click="goto('Home')"
				>Among C</span>
			</v-col>
			<v-col class="ml-15 mt-3" cols="1">
				<span 
					class="mt-3" 
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
