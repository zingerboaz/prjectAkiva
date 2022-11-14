export interface IEducationalData {
    yearly_indice: 'SOCIAL',
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
        average: {
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
        average: number,
        special_average: number,
        special_own: number
    },
    iconPath?: string
}
