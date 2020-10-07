import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
        path: "/login",
        name: "Login",
        component: () =>
            import ("@/views/Login/Login.vue"),
    },
    {
        path: "/",
        component: () =>
            import ("@/views/Main.vue"),
        children: [{
                path: "/",
                redirect: "/vehicles",
                meta: { requiresAuth: true },
            },
            {
                path: "/vehicles",
                component: () =>
                    import ("@/views/Vehicles/Vehicles.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "/users",
                component: () =>
                    import ("@/views/Users/Users.vue"),
                meta: { requiresAuth: true },
            },
        ],
        meta: { requiresAuth: true },
    },
    {
        path: "*",
        component: () =>
            import ("@/views/404.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async(to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        let token = localStorage.getItem("token");

        if (token !== undefined && token !== "" && token !== null) {
            next();
        } else {
            next("/login");
        }
    } else {
        next();
    }
});

export default router;