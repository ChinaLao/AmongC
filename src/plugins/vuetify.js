import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css";

const vuetify = new Vuetify({
	icons: {
		iconfont: "md" || "fa",
	},
	theme: {
		themes: {
			light: {
				primary: "#0E0D47",
				secondary: "#080728",
				success: "#3EBCE5",
				error: "#B80000",
			},
		},
	},
});

Vue.use(Vuetify);

export default vuetify;
