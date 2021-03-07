import { httpService } from './httpService'

export const PatientService = {
  async getPatientById(id) {
    const response = await httpService.get(`/patients/${id}`)
    const { data } = response

    return data
  },
  async getPatients(
    search = '',
    selectedSearchField = '',
    page = 1,
    limit = 5
  ) {
    const response = await httpService.get(
      `/patients?page=${page}&limit=${limit}&search=${search}&field=${selectedSearchField}`
    )
    const { data } = response

    return data
  },

  addPatient(patient) {
    delete patient.id
    return httpService.put('/patient', patient)
  },

  updatePatient(patient) {
    return httpService.put('/patient', patient)
  },

  deletePatients(ids = []) {
    return httpService.delete('/patients', { data: { ids } })
  },
}
