import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncionesComunesService {

  constructor(
    private pipe: DatePipe
  ) { }

  getMinutosEntreHoras(horaInicio: string, horaFin: string): number {
    let minutosHI: number = Number(horaInicio.split(':')[0])*60 + Number(horaInicio.split(':')[1]);
    let minutosHF: number = Number(horaFin.split(':')[0])*60 + Number(horaFin.split(':')[1]);

    return minutosHF - minutosHI;
  }

  getNextMonday(): string {
    let fechaLunes: string = this.pipe.transform(new Date(), 'yyyy-MM-dd')

    while((new Date(`${fechaLunes} 00:00:00.000000`)).getDay() != 1 || +fechaLunes.split('-')[2] == (new Date()).getDate()) {
      fechaLunes = this.agregarDias(fechaLunes, 1);
    }

    return fechaLunes;
  }

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

  agregarDias(fecha: string, n: number): string{
    return this.numberToDate(this.dateToNumber(fecha) + n);
  }

  dateToNumber(fecha: string) {

    let dia: number = Number(fecha.split('-')[2])
    let mes: number = Number(fecha.split('-')[1])
    let anio: number = Number(fecha.split('-')[0])

    mes = (mes + 9)%12
    anio = anio - Math.floor(mes/10)

    return anio*365 + Math.floor(anio/4) - Math.floor(anio/100) + Math.floor(anio/400) + Math.floor((mes*306 + 5)/10) + dia - 1

  }

  numberToDate(num: number): string {
    let anio: number = Math.floor((10000*num + 14780)/3652425);
    let diaAux: number = num - (365*anio + Math.floor(anio/4) - Math.floor(anio/100) + Math.floor(anio/400))
    
    if(diaAux < 0) {
      anio = anio - 1;
      diaAux = num - (365*anio + Math.floor(anio/4) - Math.floor(anio/100) + Math.floor(anio/400))
    }

    let mes: number = (Math.floor((100*diaAux + 52)/3060) + 2)%12 + 1;

    anio = anio + Math.floor((Math.floor((100*diaAux + 52)/3060) + 2)/12);
    let dia: number = diaAux - Math.floor((Math.floor((100*diaAux + 52)/3060)*306 + 5)/10) + 1;

    let diastr: string = (dia < 10)?`0${dia}`: dia.toString();
    let messtr: string = (mes < 10)?`0${mes}`: mes.toString();

    return `${anio}-${messtr}-${diastr}`;
  }

  tiene31dias(mes: number): boolean {
    return mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12;
  }

  tiene30dias(mes: number): boolean {
    return mes == 4 || mes == 6 || mes == 9 || mes == 11
  }
}
