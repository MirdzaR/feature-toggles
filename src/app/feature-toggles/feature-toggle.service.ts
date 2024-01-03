import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { FeatureToggle } from './feature-toggle.model';

@Injectable()
export class FeatureToggleService {
  // DB file url
  private url = 'http://localhost:3000/features';
  featureToggles: FeatureToggle[];
  feature: FeatureToggle;

  constructor(private http: HttpClient,
    private router: Router) {
    this.http.get(this.url).subscribe((res: FeatureToggle[]) => {
      this.featureToggles = res
    })
  }

  ngOnInit(): void {
  }

  getAllFeatureToggles() : Observable<FeatureToggle[]>{
    return this.http.get<FeatureToggle[]>(this.url);
  }

  getFeatureToggle(id: number) {
    return this.featureToggles.find(o => o.id === id);
  }

  createFeatureToggle(data: FeatureToggle) {
    this.http.post(this.url, data).subscribe();
  }

  toggleArchive(id: number) {
    this.feature = this.featureToggles.find(o => o.id === id);
    this.http.patch(this.url + '/' +id, {'archived': !this.feature.archived}).subscribe();
  }

  updateFeatureToggle(id: number, data: FeatureToggle) {
    this.feature = this.featureToggles.find(o => o.id === id);
    this.http.patch(this.url + '/' +id, data).subscribe();
  }

  deleteFeatureToggle(id: number) {
    this.http.delete(this.url + '/' +id).subscribe();
    this.router.navigate(['/'])
  }
}
