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

  getListadoMaestro(cliente: string, fechaDesde: string, fechaHasta: string, indVerAnulados: number): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/listado`;

    if(cliente && cliente.length > 0) {
      url += `&cli=${cliente}`
    }

    if(fechaDesde && fechaDesde.length > 0) {
      url += `&fdes=${fechaDesde}`
    }

    if(fechaHasta && fechaHasta.length > 0) {
      url += `&fhas=${fechaHasta}`
    }

    if(indVerAnulados) {
      url += `&anu=${indVerAnulados}`
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  create(ov: OrdenVenta): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`, ov).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}
