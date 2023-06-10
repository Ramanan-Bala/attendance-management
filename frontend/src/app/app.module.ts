import { AuthenticationModule } from "./authentication/authentication.module";
import { ComponentsModule } from "./components/components.module";
import { PagesModule } from "./pages/pages.module";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { NZ_I18N } from "ng-zorro-antd/i18n";
import { en_US } from "ng-zorro-antd/i18n";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthInterceptorProvider } from "./helpers/auth.interceptor";
import { ErrorInterceptorProvider } from "./helpers/error.interceptor";
import { NgZorroModule } from "./NgZorro.module";
import { LoaderInterceptor } from "./helpers/loader.interceptor";
import { LoaderService } from "./services";

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroModule,
    PagesModule,
    ComponentsModule,
    AuthenticationModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    // LoaderService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoaderInterceptor,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
