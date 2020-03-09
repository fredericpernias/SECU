import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SecuSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [SecuSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [SecuSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SecuSharedModule {
  static forRoot() {
    return {
      ngModule: SecuSharedModule
    };
  }
}
