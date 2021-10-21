export type Guard = {
  canActivate: () => boolean;
};
export type GuardFunc = () => Guard;
