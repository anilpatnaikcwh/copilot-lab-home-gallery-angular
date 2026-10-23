import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {HousingService} from './housing.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <main>
      <header class="site-header">
        <a class="brand-link" [routerLink]="['/']" aria-label="Home Gallery home">
          <img class="brand-logo" src="assets/logo.svg" alt="" />
          <span class="brand-copy">
            <span class="brand-kicker">A PLACE TO BELONG</span>
            <span class="brand-tagline">Find your next home</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a class="explore-link" [routerLink]="['/']" fragment="homes">Explore homes</a>
          <a
            class="saved-link"
            [routerLink]="['/']"
            fragment="homes"
            (click)="housingService.showFavorites.set(true)"
          >
            <span class="heart-icon" aria-hidden="true">♡</span>
            Saved
            <span class="saved-count">{{ housingService.favoriteIds().length }}</span>
          </a>
        </nav>
      </header>
      <section class="content" id="main-content">
        <router-outlet></router-outlet>
      </section>
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-bottom">
            <span>© {{ currentYear }} Home Gallery</span>
          </div>
        </div>
      </footer>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly housingService = inject(HousingService);
  readonly currentYear = new Date().getFullYear();
}
