import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncargadoPlantaService {

  private urlEndPoint: string = environment.apiURL + "api/encargado-planta";

  constructor(private http: HttpClient) { }

  create(idUsuario: number, plantaId: number): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create/${idUsuario}/${plantaId}`, null).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getEncargadosPlantasHoy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/all-hoy`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getEncargadosPlantasporPlanta(plantaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/valid/${plantaId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}