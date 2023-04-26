import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ProgramacionSemanalVigencia } from './models/programacion-semanal-vigencia';
import { ProgramacionSemanal } from './models/programacion-semanal';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionSemanalService {

  private urlEndPoint: string = environment.apiURL + "api/programacion-produccion";

  constructor(private http: HttpClient) { }

  getDetalleVersionSemanal(progsemId: number): Observable<ProgramacionSemanal> {
    return this.http.get<ProgramacionSemanal>(`${this.urlEndPoint}/detalle-semanal/${progsemId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListadoVersiones(progVigId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/versiones/${progVigId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getMaterialesProgramados(id: number, plantaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/get-materiales-programados/${id}/${plantaId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getVigenciaById(id: number): Observable<ProgramacionSemanalVigencia> {
    return this.http.get<ProgramacionSemanalVigencia>(`${this.urlEndPoint}/vigencia-detalle/${id}`).pipe(
      map(res => {

        res.versionesProgramacionSemanal.forEach(ps => {
          ps.detallePlantas.forEach(pl => {
            pl.detalleCliente.forEach(cl => {
              cl.ordenTrabajo.autocompleteShow = `${cl.ordenTrabajo.codigo} | ${cl.ordenTrabajo.ordenVenta.codigo} | ${cl.ordenTrabajo.ordenVenta.cliente.razonSocial.toUpperCase()}`
            })
          })
        })

        return res;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListado(anio: number, mes: number): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/listado`;

    if(anio) {
      url += `&anio=${anio}`
    }

    if(mes) {
      url += `&mes=${mes}`
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  guardarProgramacionSemanal(programacion: ProgramacionSemanalVigencia): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/semanal`, programacion).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  actualizarProgramacionSemanal(programacion: ProgramacionSemanalVigencia): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/semanal/update`, programacion).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
