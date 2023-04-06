import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CondicionReporte } from './models/condicion-reporte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CondicionService {

  private urlEndpoint: string = `${environment.apiURL}api/condicion`

  constructor(private http: HttpClient) { }

  getAll(): Observable<CondicionReporte[]> {
    return this.http.get<CondicionReporte[]>(`${this.urlEndpoint}/all`)
  }

  create(condicion: CondicionReporte): Observable<any> {
    return this.http.post(`${this.urlEndpoint}/create`, condicion)
  }
}
