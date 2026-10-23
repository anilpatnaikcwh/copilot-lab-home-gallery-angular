import {Injectable, signal} from '@angular/core';
import {HousingLocation} from './housinglocation';
@Injectable({
  providedIn: 'root',
})
export class HousingService {
  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common';
  readonly favoriteIds = signal<number[]>(this.readFavoriteIds());
  readonly showFavorites = signal(false);

  protected housingLocationList: HousingLocation[] = [
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 4,
      wifi: true,
      laundry: true,
    },
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      photo: `${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg`,
      availableUnits: 0,
      wifi: false,
      laundry: true,
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Juneau',
      state: 'AK',
      photo: `${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg`,
      availableUnits: 1,
      wifi: false,
      laundry: false,
    },
    {
      id: 3,
      name: 'Homesteady Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/ian-macdonald-W8z6aiwfi1E-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
    {
      id: 4,
      name: 'Happy Homes Group',
      city: 'Gary',
      state: 'IN',
      photo: `${this.baseUrl}/krzysztof-hepner-978RAXoXnH4-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
    {
      id: 5,
      name: 'Hopeful Apartment Group',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-JvQ0Q5IkeMM-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
    },
    {
      id: 6,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/phil-hearing-IYfp2Ixe9nM-unsplash.jpg`,
      availableUnits: 5,
      wifi: true,
      laundry: true,
    },
    {
      id: 7,
      name: 'Hopeful Housing Solutions',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-GGupkreKwxA-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
    },
    {
      id: 8,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
      availableUnits: 10,
      wifi: false,
      laundry: false,
    },
    {
      id: 9,
      name: 'Capital Safe Towns',
      city: 'Portland',
      state: 'OR',
      photo: `${this.baseUrl}/webaliser-_TPTXZd9mOo-unsplash.jpg`,
      availableUnits: 6,
      wifi: true,
      laundry: true,
    },
    {
      id: 10,
      name: 'Willow Creek Residences',
      city: 'Austin',
      state: 'TX',
      photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      availableUnits: 3,
      wifi: true,
      laundry: true,
    },
    {
      id: 11,
      name: 'The Garden House',
      city: 'Boulder',
      state: 'CO',
      photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      availableUnits: 2,
      wifi: true,
      laundry: false,
    },
    {
      id: 12,
      name: 'Juniper Place',
      city: 'Nashville',
      state: 'TN',
      photo: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
      availableUnits: 4,
      wifi: true,
      laundry: true,
    },
    {
      id: 13,
      name: 'Parkside Commons',
      city: 'Madison',
      state: 'WI',
      photo: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
      availableUnits: 0,
      wifi: false,
      laundry: true,
    },
    {
      id: 14,
      name: 'Cedar & Stone',
      city: 'Raleigh',
      state: 'NC',
      photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      availableUnits: 1,
      wifi: true,
      laundry: true,
    },
    {
      id: 15,
      name: 'Lakeside Living',
      city: 'Minneapolis',
      state: 'MN',
      photo: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
      availableUnits: 5,
      wifi: true,
      laundry: false,
    },
  ];

  getAllHousingLocations(): HousingLocation[] {
    return this.housingLocationList;
  }

  getHousingLocationById(id: number): HousingLocation | undefined {
    return this.housingLocationList.find((housingLocation) => housingLocation.id === id);
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().includes(id);
  }

  toggleFavorite(id: number): void {
    const favorites = this.favoriteIds();
    const nextFavorites = favorites.includes(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];
    this.favoriteIds.set(nextFavorites);

    try {
      localStorage.setItem('home-gallery-favorites', JSON.stringify(nextFavorites));
    } catch (error) {
      console.warn('Saved homes could not be stored in this browser.', error);
    }
  }

  private readFavoriteIds(): number[] {
    try {
      const saved = JSON.parse(localStorage.getItem('home-gallery-favorites') ?? '[]');
      return Array.isArray(saved) && saved.every((id) => Number.isInteger(id)) ? saved : [];
    } catch (error) {
      console.warn('Saved homes could not be read from this browser.', error);
      return [];
    }
  }

  submitApplication(firstName: string, lastName: string, email: string): void {
    console.log(
      `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
    );
  }
}