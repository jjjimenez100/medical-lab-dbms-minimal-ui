import { httpService } from './httpService'

const DEFAULT_GENERATED_RESULT_TYPES = [
  'allInOne',
  'bloodChemistry',
  'physicalExamination',
  'xray',
]
export const GenerateService = {
  generateResults(patientIds) {
    const generateRequests = patientIds.map((patientId) => {
      return {
        patient_id: patientId,
        result_types: DEFAULT_GENERATED_RESULT_TYPES,
      }
    })

    return httpService.post('/generate', { generateRequests })
  },
}
