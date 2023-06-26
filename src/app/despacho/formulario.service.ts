import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Formulario } from './models/formulario';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  private urlEndPoint: string = environment.apiURL + "api/formulario";

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<Formulario> {
    return this.http.get<Formulario>(`${this.urlEndPoint}/find/${id}`).pipe(
      map(form => {
        form.ordenTrabajo.autocompleteShow =  `${form.ordenTrabajo.ordenVenta.codigo} | ${form.ordenTrabajo.ordenVenta.cliente.razonSocial.toUpperCase()}`
        return form;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  listado(fecha:string, cliente: string, pedido: string): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/list`;

    if(fecha) {
      url += `&f=${fecha}`;
    }

    if(cliente) {
      url += `&c=${cliente}`;
    }

    if(pedido) {
      url += `&p=${pedido}`;
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(formulario: Formulario): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update`,formulario).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  create(formulario: Formulario): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`,formulario).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
