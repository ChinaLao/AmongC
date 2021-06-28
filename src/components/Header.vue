<template>
	<v-app-bar
		app
		absolute
		color="primary"
		dark
	>
		<v-row>
			<v-col cols="4" class="mr-13 mt-1">
				<v-btn outlined color="primary" @click="goto('Home')">
					<v-avatar class="mx-5" tile size="50">
						<v-img :src="require('@/assets/logo.png')"></v-img>
					</v-avatar>
					<span class="text-h4 font-weight-bold white--text">Among C</span>
				</v-btn>
			</v-col>
			<v-col cols="4" class="ml-16 mt-1">
				<span class="font-italic text-h4">dankpink.exe</span>
			</v-col>
			<v-col cols="1" class="ml-16 mt-1">
				<v-btn outlined color="primary" @click="goto('Documentation')">
					<span class="text-h5 text-lowercase white--text">Documentation</span>
				</v-btn>
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
