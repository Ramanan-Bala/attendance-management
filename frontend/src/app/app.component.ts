import { Component } from "@angular/core";
import { LoaderService } from "./services";

@Component({
  selector: "app-root",
  template: `<router-outlet></router-outlet>
    <div
      class="absolute h-screen w-full grid items-center justify-center top-0 left-0 bg-black bg-opacity-20"
      *ngIf="loading"
    >
      <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
    </div> `,
})
export class AppComponent {
  loading: boolean = false;

  constructor(private loaderService: LoaderService) {
    // this.loaderService.isLoading.subscribe((v) => {
    //   console.log(v);
    //   this.loading = v;
    // });
  }
}
