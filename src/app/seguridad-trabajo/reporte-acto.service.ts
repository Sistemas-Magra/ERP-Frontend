import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReporteActosCondiciones } from './models/reporte-actos-condiciones';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteActoService {

  private urlEndpoint: string = `${environment.apiURL}api/reporte-acto`;

  constructor(private http: HttpClient) { }

  getListado(fecha: string, plantaId: number, estadoId: number): Observable<any[]> {
    let url = `${this.urlEndpoint}/listado`

    if(fecha && fecha.length > 0) {
      url += `&fecha=${fecha}`
    }

    if(plantaId) {
      url += `&plantaId=${plantaId}`
    }

    if(estadoId) {
      url += `&estadoId=${estadoId}`
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  create(reporte: ReporteActosCondiciones): Observable<any> {
    return this.http.post(`${this.urlEndpoint}/create`, reporte).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }
}
