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
import { PatientService } from '../../../services/patient.service'

export default {
  name: 'Id',
  components: {
    Loading,
  },
  async asyncData({ params, error }) {
    const { id } = params
    const patient = await PatientService.getPatientById(id)
    return { patient }
  },
  data: () => {
    return {
      patient: {},
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
      await PatientService.updatePatient(this.patient)
      this.isLoading = false
      this.$toast.success('Successfully edited patient, redirecting...')
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
