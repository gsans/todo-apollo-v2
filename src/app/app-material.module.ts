import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatToolbarModule, MatTabsModule, MatListModule, MatFormFieldModule, MatIconModule, MatInputModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule} from '@angular/material';

@NgModule({
  exports: [MatToolbarModule, MatTabsModule, MatListModule, MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule],
})
export class AppMaterialModule { }