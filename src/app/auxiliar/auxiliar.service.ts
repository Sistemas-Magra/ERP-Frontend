import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TablaAuxiliar } from './models/tabla-auxiliar';
import { TablaAuxiliarDetalle } from './models/tabla-auxiliar-detalle';

@Injectable({
  providedIn: 'root'
})
export class AuxiliarService {

  private urlEndPoint: string = environment.apiURL + 'api/tabla_auxiliar_detalle';
  private urlEndPoint2: string = environment.apiURL + 'api/tablaAuxiliar';

  constructor(private http: HttpClient) { }

  getByCodAux(codAux: string): Observable<TablaAuxiliar> {
    return this.http.get<TablaAuxiliar>(`${this.urlEndPoint2}/get-cod/${codAux}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListTablaAuxiliarFiltro(nombre: string): Observable<TablaAuxiliar[]> {
    let i: number = 0;
    let url: string = `${this.urlEndPoint2}/filtro`;

    if (nombre != undefined) {
      url = url + `&nombre=${nombre}`;
    }

    url = url.replace('&', '?');

    return this.http.get(url).pipe(
      map((response: any) => {
        (response as TablaAuxiliar[]).map(tabla => {
          return tabla;
        })
        return response;
      })
    )
  }

  getDetalleById(codTablaAuxiliar: string, id: number): Observable<TablaAuxiliarDetalle> {
    let url = `${this.urlEndPoint}/id`;

    if (codTablaAuxiliar != undefined) {
      url = url + `&codigo=${codTablaAuxiliar}`;
    }

    if (id != undefined) {
      url = url + `&id=${id}`;
    }

    url = url.replace('&', '?');

    return this.http.get<TablaAuxiliarDetalle>(url).pipe(
      catchError(e => {
        if (e.status != 401 && e.error) {
          console.error(e.error);
        }

        return throwError(() => e);
      })
    );
  }

  getDetalleByNombre(codTablaAuxiliar: string, nombre: string): Observable<TablaAuxiliarDetalle> {
    let url = `${this.urlEndPoint}/nombre`;

    if (codTablaAuxiliar != undefined) {
      url = url + `&codigo=${codTablaAuxiliar}`;
    }

    if (nombre != undefined) {
      url = url + `&nombre=${nombre}`;
    }

    url = url.replace('&', '?');

    return this.http.get<TablaAuxiliarDetalle>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  autocompleteDetalle(codTabla: string, term: string): Observable<TablaAuxiliarDetalle[]> {
    return this.http.get<TablaAuxiliarDetalle[]>(`${this.urlEndPoint}/autocomplete/${codTabla}/${term}`).pipe(
      map((response: any) => {
        (response as TablaAuxiliarDetalle[]).map(tabla => {
          return tabla;
        })
        return response;
      })
    )
  }

  getListSelect(codTablaAuxiliar: string): Observable<TablaAuxiliarDetalle[]> {
    return this.http.get<TablaAuxiliarDetalle[]>(`${this.urlEndPoint}/listaXCodAux/${codTablaAuxiliar}`).pipe(
      map((response: any) => {
        (response as TablaAuxiliarDetalle[]).map(tabla => {
          return tabla;
        })
        return response;
      })
    );
  }

  create(tablaAuxiliarDetalle: TablaAuxiliarDetalle): Observable<TablaAuxiliarDetalle> {
    return this.http.post(this.urlEndPoint, tablaAuxiliarDetalle).pipe(
      map((response: any) => response.tablaAuxiliarDetalle as TablaAuxiliarDetalle),
      catchError(e => {
        return throwError(() => e);
      })
    )
  }

  updateDetalle(tablaAuxiliarDetalle: TablaAuxiliarDetalle, nombre: string, cod_tabla: string): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update/${nombre}/${cod_tabla}`, tablaAuxiliarDetalle).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
