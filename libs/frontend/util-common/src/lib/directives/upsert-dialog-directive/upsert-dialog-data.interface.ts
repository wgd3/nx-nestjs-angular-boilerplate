import { Observable } from 'rxjs';

export type UpsertDialogDataActionType = 'add' | 'edit';

export interface UpsertDialogData<T> {
  action: UpsertDialogDataActionType;
  actions$: Record<
    UpsertDialogDataActionType,
    (value: unknown, ...args: unknown[]) => Observable<T>
  >;
  currentValue: T | undefined;
  error: string | undefined;
}
