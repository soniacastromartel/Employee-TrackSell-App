import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { EmployeeService } from "../services/employee.service";
import { Router } from "@angular/router";

@Injectable()
/**
   * Clase para el manejo centralizado de cabeceras en peticiones Http
   *
   */
export class AuthInterceptor implements HttpInterceptor {
    constructor(private employeeSvc: EmployeeService, private router: Router
    ) { 
        
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const clonedReq = request.clone({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.employeeSvc.actualToken}`
            })
        });
        return next.handle(clonedReq).pipe(
            // tap(
            //     (event : HttpEvent<any>) => {
            //         if (event instanceof HttpResponse) {
            //           }
            //     },
            //     (error : HttpErrorResponse ) => {
            //         if (error.status == 401) {
            //             this.router.navigateByUrl('/home');
            //         }
            //     }
            // )
        )
    }
}
