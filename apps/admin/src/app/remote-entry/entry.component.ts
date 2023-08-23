import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent, RouterModule],
  selector: 'nx-nestjs-angular-boilerplate-admin-entry',
  template: `<nx-nestjs-angular-boilerplate-nx-welcome></nx-nestjs-angular-boilerplate-nx-welcome>`,
})
export class RemoteEntryComponent {}
