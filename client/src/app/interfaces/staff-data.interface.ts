export interface IStaffData {
    yearly_indice: 'STAFF',
    id: number,
    name: string,
    subjects: {
        id: number,
        name: string,
        values: {
            own: number,
            average: number,
            selected: number,
        }
        indice_group: number
    }[],
    sections: {
        own: {
            high: number,
            middle: number
        },
        avarage: {
            high: number,
            middle: number
        },
        selected: {
            high: number,
            middle: number
        },
    },
    value: {
        own: number,
        average: number
    },
    iconPath?: string
}
