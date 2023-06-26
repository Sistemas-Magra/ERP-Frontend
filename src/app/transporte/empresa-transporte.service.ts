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

  getAll(): Observable<EmpresaTransporte[]> {
    return this.http.get<EmpresaTransporte[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}