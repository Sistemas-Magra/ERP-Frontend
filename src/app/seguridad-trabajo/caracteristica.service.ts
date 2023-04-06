import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CaracteristicaReporte } from './models/caracteristica-reporte';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaService {

  private urlEndpoint: string = `${environment.apiURL}api/caracteristica`

  constructor(private http: HttpClient) { }

  getAll(): Observable<CaracteristicaReporte[]> {
    return this.http.get<CaracteristicaReporte[]>(`${this.urlEndpoint}/all`)
  }

  create(caracteristica: CaracteristicaReporte): Observable<any> {
    return this.http.post(`${this.urlEndpoint}/create`, caracteristica)
  }
}
