import { defineStore } from 'pinia'

export const useOrganizationInfoStore = defineStore({
    id: 'organizationInfo',
    state: () => ({
        campi: [ ],
        id: Number,
        name: String
    }),
    actions: {
        deleteCampus(campusId) {
            var index = this.campi.findIndex((campus) => campus.id === campusId)
            this.campi.splice(index, 1);
        },
        addCampus(campus) {
            this.campi.push(campus)
        }
    }
})