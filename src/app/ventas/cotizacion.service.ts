import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { OrdenVenta } from './models/orden-venta';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private urlEndPoint: string = environment.apiURL + "api/orden-venta";

  constructor(private http: HttpClient) { }

  create(ov: OrdenVenta): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`, ov).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}
