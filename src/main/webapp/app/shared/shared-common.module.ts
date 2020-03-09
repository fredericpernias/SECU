import { NgModule } from '@angular/core';

import { SecuSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [SecuSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [SecuSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class SecuSharedCommonModule {}
