import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http';

import { FeatureToggle } from '../feature-toggle.model';
import { FeatureToggleService } from '../feature-toggle.service';

@Component({
  selector: 'app-feature-toggle-edit',
  templateUrl: './feature-toggle-edit.component.html',
  styleUrl: './feature-toggle-edit.component.css'
})
export class FeatureToggleEditComponent {
  id: number;
  editMode = false;
  featureToggleForm: FormGroup;
  featureToggles: FeatureToggle[];

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private toggleService: FeatureToggleService) {

  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  private initForm() {
    let id = '';
    let displayName = 'Default Display Name';
    let technicalName = '';
    let expiresOn = '';
    let description = 'Default description';
    let inverted = false;
    let customerIds = [];
    let archived = false;

    if (this.editMode) {
      const feature = this.toggleService.getFeatureToggle(this.id);
      displayName = feature.displayName;
      technicalName = feature.technicalName;
      expiresOn = feature.expiresOn;
      description = feature.description;
      inverted = feature.inverted;
      customerIds = feature.customerIds;
    }

    this.featureToggleForm = new FormGroup({
      'displayName': new FormControl(displayName),
      'technicalName': new FormControl(technicalName, [Validators.required, this.invalidTechnicalName]),
      'expiresOn': new FormControl(expiresOn),
      'description': new FormControl(description),
      'inverted': new FormControl(inverted),
      'customerIds': new FormControl(customerIds, Validators.required)
    });
  }

  invalidTechnicalName(control: FormControl): {[s: string]: boolean} {
    // let usedTechnicalNames;

    // TODO: create function to check already used tecknical names, it should be uniqe

    // if (usedTechnicalNames.includes(control.value)) {
    //   return {'invalidTechnicalName': true};
    // }
    return null;
  }

  onSubmitFeatureToggle() {
    if (this.editMode) {
      this.toggleService.updateFeatureToggle(this.id, this.featureToggleForm.value)
    } else {
      this.toggleService.createFeatureToggle(this.featureToggleForm.value);
    }

    if (!this.editMode) this.featureToggleForm.reset();
  }

  // TODO: create clear method
  onClear() {

  }

  onDelete() {
    this.toggleService.deleteFeatureToggle(this.id);
  }
}
