import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Empresa } from './models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private urlEndPoint: string = environment.apiURL + "api/empresa";

  constructor(private http: HttpClient) { }

  getEmpresasActivas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.urlEndPoint}/activos`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}
