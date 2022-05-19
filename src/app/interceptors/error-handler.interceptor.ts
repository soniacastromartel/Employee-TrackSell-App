import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpErrorResponse }
    from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, delay, retryWhen, take, concat, tap, map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { UtilsService } from '../services/utils.service';
import { LOG_TYPE } from '../app.constants';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
    constructor(private toast: ToastController,
        private utilsSvc: UtilsService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //  console.log(request.body);
     return next.handle(request).pipe(
            // retry(2),
            map(res => {
                return res
            }),
            catchError((error: HttpErrorResponse) => this.errorHandler(error, request))
        );
        // return next.handle(req).pipe(
        //   retryWhen(error => error.pipe(
        //             delay(5000), 
        //             take(3),
        //             concat(throwError(error)))),
        //   catchError((error : HttpErrorResponse) => this.errorHandler(error))
        // );
    }


    errorHandler(error: HttpErrorResponse, request: HttpRequest<any>) {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
            console.log('This is client side error');
            errorMsg = `Error: ${error.error.message}`;
        } else {
            // console.log('This is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        // console.log(request);
         this.utilsSvc.appErrorLog(LOG_TYPE[2],error.name, errorMsg);
        return throwError(error);
    }

}



