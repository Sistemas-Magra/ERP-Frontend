import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EmpresaTransporte } from './models/empresa-transporte';

@Injectable({
  providedIn: 'root'
})
export class EmpresaTransporteService {

  private urlEndPoint: string = environment.apiURL + "api/empresa-transporte";

  constructor(private http: HttpClient) { }

  createUpdate(empresaTransporte: EmpresaTransporte): Observable<EmpresaTransporte> {
    return this.http.post<EmpresaTransporte>(`${this.urlEndPoint}/create-update`, empresaTransporte).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getFromSunat(nroDocumento: string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/sunat/${nroDocumento}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getAll(): Observable<EmpresaTransporte[]> {
    return this.http.get<EmpresaTransporte[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}