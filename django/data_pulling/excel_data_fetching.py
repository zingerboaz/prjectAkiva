from openpyxl import Workbook, load_workbook
from os import listdir

class InstitutionsExcelReader:

    def __init__(self, excel_file_path):
        self.work_book: Workbook = load_workbook(filename=excel_file_path)
        self.work_sheet = self.work_book.active

    def get_institutions_semel_list(self, from_cell: str = 'B2', to_cell: str = 'B55'):
        institutions_semels_list = []
        for cell in self.work_sheet[from_cell: to_cell]:
            institutions_semels_list.append(cell[0].value)

        return institutions_semels_list



def get_institutions_semel_list():
    # print(listdir())
    # print('file', __file__)
    InstitutionsExcelReader('data_pulling/BA_institutions_list.xlsx').get_institutions_semel_list()