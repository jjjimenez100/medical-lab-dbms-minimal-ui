<template>
  <section class="section">
    <Loading
      :active.sync="isLoading"
      is-full-page
      lock-scroll
      color="#7957d5"
    ></Loading>
    <template v-for="aioProperty in Object.keys(aioProperties)">
      <div :key="aioProperty">
        <h1 class="title">{{ toCapitalCase(aioProperty) }}</h1>
        <h2 class="subtitle has-text-info">
          All fields are <b>optional</b>. Values inputted are
          <b>saved as it is</b>. No <b>formatting</b> is done. Please
          <b>double check your saved templates</b> for formatting issues.
        </h2>
        <div
          v-for="property in Object.keys(aioProperties[aioProperty])"
          v-if="property !== 'id' && property !== 'patient_id'"
          :key="`${aioProperty}-${property}`"
          class="field is-horizontal"
        >
          <div class="field-label is-normal">
            <label class="label">{{ toCapitalCase(property) }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input
                  v-model="aioProperties[aioProperty][property]"
                  class="input"
                  type="text"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <br />
    <div class="buttons navbar-end">
      <button class="button is-primary" @click="onSave">Save</button>
      <button class="button is-danger" @click="onCancel">Cancel</button>
    </div>
  </section>
</template>

<script>
import { capitalCase } from 'change-case'
import Loading from 'vue-loading-overlay'
import { ResultService } from '../../../../../services/results.service'
import { AllInOne } from '../../../../../constants/resultType'
import { GenerateService } from '../../../../../services/generate.service'

export default {
  name: 'Results',
  components: {
    Loading,
  },
  async asyncData({ params, error }) {
    const { id, type } = params
    const aioProperties = await ResultService.getResult(id, type)
    return { id, aioProperties, type }
  },
  data: () => {
    return {
      isLoading: false,
    }
  },
  methods: {
    toCapitalCase(input) {
      return capitalCase(input)
    },
    async onSave() {
      this.isLoading = true
      let resultType = this.type
      // dropdown values on PatientTable
      if (this.type === AllInOne) {
        resultType = AllInOne
      }

      let resultEntity = {
        patient_id: this.id,
        result_type: resultType,
      }

      if (resultType === AllInOne) {
        resultEntity = {
          ...resultEntity,
          aio: this.aioProperties.allInOne,
          cbc: this.aioProperties.completeBloodCount,
          fa: this.aioProperties.fecalysis,
          ua: this.aioProperties.urinalysis,
          serology: this.aioProperties.serology,
        }
      } else {
        resultEntity = {
          ...resultEntity,
          ...this.aioProperties,
        }
      }
      await ResultService.updateResult(this.id, resultEntity)
      await GenerateService.generateResults([this.id])
      this.isLoading = false
      this.$toast.success('Successfully edited patient results, redirecting...')
      setTimeout(() => this.$router.push('/'), 1000)
    },
    onCancel() {
      this.$router.push('/')
    },
  },
  fetchOnServer: false,
}
</script>

<style scoped></style>
