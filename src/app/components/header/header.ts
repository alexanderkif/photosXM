import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsService } from '../../services/settings-service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly settings = inject(SettingsService);
}
