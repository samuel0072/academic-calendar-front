import { defineStore } from 'pinia'

export const useOrganizationInfoStore = defineStore({
    id: 'organizationInfo',
    state: () => ({
        campi: [ ],
        id: Number,
        name: String
    })
})