import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError, map } from 'rxjs';
import { OrdenVenta } from './models/orden-venta';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private urlEndPoint: string = environment.apiURL + "api/orden-venta";

  constructor(private http: HttpClient) { }

  subirPlanoEspecificaciones(plano: File, esp: File, i: string, ovd: string): Observable<any> {
    let formData = new FormData();

    formData.append("plano", plano);
    formData.append("esp", esp);
    formData.append("number", i);
    formData.append("id", ovd);

    return this.http.put(`${this.urlEndPoint}/upload-files`, formData).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  updateVenta(id: number, venta: OrdenVenta): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update/${id}`, venta).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  getById(id: number): Observable<OrdenVenta> {
    return this.http.get<OrdenVenta>(`${this.urlEndPoint}/get/${id}`).pipe(
      map(res => {
        if(res.cliente?.contactos) {
          res.cliente.contactos.forEach(c => {
            c.nombreCompleto = c.nombres + ' ' + c.apellidoPaterno + ' ' + c.apellidoMaterno; 
          })
        }

        res.detalle.forEach(r => {
          r.producto.busqueda = r.producto.codigo + ' - ' + r.producto.resumen
        })

        return res;
      }),
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  getListadoMaestro(cliente: string, fechaDesde: string, fechaHasta: string, indVerAnulados: number): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/listado`;

    if(cliente && cliente.length > 0) {
      url += `&cli=${cliente}`
    }

    if(fechaDesde && fechaDesde.length > 0) {
      url += `&fdes=${fechaDesde}`
    }

    if(fechaHasta && fechaHasta.length > 0) {
      url += `&fhas=${fechaHasta}`
    }

    if(indVerAnulados) {
      url += `&anu=${indVerAnulados}`
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  create(ov: OrdenVenta): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`, ov).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}