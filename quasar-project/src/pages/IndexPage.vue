<template>
  <div class="q-pa-md" style="max-width: 400px">
    <h6>Customer Form</h6>

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="name"
        label="Your name *"
        hint="Name and surname"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        filled
        type="number"
        v-model="age"
        label="Your age *"
        hint="Allow only number"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your age',
          val => val > 0 && val < 80 || 'Please type a real age between 0 and 80'
        ]"
      />
  
      <div>
        <q-btn label="Add" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
    
    <br>

    <q-table
      title="Customer Details"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script>

import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {

setup () {
  const $q = useQuasar()

  const name = ref(null)
  const age = ref(null)

  const columns = [
    { name:'ID', label: 'ID', align: 'center', field: 'id'},
    { name: 'name', label: 'Name', align: 'left', field: 'name'},
    { name: 'age', label: 'Age', align: 'right', field: 'age'},
  ] 

  return {
    name,
    age,
    columns,

    onSubmit () {
      name.value = null
      age.value = null

    },
    onReset () {
      name.value = null
      age.value = null
    }
  }
}
}
</script>