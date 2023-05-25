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

  updateCalidad(prodPlanta: ProduccionPlanta): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update/calidad`, prodPlanta).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getProduccionPlantaByPlantaIdProduccionId(plantaId: number, produccionId: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/get/${plantaId}/${produccionId}`)
  }

  descargarProtocolos(ordenVentaId: number): Observable<any> {
    let url: string = `${this.urlEndPoint}/descargar-protocolos/${ordenVentaId}`;

    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  descargarControlCalidad(sedeId: number, ordenTrabajoId: number, fecha: string, detalle: any[]): Observable<any> {
    let url: string = `${this.urlEndPoint}/descargar-control-calidad/${ordenTrabajoId}/${sedeId}?fecha=${fecha}`;

    return this.http.post(url, detalle, { responseType: 'blob' }).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  descargarCartaGarantia(sedeId: number, ordenTrabajoId: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/descargar-carta-garantia/${ordenTrabajoId}/${sedeId}`, { responseType: 'blob' }).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  descargarActaConformidad(sedeId: number, ordenTrabajoId: number, fechaInicio: string, fechaFin: string, detalle: any[]): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/descargar-acta-conformidad/${ordenTrabajoId}/${sedeId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, detalle, { responseType: 'blob' }).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

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
