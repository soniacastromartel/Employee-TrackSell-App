import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage.service";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { UserActivityService } from '../services/user-activity.service';

@Injectable()
/**
   * Clase para el manejo centralizado de cabeceras en peticiones Http
   *
   */
export class AuthInterceptor implements HttpInterceptor {
    constructor(private storage: StorageService, private router: Router, private userActivityService: UserActivityService
    ) { 
        
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const clonedReq = request.clone({
            headers: new HttpHeaders({
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.storage.actualToken}`,
              
            })
        });
        return next.handle(clonedReq).pipe(
            tap(
                (event : HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                            //Manejar la respuesta
                      }
                },
                (error : HttpErrorResponse ) => {
                    if (error.status == 401) {
                        this.userActivityService.logout();
                        this.router.navigate(['/login']);
                    }
                }
            )
        )
    }
}
