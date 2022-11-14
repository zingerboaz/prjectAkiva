export interface IConclusion {
    id: number,
    conclusion: string,
    note: string,
    type: 'SOCIAL' | 'EDUCATION' | 'STAFF' | 'STAFF_2',
    year: string,
    institution: number,
    title?: string
}

export interface IUpdateConclusion {
    institution_id: number,
    year_name: string,
    indice_type: 'SOCIAL' | 'EDUCATION' | 'STAFF' | 'STAFF_2',
    conclusion: {  
        id?: number,      
        content: string
    }
}
