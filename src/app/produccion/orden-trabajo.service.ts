import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { OrdenTrabajo } from './models/orden-trabajo';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {

  private urlEndPoint: string = environment.apiURL + "api/orden-trabajo";

  constructor(private http: HttpClient) { }

  getProductosFromOrdenTrabajo(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/listado-productos-calidad/${id}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListadoProducto(ordenTrabajoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/listado-productos/${ordenTrabajoId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListadoPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/listado-pedidos`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  autocomplete(term: string): Observable<OrdenTrabajo[]> {
    return this.http.get<OrdenTrabajo[]>(`${this.urlEndPoint}/autocomplete/${term}`).pipe(
      map(ots => {

        ots.forEach(ot => {
          ot.autocompleteShow = `${ot.codigo} | ${ot.ordenVenta.codigo} | ${ot.ordenVenta.cliente.razonSocial.toUpperCase()}`
        })

        return ots;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}