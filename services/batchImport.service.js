import { httpService } from './httpService'

export const BatchImportService = {
  batchImport(file) {
    const formData = new FormData()
    formData.append('batchImportExcel', file)
    return httpService.post(`/batch-import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
