from enum import Enum


class DATA_API_URL(Enum):
    EDUCATION_PIC = '1'
    INSTITUTION_DETAILS = '2'

REMOTE_API_URL = {
    DATA_API_URL.EDUCATION_PIC :'https://shkifut.education.gov.il/api/data/mosadEduPic',
    DATA_API_URL.INSTITUTION_DETAILS: 'https://shkifut.education.gov.il/api/data/mosad'
}