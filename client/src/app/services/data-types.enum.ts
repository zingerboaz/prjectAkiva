export enum DataTypesEnum {
    SOCIAL = "SOCIAL",
    EDUCATION = "EDUCATION",
    PARTICIPATION = "PARTICIPATION",
    STAFF = "STAFF",
    INSTITUTION_DETAILS = "INSTITUTION_DETAILS",
    YEARLY_GOALS = "YEARLY_GOALS"
}

export const DATA_TYPE_ROUTES = new Map<DataTypesEnum, string>()
    .set(DataTypesEnum.EDUCATION, 'academics')
    .set(DataTypesEnum.SOCIAL, 'educational-data')
    .set(DataTypesEnum.PARTICIPATION, 'participation')
    .set(DataTypesEnum.STAFF, 'staff')
    .set(DataTypesEnum.INSTITUTION_DETAILS, 'general-info')
    .set(DataTypesEnum.YEARLY_GOALS, 'year-goals')
