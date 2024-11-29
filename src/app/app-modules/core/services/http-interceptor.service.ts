/*
 * AMRIT – Accessible Medical Records via Integrated Technology
 * Integrated EHR (Electronic Health Records) Solution
 *
 * Copyright (C) "Piramal Swasthya Management and Research Institute"
 *
 * This file is part of AMRIT.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SpinnerService } from './spinner.service';
import { ConfirmationService } from './confirmation.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  timerRef: any;
  currentLanguageSet: any;
  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    readonly sessionstorage: SessionStorageService,
    private http: HttpClient,
    private cookieService: CookieService,

  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const key: any = this.sessionstorage.getItem('tm-key');
    const tokn = this.cookieService.get('Jwttoken');

    let modifiedReq = null;
    if (key !== undefined && key !== null) {
      modifiedReq = req.clone({
        headers: req.headers
          .set('Authorization', key)
          .set('Content-Type', 'application/json'),
          // .set('Jwttoken', tokn),
      });
    } else {
      modifiedReq = req.clone({
        headers: req.headers.set('Authorization', ''),
      });
    }
    return next.handle(modifiedReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (req.url !== undefined && !req.url.includes('cti/getAgentState'))
          this.spinnerService.setLoading(true);
        if (event instanceof HttpResponse) {
          console.log(event.body);
          this.onSuccess(req.url, event.body);
          this.spinnerService.setLoading(false);
          return event.body;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.spinnerService.setLoading(false);
        return throwError(error.error);
      }),
    );
  }

  private onSuccess(url: string, response: any): void {
    if (this.timerRef) clearTimeout(this.timerRef);

    if (
      response.statusCode === 5002 &&
      url.indexOf('user/userAuthenticate') < 0
    ) {
      sessionStorage.clear();
      setTimeout(() => this.router.navigate(['/login']), 0);
      this.confirmationService.alert(response.errorMessage, 'error');
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.timerRef = setTimeout(
      () => {
        console.log('there', Date());

        if (
          sessionStorage.getItem('authenticationToken') &&
          sessionStorage.getItem('isAuthenticated')
        ) {
          this.confirmationService
            .alert(
              'Your session is about to Expire. Do you need more time ? ',
              'sessionTimeOut',
            )
            .afterClosed()
            .subscribe((result: any) => {
              if (result.action === 'continue') {
                this.http.post(environment.extendSessionUrl, {}).subscribe(
                  (res: any) => {},
                  (err: any) => {},
                );
              } else if (result.action === 'timeout') {
                clearTimeout(this.timerRef);
                sessionStorage.clear();

                this.confirmationService.alert(
                  this.currentLanguageSet.sessionExpired,
                  'error',
                );
                this.router.navigate(['/login']);
              } else if (result.action === 'cancel') {
                setTimeout(() => {
                  clearTimeout(this.timerRef);
                  sessionStorage.clear();

                  this.confirmationService.alert(
                    this.currentLanguageSet.sessionExpired,
                    'error',
                  );
                  this.router.navigate(['/login']);
                }, result.remainingTime * 1000);
              }
            });
        }
      },
      27 * 60 * 1000,
    );
  }
}
