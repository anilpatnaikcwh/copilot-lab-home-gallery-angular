import {Component, Input, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HousingLocation} from '../housinglocation';
import {RouterLink} from '@angular/router';
import {HousingService} from '../housing.service';

@Component({
  selector: 'app-housing-location',
  imports: [CommonModule, RouterLink],
  template: `
    <article class="listing">
      <div class="photo-wrap">
        <a class="photo-link" [routerLink]="['/details', housingLocation.id]">
          <img
            class="listing-photo"
            [src]="housingLocation.photo"
            alt="Exterior photo of {{ housingLocation.name }}"
          />
        </a>
        <span class="availability" [class.full]="housingLocation.availableUnits === 0">
          {{ housingLocation.availableUnits === 0 ? 'Currently full' : 'Accepting applications' }}
        </span>
        <button
          class="favorite-button"
          type="button"
          [class.is-favorite]="housingService.isFavorite(housingLocation.id)"
          [attr.aria-pressed]="housingService.isFavorite(housingLocation.id)"
          [attr.aria-label]="
            housingService.isFavorite(housingLocation.id)
              ? 'Remove ' + housingLocation.name + ' from saved homes'
              : 'Save ' + housingLocation.name
          "
          (click)="housingService.toggleFavorite(housingLocation.id)"
        >
          {{ housingService.isFavorite(housingLocation.id) ? '♥' : '♡' }}
        </button>
      </div>
      <div class="listing-body">
        <p class="listing-location">{{ housingLocation.city }}, {{ housingLocation.state }}</p>
        <h2 class="listing-heading">
          <a [routerLink]="['/details', housingLocation.id]">{{ housingLocation.name }}</a>
        </h2>
        <div class="listing-meta">
          <span><strong>{{ housingLocation.availableUnits }}</strong> {{ housingLocation.availableUnits === 1 ? 'home' : 'homes' }} available</span>
          <span class="amenities">
            <span *ngIf="housingLocation.wifi">Wi-Fi</span>
            <span *ngIf="housingLocation.laundry">Laundry</span>
          </span>
        </div>
        <a class="listing-link" [routerLink]="['/details', housingLocation.id]">
          View home <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `,
  styleUrls: ['./housing-location.component.css'],
})
export class HousingLocationComponent {
  @Input() housingLocation!: HousingLocation;
  readonly housingService = inject(HousingService);
}
