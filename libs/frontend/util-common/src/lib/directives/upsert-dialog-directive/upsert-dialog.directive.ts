import { Directive, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { loadingFor } from '@ngneat/loadoff';

import { UpsertDialogData } from './upsert-dialog-data.interface';

export const LOADING_FOR_UPSERT = 'upsert';

@Directive()
export abstract class UpsertDialogComponent<
  Entity extends Record<string, unknown>,
> implements OnInit
{
  private toast = inject(HotToastService);
  loader = loadingFor(LOADING_FOR_UPSERT);
  ref: DialogRef<UpsertDialogData<Entity>> = inject(DialogRef);

  abstract get form(): FormGroup;

  abstract getMessages(): Record<UpsertDialogData<Entity>['action'], string>;

  get action() {
    return this.ref.data.action;
  }

  ngOnInit() {
    if (this.ref.data.action === 'edit') {
      if (this.ref.data.currentValue) {
        this.form.patchValue(this.ref.data.currentValue);
      } else {
        throw new Error(
          `Upsert action was set to 'edit' but no currentValue was provided!`,
        );
      }
    }
  }

  upsert(...args: unknown[]) {
    if (this.form.invalid) return;

    this.ref.data.actions$[this.action](this.form.getRawValue(), ...args)
      .pipe(this.loader.upsert.track())
      .subscribe(() => {
        this.ref.close();
        // TODO - work on styling for toasts
        this.toast.success(this.getMessages()[this.action], {
          position: 'bottom-right',
        });
      });
  }
}
