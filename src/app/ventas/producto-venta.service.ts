import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError, map } from 'rxjs';
import { ProductoVenta } from './models/producto-venta';

@Injectable({
  providedIn: 'root'
})
export class ProductoVentaService {

  private urlEndPoint: string = environment.apiURL + "api/producto-venta";

  constructor(private http: HttpClient) { }

  autocomplete(term: string): Observable<ProductoVenta[]> {
    return this.http.get<ProductoVenta[]>(`${this.urlEndPoint}/autocomplete/${term}`).pipe(
      map(res => {
        res.forEach(r => {
          r.busqueda = r.codigo + ' - ' + r.resumen
        })
        return res;
      }),
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}
