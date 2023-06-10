import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = localStorage.getItem("token");
    if (token) return true;

    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}

@Injectable({ providedIn: "root" })
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = localStorage.getItem("token");

    if (token) {
      this.router.navigate(["/home"]);
      return false;
    }

    return true;
  }
}

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user = JSON.parse(String(localStorage.getItem("user")));

    if (user.role === "MENTOR") {
      this.router.navigate(["/home"]);
      return false;
    }

    return true;
  }
}

@Injectable({ providedIn: "root" })
export class MentorGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user = JSON.parse(String(localStorage.getItem("user")));

    if (user.role === "ADMIN") {
      this.router.navigate(["/home"]);
      return false;
    }

    return true;
  }
}
