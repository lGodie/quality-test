<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="users"
      sort-by="username"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>usuarios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Crear usuario
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.username"
                        label="Nombre de usuario"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        label="Contraseña"
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.confirmPassword"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        label="Confirmar contraseña"
                        @click:append="show2 = !show2"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getUsers">Refrescar</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>


<script>
// @ is an alias to /src

export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: "Username", value: "username" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        id: "",
        username: "",
        password: "",
        confirmPassword: ""
      },
      defaultItem: {
        id: "",
        username: "",
        password: "",
        confirmPassword: ""
      },
      show1: false,
      show2: false
    };
  },
  async created() {
    await this.getUsers();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo usuario" : "Editar usuario";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    async createUser() {
      if (this.editedItem.password === this.editedItem.confirmPassword) {
        const data = {
          username: this.editedItem.username,
          password: this.editedItem.password
        };
        await this.axios({
          method: "post",
          url: "/users",
          data: data
        });
        this.$toasted.success("Usuario creado correctamente");
        await this.getUsers();
      } else {
        this.$toasted.show("La contraseña no coincide");
      }
    },
    async updateUser() {
      let data = {};
      if (
        this.editedItem.username !== "" &&
        this.editedItem.username !== undefined &&
        this.editedItem.username !== null
      ) {
        data.username = this.editedItem.username;
        data.id = this.editedItem.id;
        if (
          this.editedItem.password !== "" &&
          this.editedItem.password !== undefined &&
          this.editedItem.password !== null
        ) {
          if (this.editedItem.password !== this.editedItem.confirmPassword) {
            this.$toasted.show("La contraseña no coincide");
            return;
          }
          data.password = this.editedItem.password;
        }
      } else {
        this.$toasted.show("El nombre de usuario no puede estar vacío");
      }
      await this.axios({
        method: "post",
        url: "/users/update",
        data: data
      });
      this.$toasted.success("Usuario creado correctamente");
      await this.getUsers();
    },
    async getUsers() {
      let response = await this.axios({
        method: "get",
        url: "/users"
      });
      this.users = response.data;
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      try {
        await this.axios({
          method: "delete",
          url: `/users/${item.id}`
        });
        await this.getUsers();
      } catch (error) {
        this.$toasted.error("Error al eliminar el usuario");
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        this.updateUser();
      } else {
        this.createUser();
      }
      this.close();
    }
  }
};
</script>
<style lang="css">
.colorLetterButton {
  color: white !important;
  background: black !important;
  margin-top: 11px;
}
</style>
