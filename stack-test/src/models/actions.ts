export enum UserActions {
  LINK_PULL,
  UNLINK_PULL,
  UPDATE
}

export interface IUserAction {
  action: UserActions;
  query?: string;
}