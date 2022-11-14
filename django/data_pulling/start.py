import os, sys
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(CURRENT_DIR))

from fetching import get_education_picture

get_education_picture('630095')


# def dpath_testing():
#     d = {'first': {
#         'second': [
#             {'third': 'hello'},
#             {'sixth': 'world'}
#         ]
#     }}
#     result1 = get(d, '/first/second[0]')
#     print(result1)


# dpath_testing()

#  paths
#  /Classes/Name - hativa
#  in Indexes :  /Year - year
#                /Name - group name
#                /Statements - subjects
# in Subjects : /Name - subject name
#               /Value - index value
#               /CompareValuesModel[1] - similar institutions
#
#
#
#
#
#
#
