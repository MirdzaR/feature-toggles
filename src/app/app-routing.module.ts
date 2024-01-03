import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FeatureTogglesComponent } from "./feature-toggles/feature-toggles.component";
import { FeatureToggleComponent } from "./feature-toggles/feature-toggle/feature-toggle.component";
import { FeatureToggleEditComponent } from "./feature-toggles/feature-toggle-edit/feature-toggle-edit.component";

const appRoutes: Routes =[
  { path: '', redirectTo: '/feature-toggles', pathMatch: 'full' },
  { path: 'feature-toggles', component: FeatureTogglesComponent, children:[
    { path: 'new', component: FeatureToggleEditComponent },
    { path: ':id', component: FeatureToggleComponent },
    { path: ':id/edit', component: FeatureToggleEditComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
