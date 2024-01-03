import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FeatureToggle } from '../../feature-toggle.model';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})
export class ListItemComponent {
  @Input() feature: FeatureToggle;
  @Output() featureSelected = new EventEmitter<FeatureToggle>()
  @Input() id: number;

  toggleInactive() {
    // TODO: have to add check on date too
    return this.feature.archived || this.feature.inverted
  }
}
