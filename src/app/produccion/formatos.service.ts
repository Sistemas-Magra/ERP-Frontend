import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ProduccionRegistroMezcla } from './models/produccion-registro-mezcla';
import { ProduccionRegistroEstructura } from './models/produccion-registro-estructura';
import { ProduccionRegistroTubosPines } from './models/produccion-registro-tubos-pines';
import { ProduccionRegistroCentrifugado } from './models/produccion-registro-centrifugado';
import { ProduccionRegistroDesencrofado } from './models/produccion-registro-desencrofado';
import { ProduccionRegistroCurado } from './models/produccion-registro-curado';

@Injectable({
  providedIn: 'root'
})
export class FormatosService {

  private urlEndPoint: string = environment.apiURL + "api/formatos";

  constructor(private http: HttpClient) { }

  getListadoFormato(plantaId: number, ind: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/get-listado/${plantaId}/${ind}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  saveRegistroCurado(plantaId: number, curado: ProduccionRegistroCurado): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/curado/create/${plantaId}`, curado).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  saveRegistroDesencrofado(plantaId: number, desencrofado: ProduccionRegistroDesencrofado): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/desencrofado/create/${plantaId}`, desencrofado).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  saveRegistroCentrifugado(plantaId: number, centrifugado: ProduccionRegistroCentrifugado): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/centrifugado/create/${plantaId}`, centrifugado).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  saveRegistroTubosPines(plantaId: number, tubosPines: ProduccionRegistroTubosPines): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/tubos-pines/create/${plantaId}`, tubosPines).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  saveRegistroEstructura(plantaId: number, estructura: ProduccionRegistroEstructura): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/estructura/create/${plantaId}`, estructura).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  saveRegistroMezcla(plantaId: number, mezcla: ProduccionRegistroMezcla): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/mezcla/create/${plantaId}`, mezcla).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
