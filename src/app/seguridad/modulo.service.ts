
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Modulo } from './models/modulo';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private urlEndPoint: string = environment.apiURL + 'api/modulo';

  constructor(private http: HttpClient) { }

  getAllModulo(): Observable<Modulo[]> {
    return this.http.get(this.urlEndPoint + '/all').pipe(
      map((response: any) => {
        (response as Modulo[]).map(modulos => {
          return modulos;
        })
        return response;
      })
    );
  }

  getModulosByUsername(username:string):Observable<Modulo[]>{
    return this.http.get<any>(`${this.urlEndPoint}/modulosByUsername/${username}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}