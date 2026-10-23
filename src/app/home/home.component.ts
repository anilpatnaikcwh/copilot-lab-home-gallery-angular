import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import * as L from 'leaflet';
import {HousingLocationComponent} from '../housing-location/housing-location.component';
import {HousingLocation} from '../housinglocation';
import {HousingService} from '../housing.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section class="search-bar">
      <div class="search-heading">
        <p class="eyebrow">Home Gallery</p>
        <h1>Find a place to call home</h1>
      </div>
      <form
        class="search-form"
        role="search"
        (submit)="$event.preventDefault(); filterResults(search.value)"
      >
        <label class="visually-hidden" for="home-search">Search by home or location</label>
        <span class="search-icon" aria-hidden="true">⌕</span>
        <input
          id="home-search"
          type="search"
          placeholder="Suburb, city, or property name"
          [value]="searchTerm"
          (input)="filterResults(search.value)"
          #search
        />
        <button class="primary" type="submit">Search</button>
      </form>
    </section>
    <nav class="view-tabs" role="tablist" aria-label="Search result view">
      <button
        type="button"
        role="tab"
        id="listings-tab"
        aria-controls="homes-panel"
        [attr.aria-selected]="viewMode === 'listings'"
        [class.active]="viewMode === 'listings'"
        (click)="viewMode = 'listings'"
      >
        Listings
      </button>
      <button
        type="button"
        role="tab"
        id="map-tab"
        aria-controls="map-panel"
        [attr.aria-selected]="viewMode === 'map'"
        [class.active]="viewMode === 'map'"
        (click)="viewMode = 'map'"
      >
        Map
      </button>
    </nav>
    <section
      class="search-layout"
      id="homes"
      [class.listings-view]="viewMode === 'listings'"
      [class.map-view]="viewMode === 'map'"
    >
      <section
        class="results-panel"
        id="homes-panel"
        role="tabpanel"
        aria-labelledby="listings-tab"
        aria-label="Home search results"
        *ngIf="viewMode === 'listings'"
      >
        <div class="results-toolbar">
          <div>
            <h2>Explore homes</h2>
            <p class="results-count">
              {{ filteredLocationList.length }}
              {{ filteredLocationList.length === 1 ? 'home' : 'homes' }}
              <span *ngIf="showFavorites()">saved by you</span>
              <span *ngIf="!showFavorites()">to explore</span>
            </p>
          </div>
          <div class="listing-controls">
            <button
              class="filter-button"
              type="button"
              [class.active]="showFavorites()"
              [attr.aria-pressed]="showFavorites()"
              (click)="toggleFavorites()"
            >
              <span aria-hidden="true">♥</span>
              {{ showFavorites() ? 'All homes' : 'Saved' }}
            </button>
            <label class="sort-control">
              <span>Sort</span>
              <select #sort (change)="setSortOrder(sort.value)">
                <option value="recommended">Recommended</option>
                <option value="name">Name</option>
                <option value="availability">Most available</option>
              </select>
            </label>
          </div>
        </div>

        <section class="results" aria-label="Housing listings">
          <app-housing-location
            class="map-result-card"
            *ngFor="let housingLocation of filteredLocationList"
            [housingLocation]="housingLocation"
          ></app-housing-location>
        </section>

        <div class="empty-state" *ngIf="filteredLocationList.length === 0">
          <span class="empty-icon" aria-hidden="true">⌂</span>
          <h3>{{ showFavorites() ? 'No saved homes yet' : 'No homes found' }}</h3>
          <p>
            {{
              showFavorites()
                ? 'Tap the heart on a home to keep it close.'
                : 'Try another search, or clear the search field to see every home.'
            }}
          </p>
          <button
            class="text-button"
            type="button"
            *ngIf="searchTerm || showFavorites()"
            (click)="searchTerm = ''; showFavorites.set(false)"
          >
            Show all homes
          </button>
        </div>
      </section>

      <section
        class="map-panel"
        id="map-panel"
        role="tabpanel"
        aria-labelledby="map-tab"
        aria-label="Homes on map"
        *ngIf="viewMode === 'map'"
      >
        <div class="map-heading">
          <div>
            <p class="eyebrow">Browse by location</p>
            <h2>Homes across the United States</h2>
          </div>
          <span class="map-total">{{ filteredLocationList.length }} homes</span>
        </div>
        <div #mapContainer class="leaflet-map" aria-label="Map with home listings grouped by city"></div>
        <p class="map-caption">Markers show the number of matching homes in each city. Locations are approximate.</p>
      </section>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  readonly housingService = inject(HousingService);
  readonly housingLocationList: HousingLocation[] =
    this.housingService.getAllHousingLocations();
  readonly showFavorites = this.housingService.showFavorites;
  private readonly router = inject(Router);
  searchTerm = '';
  viewMode: 'listings' | 'map' = 'listings';
  sortBy: 'recommended' | 'name' | 'availability' = 'recommended';

  private map?: L.Map;
  private markerLayer?: L.LayerGroup;

  private readonly cityCoordinates: Record<string, L.LatLngTuple> = {
    'Portland, OR': [45.5152, -122.6784],
    'Oakland, CA': [37.8044, -122.2712],
    'Santa Monica, CA': [34.0195, -118.4912],
    'Juneau, AK': [58.3019, -134.4197],
    'Chicago, IL': [41.8781, -87.6298],
    'Gary, IN': [41.5934, -87.3464],
    'Austin, TX': [30.2672, -97.7431],
    'Boulder, CO': [40.015, -105.2705],
    'Nashville, TN': [36.1627, -86.7816],
    'Madison, WI': [43.0748, -89.3844],
    'Minneapolis, MN': [44.9778, -93.265],
    'Raleigh, NC': [35.7796, -78.6382],
  };

  @ViewChild('mapContainer')
  set mapContainer(element: ElementRef<HTMLDivElement> | undefined) {
    if (!element) {
      this.destroyMap();
      return;
    }
    this.initializeMap(element.nativeElement);
  }

  get filteredLocationList(): HousingLocation[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    const filtered = this.housingLocationList.filter((location) => {
      const matchesSearch = [location.name, location.city, location.state]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query);
      return matchesSearch &&
        (!this.showFavorites() || this.housingService.isFavorite(location.id));
    });

    if (this.sortBy === 'name') {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (this.sortBy === 'availability') {
      return filtered.sort((a, b) => b.availableUnits - a.availableUnits);
    }
    return filtered;
  }

  filterResults(text: string): void {
    this.searchTerm = text;
    this.updateMapMarkers();
  }

  setSortOrder(value: string): void {
    if (value === 'name' || value === 'availability' || value === 'recommended') {
      this.sortBy = value;
      this.updateMapMarkers();
    }
  }

  toggleFavorites(): void {
    this.showFavorites.update((showFavorites) => !showFavorites);
    this.updateMapMarkers();
  }

  private initializeMap(container: HTMLDivElement): void {
    this.destroyMap();
    this.map = L.map(container, {scrollWheelZoom: false}).setView([39, -98], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    if (!this.map || !this.markerLayer) return;

    this.markerLayer.clearLayers();
    const groupedLocations = new Map<string, HousingLocation[]>();
    for (const location of this.filteredLocationList) {
      const cityKey = `${location.city}, ${location.state}`;
      groupedLocations.set(cityKey, [
        ...(groupedLocations.get(cityKey) ?? []),
        location,
      ]);
    }

    const bounds = L.latLngBounds([]);
    for (const [cityKey, locations] of groupedLocations) {
      const coordinates = this.cityCoordinates[cityKey];
      if (!coordinates) continue;

      const city = locations[0];
      const count = locations.length;
      const popup = document.createElement('div');
      popup.className = 'home-popup';

      const heading = document.createElement('strong');
      heading.className = 'home-popup-heading';
      heading.textContent = `${city.city}, ${city.state} · ${count} ${count === 1 ? 'home' : 'homes'}`;
      popup.append(heading);

      const listingList = document.createElement('ul');
      listingList.className = 'home-popup-list';
      for (const location of locations) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'home-popup-link';
        link.href = this.router.serializeUrl(
          this.router.createUrlTree(['/details', location.id]),
        );
        const photo = document.createElement('img');
        photo.className = 'home-popup-photo';
        photo.src = location.photo;
        photo.alt = `Photo of ${location.name}`;
        photo.loading = 'lazy';

        const name = document.createElement('span');
        name.textContent = location.name;
        link.append(photo, name);
        L.DomEvent.on(link, 'click', (event) => {
          L.DomEvent.stopPropagation(event);
          event.preventDefault();
          void this.router.navigate(['/details', location.id]);
        });

        const availability = document.createElement('span');
        availability.className = 'home-popup-availability';
        availability.textContent = location.availableUnits === 0
          ? 'Currently full'
          : `${location.availableUnits} ${location.availableUnits === 1 ? 'home' : 'homes'} available`;
        item.append(link, availability);
        listingList.append(item);
      }
      popup.append(listingList);

      L.marker(coordinates, {
        title: `${count} ${count === 1 ? 'home' : 'homes'} in ${city.city}, ${city.state}`,
        icon: L.divIcon({
          className: 'home-count-marker',
          html: `<span>${count}</span>`,
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        }),
      })
        .bindPopup(popup)
        .addTo(this.markerLayer);
      bounds.extend(coordinates);
    }

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, {padding: [32, 32], maxZoom: 11});
    } else {
      this.map.setView([39, -98], 4);
    }
  }

  private destroyMap(): void {
    this.map?.remove();
    this.map = undefined;
    this.markerLayer = undefined;
  }
}
