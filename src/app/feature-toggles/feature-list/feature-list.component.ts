import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FeatureToggle } from '../feature-toggle.model';
import { FeatureToggleService } from '../feature-toggle.service';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.css'
})
export class FeatureListComponent {
  featureToggles: FeatureToggle[] = [];
  selectedFeature: FeatureToggle;
  private sub: any;

  constructor(private toggleService: FeatureToggleService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.toggleService.getAllFeatureToggles().subscribe(res => {
      this.featureToggles = res;
    });
  }

  ngOnChange() {
    this.sub = this.toggleService.getAllFeatureToggles().subscribe(res => {
      this.featureToggles = res;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNewFeature() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  onFeatureSelected(feature: FeatureToggle) {
    this.selectedFeature = feature;
  }
}
