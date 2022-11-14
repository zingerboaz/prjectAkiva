export interface IParticipationData {
    id: number,
    yearly_indice: 'PARTICIPATION'
    name: 'VISITED PARTICIPATION' | 'programs' | 'meetings',
    subjects: {
        id: number,
        indice_group: number
        name: string,       
        values: {
            own: number
        },
    }[]   
}

// export interface IParticipationDetails {
//     subjects: {
//         subject: string,
//         happened: boolean
//     }[],
//     context: 'program' | 'conference',
//     year: string,
//     institution: number
// }

// export interface IParticipationDetails2 {
//     id: number,
//     name: 'program' | 'conference',
//     subjects: {
//         name: string,
//         value: 0 | 1,
//     }[],
//     year: string,
//     institution: number
// }
