import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Moneda } from './models/moneda';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {

  private urlEndPoint: string = environment.apiURL + "api/moneda";

  constructor(private http: HttpClient) { }

  getAllMonedas(): Observable<Moneda[]>{
    return this.http.get<Moneda[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}