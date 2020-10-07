<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer
        app
        dark
        floating
        persistent
        permanent
        :mini-variant="!$vuetify.breakpoint.mdAndUp"
      >
        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div v-if="$vuetify.breakpoint.mdAndUp" class="pa-2">
            <v-btn block @click="logout">Salir</v-btn>
          </div>
          <div v-else>
            <div icon outlined class="pa-2 text-center">
              <v-icon medium>exit_to_app</v-icon>
            </div>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "vehiculos",
  data() {
    return {
      items: [
        {
          title: "Vehiculos",
          // icon: "timeline",
          link: "/vehicles"
        },
        { title: "Usuarios", link: "/users" }
      ]
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.axios.defaults.headers.common.authorization = "";
      this.$router.push("/login");
    }
  },
  created() {}
};
</script>

<style lang="scss"></style>
