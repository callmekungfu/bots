export enum UserActions {
  LINK_PULL,
  UNLINK_PULL
}

export interface IUserAction {
  action: UserActions
}