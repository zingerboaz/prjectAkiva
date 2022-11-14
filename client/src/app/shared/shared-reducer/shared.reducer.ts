import { Action } from 'redux';
import * as SharedActions from './shared.actions';

export const SharedReducer =
 function(state: any , action: Action): any {
      switch (action.type) {
        case SharedActions.ADD_OBJECTS:
             const objs  = (<SharedActions.AddObjectsAction>action).objects;
             return  Object.assign(state, objs);
        case SharedActions.SAVE:
            const c: any = (<SharedActions.SaveObjectAction>action).object;

            return  Object.assign(state, {[c.id]: c});
        case SharedActions.ADD:
            const addedObject: any = (<SharedActions.AddObjectAction>action).object;
            return  Object.assign(state, {[addedObject.id]: addedObject});
        case SharedActions.DELETE:
            const id: number = (<SharedActions.DeleteObjectAction>action).object.id;
            return  Object.keys(state).reduce((obj, key) => {
                 if (key !== id.toString()) {
                    return { ...obj, [key]: state[key] }
                 }
                return obj
             }, {})
        case SharedActions.FEACH:
            const objects: any = (<SharedActions.FeachObjetsAction>action).objects;
            return  objects;
        case SharedActions.CHANGE_FEILD:
              const name = (<SharedActions.ChangeFeildAction>action).name;
              const value =(<SharedActions.ChangeFeildAction>action).value;
              const objId =(<SharedActions.ChangeFeildAction>action).id;
              return Object.assign(state, {[objId]: Object.assign(state[objId], {[name]: value})})
        default:
            return state;
  }
};

