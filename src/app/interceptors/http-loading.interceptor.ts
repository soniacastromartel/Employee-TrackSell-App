import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { EMPTY, Observable, throwError } from "rxjs";
import { LoadingController } from "@ionic/angular";
import { catchError, delay, finalize, map, retryWhen, take, tap } from "rxjs/operators";
import { NotificationsService } from "../services/notifications.service";

import { YA_VALIDADO } from "../app.constants";

@Injectable()
/**
   * Clase para el manejo centralizado de cabeceras en peticiones Http
   *
   */
export class HttpLoadingInterceptor implements HttpInterceptor {
    constructor(private loadingCtrl: LoadingController, private notificationSvc: NotificationsService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingCtrl.getTop().then(async hasLoading => {
            if (!hasLoading) {
                console.log(request);
                this.notificationSvc.loadOp = true;
                this.notificationSvc.loadData = true;
                await this.loadingCtrl.create({
                    duration: 5000,
                    message: 'Cargando Datos. Espere...',
                    mode: 'ios',
                    backdropDismiss: false,
                    spinner: 'bubbles',
                    cssClass: 'stlLoad'

                }).then(async (loading) => {
                    loading.present();
                    await loading.onDidDismiss().then(() => {
                        this.notificationSvc.loadOp = false;
                        this.notificationSvc.loadData = false;
                      }, (ex) => {
                        this.notificationSvc.loadOp = false;
                        this.notificationSvc.loadData = false;
                      });
                    
                });
            }
        });
        return next.handle(request).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    console.log ((<HttpErrorResponse>err));
                    // switch ((<HttpErrorResponse>err).status) {
                    //     case 401:
                    //         //handle refresh token
                    //         console.log('should refresh token');

                    //     default:
                    //         return throwError(err);
                    // }
                    switch ((<HttpErrorResponse>err).error.message) {
                        // case  
                        // "User validated no es -1.":
                        //     //handle refresh token
                        //     this.notificationSvc.toastBaseInfo(YA_VALIDADO.title, YA_VALIDADO.msg, 'middle');

                        default:
                            return throwError(err);
                    }
                } else {
                    return throwError(err);
                }
            }),
            // retryWhen(err => {
            //     let retries = 1;
            //     return err.pipe(
            //         delay(4000),
            //         take(3),
            //         tap(() => {
            //             //add a toast showing the retries
            //             // this.notificationSvc.toastBaseInfo('Intentos', 'Intentos: ' + retries, 'middle');
            //         }),
            //         map(error => {
            //             if (retries++ === 3) {
            //                 throw error;
            //             }
            //             return error;
            //         })
            //     )
            // }), catchError(error => {
            //     console.log(error);
            //     this.notificationSvc.toastBaseInfo('¡ERROR!', error.message, 'middle');
            //     return EMPTY;
            // }),
            // finalize(() => {
            //     console.log('finalize');
            //     this.loadingCtrl.getTop().then(hasLoading => {
            //         console.log(hasLoading);
            //         if (hasLoading) {
            //             this.loadingCtrl.dismiss();
            //         }
            //     })
                
            // })
        );

    }
}