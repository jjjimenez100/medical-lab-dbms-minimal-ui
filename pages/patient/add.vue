<template>
  <section class="section">
    <Loading
      :active.sync="isLoading"
      is-full-page
      lock-scroll
      color="#7957d5"
    ></Loading>
    <template v-for="patientProperty in getPatientProperties">
      <div :key="patientProperty" class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">{{ toCapitalCase(patientProperty) }}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                v-model="patient[patientProperty]"
                class="input"
                type="text"
              />
            </p>
          </div>
        </div>
      </div>
    </template>
    <div class="buttons navbar-end">
      <button class="button is-primary" @click="onSave">Save</button>
      <button class="button is-danger" @click="onCancel">Cancel</button>
    </div>
  </section>
</template>

<script>
import { capitalCase } from 'change-case'
import Loading from 'vue-loading-overlay'
import { PatientService } from '../../services/patient.service'

export default {
  name: 'Add',
  components: {
    Loading,
  },
  data: () => {
    return {
      patient: {
        patient_no: '',
        date_of_medical: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        age: '',
        sex: '',
        mobile_number: '',
        civil_status: '',
        address: '',
        occupation: '',
        company: '',
      },
      isLoading: false,
    }
  },
  computed: {
    getPatientProperties() {
      return Object.keys(this.patient)
    },
  },
  methods: {
    toCapitalCase(input) {
      return capitalCase(input)
    },
    async onSave() {
      this.isLoading = true
      await PatientService.addPatient(this.patient)
      this.isLoading = false
      this.$toast.success('Successfully added patient, redirecting...')
      setTimeout(() => this.$router.push('/'), 2000)
    },
    onCancel() {
      this.$router.push('/')
    },
  },
  fetchOnServer: false,
}
</script>

<style scoped></style>
