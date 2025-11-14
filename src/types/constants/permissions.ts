import { type Permission, ObjectType, ActionType } from "../role";

export const INITIAL_PERMISSIONS: Permission[] = [
  { id: 1, object: ObjectType.EMPLOYEE, action: ActionType.CREATE },
  { id: 2, object: ObjectType.EMPLOYEE, action: ActionType.READ },
  { id: 3, object: ObjectType.EMPLOYEE, action: ActionType.UPDATE },
  { id: 4, object: ObjectType.EMPLOYEE, action: ActionType.DELETE },
  { id: 5, object: ObjectType.EMPLOYEE, action: ActionType.DETAIL },
  { id: 6, object: ObjectType.PROJECT, action: ActionType.CREATE },
  { id: 7, object: ObjectType.PROJECT, action: ActionType.READ },
  { id: 8, object: ObjectType.PROJECT, action: ActionType.UPDATE },
  { id: 9, object: ObjectType.PROJECT, action: ActionType.DELETE },
  { id: 10, object: ObjectType.PROJECT, action: ActionType.DETAIL },
];
