<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="grey lighten-4">
                <v-toolbar-title>Iniciar sesion</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="user"
                    @input="validationUser()"
                    label="Usuario"
                    name="login"
                    prepend-icon="mdi-account mdi-48px"
                    type="text"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    @input="validationPassword()"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock mdi-48px"
                    type="password"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn class="center_button" @click="login"
                  >Iniciar sesion</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      user: "",
      password: "",
      enbledButton: true
    };
  },

  methods: {
    async login() {
      // const data = { username: this.user, password: this.password };

      try {
        console.log("response");

        let response = await this.axios({
          method: "post",
          url: `/auth/login/?userName=${this.user}`
        });
        console.log(response);
        localStorage.setItem("token", response.data.access_token);
        this.axios.defaults.headers.common.authorization = `Bearer ${response.data.access_token}`;
        this.$router.push("/");
      } catch (error) {
        this.$toasted.error("Usuario invalido");
      }
    },

    validationUser() {
      if (this.user.length == 0) {
        this.$toasted.error("Usuario no valido");
      }
    },
    validationPassword() {
      if (this.password.length == 0) {
        this.$toasted.error("Contraseña incorrecta");
      }
    }
  }
};
</script>

<style lang="css">
.center_button {
  display: block;
  margin: auto;
  background: rgba(86, 87, 90, 0.788) !important;
  color: white !important;
}
</style>
