<template>
	<v-app>
		<Header />
		<v-main>
			<v-container>
				<v-row class="mt-3" align="start" justify="center">
					<v-col cols="9" align="center">
						<v-text-field
							label="Name"
							placeholder="enter name..."
							outlined
							dense
							depressed
							rounded
							clearable
							color="green darken-4"
							v-model="entered_name"
							@keypress.enter="add_name"
						></v-text-field>
					</v-col>
					<v-col cols="2">
						<v-btn dark color="green darken-4" @click="add_name">
							Add Name
							<v-icon class="ml-1">add_circle_outline</v-icon>
						</v-btn>
					</v-col>
				</v-row>

				<v-row>
					<v-col wrap v-for="(name, index) in names" :key="index" cols="3">
						<v-card>
							<v-card-title>{{ index + 1 }}</v-card-title>
							<v-card-text class="text-h6">{{ name }}</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-row>
									<v-col cols="12" align="end">
										<v-btn
											dark
											icon
											color="red darken-2"
											@click="remove_name(name)"
										>
											<v-icon>delete</v-icon>
										</v-btn>
									</v-col>
								</v-row>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>

				<v-row class="mt-12">
					<v-col cols="12" align="center">
						<span class="text-h3 orange--text darken-2 font-weight-bold">{{
							selected_name
						}}</span>
					</v-col>
				</v-row>

				<v-row align="center" justify="center" class="mt-12">
					<v-col cols="6">
						<v-btn
							@click="generate_name"
							x-large
							rounded
							color="blue darken-4"
							depressed
							block
							dark
							>Generate Name
							<v-icon x-large class="ml-4">face</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
		<v-footer class="center">Random Name Generator &copy; 2021</v-footer>
	</v-app>
</template>

<style scoped>
	.selectedname {
		font-weight: bold;
		margin-top: 20px;
		margin-bottom: 20px;
		color: lightblue;
		font-size: 2.3em;
	}
	.name {
		margin-right: 10px;
		font-weight: 500;
	}
</style>

<script>
	import Header from "@/components/Header.vue";
	// @ is an alias to /src
	export default {
		name: "Home",
		components: {
			Header,
		},
		data: () => ({
			names: ["China", "Kendrell", "Miggy", "Sherwin", "Ully"],
			selected_name: null,
			entered_name: null,
		}),
		methods: {
			generate_name() {
				const min = 0;
				const max = this.names.length - 1;
				const generatedIndex =
					Math.floor(Math.random() * (max - min + 1)) + min;
				this.selected_name = this.names[generatedIndex];
			},
			add_name() {
				if (!this.entered_name) {
					return;
				}

				this.names.push(this.entered_name);
				this.entered_name = null;
			},
			remove_name(name) {
				const indexToDelete = this.names.findIndex((n) => n === name);
				if (indexToDelete > -1) {
					this.names.splice(indexToDelete, 1);
				}
			},
		},
		computed: {},
	};
</script>
