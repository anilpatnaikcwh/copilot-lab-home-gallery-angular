import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HousingService} from '../housing.service';
import {HousingLocation} from '../housinglocation';

@Component({
  selector: 'app-details',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <article *ngIf="housingLocation as location; else notFound">
      <img
        class="listing-photo"
        [src]="location.photo"
        [alt]="'Exterior photo of ' + location.name"
      />
      <section class="listing-description">
        <p class="eyebrow">A place to call yours</p>
        <h1 class="listing-heading">{{ location.name }}</h1>
        <p class="listing-location">{{ location.city }}, {{ location.state }}</p>
        <button
          class="detail-favorite"
          type="button"
          [class.is-favorite]="housingService.isFavorite(location.id)"
          [attr.aria-pressed]="housingService.isFavorite(location.id)"
          (click)="housingService.toggleFavorite(location.id)"
        >
          {{ housingService.isFavorite(location.id) ? '♥ Saved' : '♡ Save this home' }}
        </button>
      </section>
      <section class="listing-features">
        <div class="feature-card">
          <span class="feature-value">{{ location.availableUnits }}</span>
          <span class="feature-label">Homes available</span>
        </div>
        <div class="feature-card">
          <span class="feature-value">{{ location.wifi ? 'Included' : 'Unavailable' }}</span>
          <span class="feature-label">Wi-Fi</span>
        </div>
        <div class="feature-card">
          <span class="feature-value">{{ location.laundry ? 'Included' : 'Unavailable' }}</span>
          <span class="feature-label">Laundry</span>
        </div>
      </section>
      <section class="listing-apply" *ngIf="location.availableUnits > 0; else unavailable">
        <div class="apply-intro">
          <p class="eyebrow">Your next chapter starts here</p>
          <h2 class="section-heading">Interested in this home?</h2>
          <p>Leave your details and our team will be in touch.</p>
        </div>
        <form [formGroup]="applyForm" (ngSubmit)="submitApplication()">
          <label for="first-name">First name</label>
          <input id="first-name" type="text" formControlName="firstName" autocomplete="given-name" />
          <small class="field-error" *ngIf="applyForm.controls.firstName.touched && applyForm.controls.firstName.invalid">
            Please enter your first name.
          </small>
          <label for="last-name">Last name</label>
          <input id="last-name" type="text" formControlName="lastName" autocomplete="family-name" />
          <small class="field-error" *ngIf="applyForm.controls.lastName.touched && applyForm.controls.lastName.invalid">
            Please enter your last name.
          </small>
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" autocomplete="email" />
          <small class="field-error" *ngIf="applyForm.controls.email.touched && applyForm.controls.email.invalid">
            Enter a valid email address.
          </small>
          <button class="primary" type="submit">Request a viewing <span aria-hidden="true">→</span></button>
          <p class="success-message" role="status" *ngIf="applicationSubmitted">
            Thanks, {{ applicantName }}! Your request has been received.
          </p>
        </form>
      </section>
      <ng-template #unavailable>
        <section class="listing-apply unavailable-message">
          <h2 class="section-heading">This home is currently full</h2>
          <p>Save it to check back later, or explore other available homes.</p>
          <a [routerLink]="['/']">Browse available homes <span aria-hidden="true">→</span></a>
        </section>
      </ng-template>
    </article>
    <ng-template #notFound>
      <section class="not-found">
        <h1>Home not found</h1>
        <p>That housing location does not exist.</p>
        <a [routerLink]="['/']">Back to listings</a>
      </section>
    </ng-template>
  `,
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  private readonly route = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl('', {nonNullable: true, validators: Validators.required}),
    lastName: new FormControl('', {nonNullable: true, validators: Validators.required}),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  applicationSubmitted = false;
  applicantName = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.housingLocation = this.housingService.getHousingLocationById(id);
  }

  submitApplication() {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }

    const {firstName, lastName, email} = this.applyForm.getRawValue();
    this.housingService.submitApplication(
      firstName,
      lastName,
      email,
    );
    this.applicantName = firstName;
    this.applicationSubmitted = true;
    this.applyForm.reset();
  }
}