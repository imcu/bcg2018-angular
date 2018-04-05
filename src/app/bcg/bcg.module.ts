import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BcgCollectiblesComponent} from './bcg-collectibles/bcg-collectibles.component';
import {UtilModule} from '../util/util.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UtilModule
  ],
  declarations: [BcgCollectiblesComponent],
  exports: [BcgCollectiblesComponent]
})
export class BcgModule {
}
