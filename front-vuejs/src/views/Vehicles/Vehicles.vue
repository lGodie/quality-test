<template>
  <v-container>
    <v-toolbar-title>
      Cargar excel
      <form @submit.prevent="uploadExcel">
        <div class="form-group">
          <input type="file" @change="onFileUpload" />
        </div>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div class="form-group">
          <button
            style="background:#61b865; 
border-radius:4px; color:white"
          >
            Guardar Excel
          </button>
        </div>
      </form>
    </v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-data-table
      :headers="headers"
      :items="vehicles"
      sort-by="plaque"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>Vehiculos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Crear Vehiculo
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
                        maxlength="6"
                        counter
                        v-model="editedItem.plaque"
                        label="Placa"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.model"
                        type="number"
                        label="Modelo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.colour"
                        label="Color"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-img
                    lazy-src="https://cdn.pixabay.com/photo/2020/09/06/07/37/car-5548242_960_720.jpg"
                    max-height="150"
                    max-width="250"
                    src="https://cdn.pixabay.com/photo/2020/09/06/07/37/car-5548242_960_720.jpg"
                  ></v-img>
                  <form @submit.prevent="createVehicle">
                    <div class="form-group">
                      <input type="file" @change="onFileUpload" />
                    </div>
                  </form>
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
        <v-btn color="primary" @click="getVehicles">Refrescar</v-btn>
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
        { text: "Vehiculos", value: "plaque" },
        { text: "image", value: "src" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      vehicles: [],
      editedIndex: -1,
      editedItem: {
        id: "",
        plaque: "",
        model: "",
        imagePath: "",
        colour: ""
      },
      defaultItem: {
        id: "",
        colour: "",
        model: "",
        plaque: ""
      },
      show1: false,
      show2: false,
      newLoad: false,
      hideList: false,
      uploads: [],
      upload: { fileLoadDetails: [] },
      attachment: { name: "" },
      loading: false,
      overlay: false,
      excelData: null,
      FILE: null,
      name: ""
    };
  },
  async created() {
    await this.getVehicles();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo vehiculo" : "Editar vehiculo";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    excelData() {
      console.log(this.excelData);
    }
  },

  methods: {
    async createVehicle() {
      const formData = new FormData();
      formData.append("file", this.FILE, this.FILE.name);
      formData.append("plaque", this.editedItem.plaque);
      formData.append("model", this.editedItem.model);
      formData.append("colour", this.editedItem.colour);

      console.log(formData);
      await this.axios({
        method: "post",
        url: "/vehicles",
        data: formData
      });
      this.$toasted.success("Usuario creado correctamente");
      await this.getVehicles();
    },
    async updateVehicle() {
      const formData = new FormData();
      if (this.FILE.name != null) {
        formData.append("file", this.FILE, this.FILE.name);
      }
      formData.append("plaque", this.editedItem.plaque);
      formData.append("model", this.editedItem.model);
      formData.append("colour", this.editedItem.colour);
      formData.append("id", this.editedItem.id);
      console.log(formData);
      await this.axios({
        method: "post",
        url: "/vehicles/update",
        data: formData
      });
      this.$toasted.success("Vehiculo modificado exitosamente");
      await this.getVehicles();
    },
    async getVehicles() {
      let response = await this.axios({
        method: "get",
        url: "vehicles/?page=0&perPage=20"
      });
      this.vehicles = response.data[0];
    },
    editItem(item) {
      this.editedIndex = this.vehicles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      try {
        await this.axios({
          method: "delete",
          url: `/vehicles/${item.id}`
        });
        await this.getVehicles();
      } catch (error) {
        this.$toasted.error("Error al eliminar el vehiculo");
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
        this.updateVehicle();
      } else {
        this.createVehicle();
      }
      this.close();
    },
    onFileUpload(event) {
      this.FILE = event.target.files[0];
    },
    async uploadExcel() {
      // upload file
      const formData = new FormData();
      formData.append("file", this.FILE, this.FILE.name);
      formData.append("name", this.name);
      console.log(this.name);
      await this.axios
        .post("/vehicles/loadVehicles/", formData, {})
        .then(res => {
          console.log(res);
        });
      this.$toasted.success("Excel Cargado");
      await this.getVehicles();
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
