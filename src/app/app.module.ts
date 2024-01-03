import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FeatureTogglesComponent } from './feature-toggles/feature-toggles.component';
import { FeatureListComponent } from './feature-toggles/feature-list/feature-list.component';
import { ListItemComponent } from './feature-toggles/feature-list/list-item/list-item.component';
import { FeatureToggleComponent } from './feature-toggles/feature-toggle/feature-toggle.component';
import { FeatureToggleEditComponent } from './feature-toggles/feature-toggle-edit/feature-toggle-edit.component';
import { FeatureToggleService } from './feature-toggles/feature-toggle.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    FeatureTogglesComponent,
    HeaderComponent,
    FeatureListComponent,
    ListItemComponent,
    FeatureToggleComponent,
    FeatureToggleEditComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [FeatureToggleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
