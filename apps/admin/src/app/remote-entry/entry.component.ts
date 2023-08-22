import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'nx-nestjs-angular-boilerplate-admin-entry',
  template: `<nx-nestjs-angular-boilerplate-nx-welcome></nx-nestjs-angular-boilerplate-nx-welcome>`,
})
export class RemoteEntryComponent {}
