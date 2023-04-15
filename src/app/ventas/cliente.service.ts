import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Cliente } from '../maestros/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = environment.apiURL + "api/cliente";

  constructor(private http: HttpClient) { }

  buscarRuc(ruc: string, ind: number): Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/sunat/${ruc}/${ind}`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  getClientesAutocomplete(term: string): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${this.urlEndPoint}/autocomplete/${term}`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}
