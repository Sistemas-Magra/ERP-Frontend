import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Cargo } from './models/cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private urlEndPoint: string = environment.apiURL + 'api/cargo'

  constructor(private http: HttpClient) { }

  getAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}