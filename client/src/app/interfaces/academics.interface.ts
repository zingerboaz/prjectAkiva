export interface IAcademicsData {
    yearly_indice: 'EDUCATION',
    id: number;
    name: string;
    subjects: {
        id: number,
        name: string,
        values: {
            own: {
                year: string,
                value: number
            }[],
            average: {
                year: string,
                value: number
            }[],
            selected: {
                year: string,
                value: number
            }[]
        }
    }[]
    sections: {       
            own: {
                high: number,
                middle: number,
                special: number 
            },
            average: {
                high: number,
                middle: number,
                special: number
            },
            selected: {
                high: number,
                middle: number,
                special: number
            },       
    },
    value: {
        own: number,
        average: number
    },
    iconPath?: string

}


