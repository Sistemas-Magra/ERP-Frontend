import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ProduccionPlanta } from './models/produccion-planta';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  private urlEndPoint: string = environment.apiURL + "api/produccion";

  constructor(private http: HttpClient) { }

  getListadoInventarioMensual(indMes: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/listado-mensual/${indMes}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListado(fechaDesde: string, fechaHasta: string, estadoId: number): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/listado`;

    if(fechaDesde && fechaDesde.length > 0) {
      url += `&fd=${fechaDesde}`
    }

    if(fechaHasta && fechaHasta.length > 0) {
      url += `&fh=${fechaHasta}`
    }

    if(estadoId) {
      url += `&eid=${estadoId}`
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(prodPlanta: ProduccionPlanta, stickerProduccion: string): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update/listado-produccion/${stickerProduccion}`, prodPlanta).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  create(prodPlanta: ProduccionPlanta): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`, prodPlanta).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
