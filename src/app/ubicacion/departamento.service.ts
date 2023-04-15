import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Departamento } from './models/departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private urlEndPoint: string = `${environment.apiURL}api/departamento`

  constructor(private http: HttpClient) { }

  getAll(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }


}