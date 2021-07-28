<template>
  <section class="section">
    <Loading
      :active.sync="isLoading"
      is-full-page
      lock-scroll
      color="#7957d5"
    ></Loading>
    <input
      id="fileUpload"
      type="file"
      style="display: none"
      @change="onBatchImport"
    />
    <SystemMessage></SystemMessage>
    <div class="buttons table-action-buttons">
      <button class="button is-primary" @click="onBatchImportClick">
        Batch Import
      </button>
      <button class="button is-primary" @click="onAddNewPatient">
        Add New Patient
      </button>
      <b-tooltip label="Check some patients first" type="is-light">
        <button
          class="button is-link"
          :disabled="!hasSelectedPatient"
          @click="onGenerate"
        >
          Generate Results
        </button>
      </b-tooltip>

      <div class="navbar-end">
        <div class="select search-spacing">
          <select v-model="selectedSearchField">
            <option
              v-for="patientProperty in patientProperties"
              :key="patientProperty"
              :value="patientProperty"
            >
              {{ toCapitalCase(patientProperty) }}
            </option>
          </select>
        </div>
        <input
          v-model="search"
          class="input search-spacing"
          type="text"
          placeholder="Search text here..."
          style="width: 80%"
          @keyup.enter="onSearch"
        />
        <button
          class="button is-primary is-light is-outlined search-spacing"
          @click="onSearch"
        >
          Search
        </button>
        <button
          class="button is-danger is-light is-outlined search-spacing"
          @click="onReset"
        >
          Reset
        </button>
      </div>
    </div>
    <div style="overflow-x: auto">
      <table class="table is-bordered is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>
              <input type="checkbox" @click="selectAllPatients" />
            </th>
            <th v-for="header in headers" :key="header">{{ header }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(patient, index) in patients" :key="`patient-${index}`">
            <th>
              <input v-model="patient.selected" type="checkbox" />
            </th>
            <td
              v-for="(
                patientProperty, patientPropertiesIndex
              ) in patientProperties"
              :key="`${index}-${patient[patientProperty]}-${patientPropertiesIndex}`"
            >
              {{ (patient[patientProperty] || '').toUpperCase() }}
            </td>
            <td style="min-width: 380px">
              <b-dropdown
                aria-role="list"
                class="table-buttons-spacing"
                @change="
                  (selectedLabResult) =>
                    onLabResultSelection(selectedLabResult, patient)
                "
              >
                <template #trigger="{ active }">
                  <b-button
                    label="Lab"
                    type="is-info"
                    :icon-right="active ? 'menu-up' : 'menu-down'"
                  />
                </template>

                <b-dropdown-item :value="getAllInOne" aria-role="listitem"
                  >AIO</b-dropdown-item
                >
                <b-dropdown-item :value="getBloodChem" aria-role="listitem"
                  >Blood Chem</b-dropdown-item
                >
                <b-dropdown-item :value="getXray" aria-role="listitem"
                  >Xray</b-dropdown-item
                >
                <b-dropdown-item :value="getPhysicalExam" aria-role="listitem"
                  >Physical Exam</b-dropdown-item
                >
              </b-dropdown>
              <button
                class="button is-warning table-buttons-spacing"
                @click="navigateToEditPatientPage(patient)"
              >
                Edit
              </button>
              <button
                class="button is-danger table-buttons-spacing"
                @click="onDelete(patient)"
              >
                Delete
              </button>
              <b-dropdown aria-role="list" class="table-buttons-spacing">
                <template #trigger="{ active }">
                  <b-button
                    label="File"
                    type="is-warning is-light is-outlined"
                    :icon-right="active ? 'menu-up' : 'menu-down'"
                  />
                </template>

                <b-dropdown-item
                  :value="getAIOFileName"
                  aria-role="listitem"
                  @click="onOpenFile(getAIOFileName, patient)"
                  >AIO</b-dropdown-item
                >
                <b-dropdown-item
                  :value="getBloodChemFileName"
                  aria-role="listitem"
                  @click="onOpenFile(getBloodChemFileName, patient)"
                  >Blood Chem</b-dropdown-item
                >
                <b-dropdown-item
                  :value="getXRayFileName"
                  aria-role="listitem"
                  @click="onOpenFile(getXRayFileName, patient)"
                  >Xray</b-dropdown-item
                >
                <b-dropdown-item
                  :value="getPhysicalExamFileName"
                  aria-role="listitem"
                  @click="onOpenFile(getPhysicalExamFileName, patient)"
                  >Physical Exam</b-dropdown-item
                >
              </b-dropdown>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons navbar-end">
      <button
        class="button is-primary is-light is-outlined"
        :disabled="currentPage === 1"
        @click="getPreviousPage"
      >
        Previous Page
      </button>
      <button
        class="button is-primary is-light is-outlined"
        :disabled="currentPage === pageCount"
        @click="getNextPage"
      >
        Next Page ({{ getRemainingPages }} left)
      </button>
    </div>
  </section>
</template>

<script>
import { capitalCase } from 'change-case'
import Loading from 'vue-loading-overlay'
import { PatientService } from '../services/patient.service'
import { GenerateService } from '../services/generate.service'
import { BatchImportService } from '../services/batchImport.service'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
  AllInOne,
  BloodChemistry,
  Xray,
  PhysicalExamination,
} from '../constants/resultType'
import {
  AIO,
  BLOOD_CHEM,
  PHYSICAL_EXAM,
  XRAY,
} from '../constants/generatedFileNames'
import SystemMessage from './SystemMessage'

export default {
  name: 'PatientTable',
  components: {
    Loading,
    SystemMessage,
  },
  data: () => {
    const patientProperties = [
      'patient_no',
      'aio_lab_ref',
      'bloodchem_lab_ref',
      'date_of_medical',
      'last_name',
      'first_name',
      'middle_name',
      'age',
      'sex',
      'mobile_number',
      'civil_status',
      'address',
      'occupation',
      'company',
      'created_at',
    ]
    const headers = patientProperties.map((header) => capitalCase(header))
    return {
      patientProperties,
      headers,
      patients: [],
      pageCount: 0,
      limit: 5,
      isLoading: false,
      selectedAllPatients: false,
    }
  },
  computed: {
    search: {
      get() {
        return this.$store.state.table.search
      },
      set(value) {
        this.$store.commit('table/setSearch', value)
      },
    },
    selectedSearchField: {
      get() {
        return this.$store.state.table.selectedSearchField
      },
      set(value) {
        this.$store.commit('table/setSelectedSearchField', value)
      },
    },
    currentPage() {
      return this.$store.state.table.currentPage
    },
    getBloodChemFileName() {
      return BLOOD_CHEM
    },
    getPhysicalExamFileName() {
      return PHYSICAL_EXAM
    },
    getXRayFileName() {
      return XRAY
    },
    getAIOFileName() {
      return AIO
    },
    getAllInOne() {
      return AllInOne
    },
    getBloodChem() {
      return BloodChemistry
    },
    getPhysicalExam() {
      return PhysicalExamination
    },
    getXray() {
      return Xray
    },
    getRemainingPages() {
      const remainingPages = this.pageCount - this.currentPage
      if (remainingPages < 0) {
        return 0
      }
      return remainingPages
    },
    getIdOfSelectedPatients() {
      return this.getSelectedPatients.map(({ id }) => id)
    },
    getSelectedPatients() {
      return this.patients.filter((patient) => patient.selected)
    },
    hasSelectedPatient() {
      return this.patients.filter((patient) => patient.selected).length !== 0
    },
  },
  async created() {
    await this.getPatients(
      this.search,
      this.selectedSearchField,
      this.currentPage,
      this.limit
    )
  },
  methods: {
    navigateToEditPatientPage({ id }) {
      this.$router.push(`/patient/edit/${id}`)
    },
    selectAllPatients() {
      if (this.selectedAllPatients) {
        this.patients = this.patients.map((patient) => ({
          ...patient,
          selected: false,
        }))
      } else {
        this.patients = this.patients.map((patient) => ({
          ...patient,
          selected: true,
        }))
      }
      this.selectedAllPatients = !this.selectedAllPatients
    },
    toCapitalCase(input) {
      return capitalCase(input)
    },
    async getNextPage() {
      this.$store.commit('table/setCurrentPage', this.currentPage + 1)
      await this.getPatients(
        this.search,
        this.selectedSearchField,
        this.currentPage,
        this.limit
      )
    },
    async getPreviousPage() {
      this.$store.commit('table/setCurrentPage', this.currentPage - 1)
      await this.getPatients(
        this.search,
        this.selectedSearchField,
        this.currentPage,
        this.limit
      )
    },
    async getPatients(search, selectedSearchField, page, limit) {
      this.isLoading = true
      const { patients, totalNumberOfPages } = await PatientService.getPatients(
        search,
        selectedSearchField,
        page,
        limit
      )

      this.$store.commit('table/setCurrentPage', page)
      this.patients = patients
      this.pageCount = totalNumberOfPages
      this.isLoading = false
    },
    async generateResultsForSelectedPatients() {
      this.isLoading = true
      const selectedPatientIDs = this.getIdOfSelectedPatients
      await GenerateService.generateResults(selectedPatientIDs)
      this.isLoading = false
      this.$toast.success('Done with generating of results')
    },
    async onSearch() {
      if (!this.search) {
        await this.getPatients('', '', 1, this.limit)
        return
      }

      await this.getPatients(
        this.search,
        this.selectedSearchField,
        1,
        this.limit
      )
    },
    async onReset() {
      this.$store.commit('table/setCurrentPage', 1)
      this.search = ''
      await this.getPatients('', '', this.currentPage, this.limit)
    },
    async onBatchImport(event) {
      this.isLoading = true
      const file = event.target.files[0]
      await BatchImportService.batchImport(file)
      await this.onReset()
      this.isLoading = false
      this.$toast.success('Done with batch import')
    },
    async onGenerate() {
      if (this.getSelectedPatients.length === 0) {
        return
      }
      await this.generateResultsForSelectedPatients()
    },
    async onDelete({ id }) {
      this.isLoading = true
      await PatientService.deletePatients([id])
      await this.onReset()
      this.isLoading = false
      this.$toast.success('Successfully deleted patient')
    },
    onBatchImportClick() {
      document.getElementById('fileUpload').click()
    },
    onAddNewPatient() {
      this.$router.push('/patient/add')
    },
    onLabResultSelection(selectedLabResult, { id }) {
      this.$router.push(
        `/patient/lab-results/${id}/${selectedLabResult}/results`
      )
    },
    async onOpenFile(
      selectedLabResult,
      // eslint-disable-next-line camelcase
      { last_name, first_name, middle_name, company }
    ) {
      this.isLoading = true
      try {
        const body = {
          fileToOpen: selectedLabResult,
          last_name,
          first_name,
          company,
          middle_name,
        }
        await PatientService.openFolder(body)
      } catch (error) {
        this.$toast.error(
          'Lab result file does not exist. Generate the results first for this patient.',
          {
            duration: 2000,
          }
        )
      }
      this.isLoading = false
    },
  },
}
</script>

<style lang="css" scoped>
.search-spacing {
  margin-right: 10px;
}

.table-buttons-spacing {
  margin-right: 10px;
}
</style>
