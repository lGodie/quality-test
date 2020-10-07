import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "@/plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import Toasted from "vue-toasted";

import "vuetify/dist/vuetify.min.css";

//comienzo de la app
const token = localStorage.getItem("token");
if (token !== "" && token !== undefined && token !== null) {
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
}
axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        let response = error.response;
        if (response) {
            if (response.status === 401) {
                router.push("/login");
            }
        }
        return Promise.reject(error);
    }
);
Vue.use(VueAxios, axios);

Vue.use(Toasted, {
    duration: 3000,
    position: "bottom-left",
    action: {
        //text: "Ok", // siempre queda por defecto para todos los mensajes
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        },
    },
});

Vue.config.productionTip = false;

new Vue({
    components: { App },
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");