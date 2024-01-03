import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { FeatureToggle } from '../feature-toggle.model';
import { FeatureToggleService } from '../feature-toggle.service';

@Component({
  selector: 'app-feature-toggle',
  templateUrl: './feature-toggle.component.html',
  styleUrl: './feature-toggle.component.css'
})
export class FeatureToggleComponent {
  feature: FeatureToggle;
  featureToggles: FeatureToggle[];
  id: number;
  private sub: any;

  constructor(private toggleService: FeatureToggleService,
              private route: ActivatedRoute,
              private router: Router
    ) {

  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.toggleService.getAllFeatureToggles().subscribe(res => {
          this.feature = res.find(o => o.id === this.id);
        });
      }
    );
  }

  onEditFeature() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onArchiveFeature() {
    this.toggleService.toggleArchive(this.id);
  }

  onDelete() {
    this.toggleService.deleteFeatureToggle(this.id);
  }
}
