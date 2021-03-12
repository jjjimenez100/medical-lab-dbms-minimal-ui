export const state = () => ({
  currentPage: 1,
  search: '',
  selectedSearchField: 'company',
})

export const mutations = {
  setCurrentPage(state, currentPage) {
    state.currentPage = currentPage
  },
  setSearch(state, search) {
    state.search = search
  },
  setSelectedSearchField(state, selectedSearchField) {
    state.selectedSearchField = selectedSearchField
  },
}
