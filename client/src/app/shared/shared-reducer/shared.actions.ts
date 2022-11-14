import {
  Action,
  ActionCreator
} from 'redux';



export const SAVE = '[Shared] update';
export interface SaveObjectAction extends Action {
  object: any;
  objType: string;
  meta: {[websocket: string]: boolean}
}
export const saveObject: ActionCreator<SaveObjectAction> =
  (object, objType) => ({
    type: SAVE,
    meta: {websocket: true},
    object: object,
    objType: objType 
  });

export const ADD_OBJECTS = '[Shared] Add Objects';
export interface AddObjectsAction extends Action {
  objects: any;
  objType: string;
  
}
export const ADD = '[Shared] add';
export interface AddObjectAction extends Action {
  object: any;
  objType: string;
  meta: {[websocket: string]: boolean}
}
export const addObject: ActionCreator<AddObjectAction> =
  (object, objType) => ({
    type: ADD,
    meta: {websocket: true},
    object: object,
    objType: objType 
  });

export const DELETE = '[Shared] delete';
export interface DeleteObjectAction extends Action {
  object: any;
  objType: string;
}
export const deleteObject: ActionCreator<DeleteObjectAction> =
  (object: any, objType: string) => ({
    type: DELETE,
    object: object,
    objType: objType,
    meta: {websocket: true}, 
  });

export const FEACH = '[Shared] Feach';

export interface FeachObjetsAction extends Action {
  objects: {[id: number]: any};
}
export const feachObjects: ActionCreator<FeachObjetsAction> =
  (objects: FeachObjetsAction) => ({
    type: FEACH,
    objects: objects
});

export const CHANGE_FEILD = '[Shared] Change_Feild';
export interface ChangeFeildAction extends Action {
  id: number;
  name: string;
  value: any;
}
export const changeFeild: ActionCreator<ChangeFeildAction> =
  (feildName: string, value: any, objType: string ,id: number) => ({
    type: CHANGE_FEILD,
    id: id,
    name: feildName,
    value: value,
    objType: objType,
    meta: {websocket: true}, 
  });



