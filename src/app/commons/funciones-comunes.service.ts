import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncionesComunesService {

  constructor() { }

  //Funciones con fechas
  diferenciaHoras(horaInicio: string, horaFin: string): number {
    let hInicio: number = Number(horaInicio.split(':')[0]);
    let mInicio: number = Number(horaInicio.split(':')[1]);
    let hFin: number = Number(horaFin.split(':')[0]);
    let mFin: number = Number(horaFin.split(':')[1]);

    let inicio: number = hInicio*60 + mInicio;
    let fin: number = hFin*60 + mFin;

    return (fin - inicio)/60
  }

  diasEntreFechas(fechaInicio: Date, fechaFin: Date): number {
    let days: number = Math.floor((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return days;
  }

  calcularEdad(fechaNacimiento: string): number {
    let edad: number;

    let year: number = +fechaNacimiento.split('-')[0];
    let month: number = +fechaNacimiento.split('-')[1];
    let day: number = +fechaNacimiento.split('-')[2];

    let hoy: Date= new Date();

    let yearHoy: number = hoy.getFullYear();
    let monthHoy: number = hoy.getMonth() + 1;
    let dayHoy: number = hoy.getDate();

    edad = yearHoy - year;

    if (month ==  monthHoy && dayHoy < day && yearHoy > year) {
      edad -= 1;
    } else if (monthHoy < month && yearHoy > year) {
      edad -= 1;
    }

    return edad;
  }

  esBisiesto(anio: number): boolean {

    return (anio%4==0 &&  anio%100!=0) || anio%400==0;
  }

  agregarTiempo(fecha: string, ind: number, cantidad: number): string {
    let fechaResult: string;

    let dia: number = fecha.split[2];
    let mes: number = fecha.split[1];
    let anio: number = fecha.split[0];

    if(ind == 1) {
      dia += cantidad;

      if(
        (this.tiene31dias(mes + 1) && dia > 31) ||
        (this.tiene30dias(mes + 1) && dia > 30) ||
        ((mes == 1 && !this.esBisiesto(anio)) && dia > 28) || 
        ((mes == 1 && this.esBisiesto(anio)) && dia > 29)
      ) {

        if(this.tiene31dias(mes + 1) && dia > 31) {
          dia = 31;
        }

        if(this.tiene30dias(mes + 1) && dia > 30) {
          dia = 30;
        }

        if((mes == 1 && !this.esBisiesto(anio)) && dia > 28) {
          dia = 28;
        }

        if((mes == 1 && this.esBisiesto(anio)) && dia > 29) {
          dia = 29;
        }
        
        mes += 1;
      }

      if(mes > 12) {
        anio += anio + 1
      }
    }

    fechaResult = `${anio}-${mes}-${dia}`

    return fechaResult;
  }

  tiene31dias(mes: number): boolean {
    return mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12;
  }

  tiene30dias(mes: number): boolean {
    return mes == 4 || mes == 6 || mes == 9 || mes == 11
  }
}
