import { httpService } from './httpService'

export const ResultService = {
  async getResult(patientId, resultType) {
    const { data } = await httpService.get(
      `/result/patient/${patientId}/${resultType}`
    )
    return data
  },

  updateResult(patientId, resultEntity) {
    return httpService.put(`/result/patient/${patientId}`, resultEntity)
  },
}
