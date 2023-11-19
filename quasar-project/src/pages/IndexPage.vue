<template>
  <div class="q-pa-md" style="max-width: 400px">
    <h6>Customer Form</h6>

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="name"
        label="Your name *"
        hint="Name and surname"
        @blur="validateName"
        :error="nameError"
        error-message="Please type something"
      />

      <q-input
        filled
        type="number"
        v-model="age"
        label="Your age *"
        hint="Allow only number"
        @blur="validateAge"
        :error="ageError"
        error-message="Please type a real age between 1-80"
      />

      <div>
        <q-btn label="Add" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

    <br />

    <q-table
      title="Customer Details"
      :rows="customerData"
      :columns="columns"
      row-key="id"
    />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  setup() {
    const $q = useQuasar()

    const name = ref('')
    const age = ref('')
    const customerData = ref([]) // Pour stocker les détails des clients
    let nextCustomerId = 1 // Un compteur pour générer des ID uniques

    const columns = [
      { name: 'id', label: 'ID', align: 'center', field: 'id' },
      { name: 'name', label: 'Name', align: 'left', field: 'name' },
      { name: 'age', label: 'Age', align: 'right', field: 'age' },
    ]

    const nameError = ref(false)
    const ageError = ref(false)

    const validateName = () => {
      nameError.value = !name.value
    }

    const validateAge = () => {
      ageError.value = age.value === null || age.value === '' || age.value <= 1 || age.value >= 80
    }

    const onSubmit = () => {
      if (!nameError.value && !ageError.value) {
        // Ajouter un nouveau enregistrement client aux données
        customerData.value.push({
          id: nextCustomerId++,
          name: name.value,
          age: age.value,
        })

        // Effacer les champs d'entrée
        name.value = ''
        age.value = ''

        // Réinitialiser les états d'erreur
        nameError.value = false
        ageError.value = false
      }
    }

    const onReset = () => {
      // Effacer les champs d'entrée
      name.value = ''
      age.value = ''

      // Réinitialiser les états d'erreur
      nameError.value = false
      ageError.value = false
    }

    return {
      name,
      age,
      customerData,
      columns,
      onSubmit,
      onReset,
      validateName,
      validateAge,
      nameError,
      ageError,
    }
  },
}
</script>
