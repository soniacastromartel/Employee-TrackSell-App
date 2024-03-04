
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders }
  from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UserActivityService } from '../services/user-activity.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
    private token: string;

    constructor(private storage: StorageService, private router: Router, private userActivityService: UserActivityService
        ) { 
            // this.token= this.userActivityService.getToken();
            // console.log(this.token);
            console.log('holi');
            
        }
    intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
      const httpReq = req.clone({
        //  setHeaders: {'Content-Type': 'application/json'}
        headers: new HttpHeaders({
            // 'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${this.token}`,
            // "Access-Control-Allow-Origin": "*",
            // 'Access-Control-Allow-Headers': '*'
        })

      });
      return next.handle(httpReq);
    }
}
