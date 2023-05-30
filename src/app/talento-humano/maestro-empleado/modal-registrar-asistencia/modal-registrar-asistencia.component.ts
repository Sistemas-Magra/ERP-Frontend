import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../empleado.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { AsistenciaService } from '../../asistencia.service';
import { AuthService } from 'src/app/seguridad/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-registrar-asistencia',
  templateUrl: './modal-registrar-asistencia.component.html',
  styleUrls: ['./modal-registrar-asistencia.component.css']
})
export class ModalRegistrarAsistenciaComponent implements OnInit {

  inicioDiaMes = 1;

  meses: any[] = [
    {id: 1, idstr: '01', nombre: 'Enero', ultimoDia: 31},
    {id: 2, idstr: '02', nombre: 'Febrero', ultimoDia: 28},
    {id: 3, idstr: '03', nombre: 'Marzo', ultimoDia: 31},
    {id: 4, idstr: '04', nombre: 'Abril', ultimoDia: 30},
    {id: 5, idstr: '05', nombre: 'Mayo', ultimoDia: 31},
    {id: 6, idstr: '06', nombre: 'Junio', ultimoDia: 30},
    {id: 7, idstr: '07', nombre: 'Julio', ultimoDia: 31},
    {id: 8, idstr: '08', nombre: 'Agosto', ultimoDia: 31},
    {id: 9, idstr: '09', nombre: 'Setiembre', ultimoDia: 30},
    {id: 10, idstr: '10', nombre: 'Octubre', ultimoDia: 31},
    {id: 11, idstr: '11', nombre: 'Noviembre', ultimoDia: 30},
    {id: 12, idstr: '12', nombre: 'Diciembre', ultimoDia: 31}
  ];

  mesSeleccionado: any;

  anios: any[] = [];
  anioSeleccionado: any;

  dia: number = 1;

  empleados: any[] = [];

  indVerInactivos: boolean = false;

  blnEditando: boolean = false;

  blnEditar: boolean = true;

  tiposMarcacion: TablaAuxiliarDetalle[];

  constructor(
    private empleadoService: EmpleadoService,
    private auxiliarService: AuxiliarService,
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private funcionesComunes: FuncionesComunesService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {

    this.mesSeleccionado = this.meses.find(m => m.id == (new Date()).getMonth() + 1);

    this.anios.push({anio: (new Date()).getFullYear() - 2});
    this.anios.push({anio: (new Date()).getFullYear() - 1});
    this.anios.push({anio: (new Date()).getFullYear()});
    this.anios.push({anio: (new Date()).getFullYear() + 1});
    this.anios.push({anio: (new Date()).getFullYear() + 2});

    this.anioSeleccionado = this.anios[2];
    
    ((this.anioSeleccionado.anio%4==0 && this.anioSeleccionado.anio%100!=0) || this.anioSeleccionado.anio%400==0)?this.meses[1].ultimoDia = 29:'';

    this.auxiliarService.getListSelect('TIPMAR').subscribe({
      next: res => {
        this.tiposMarcacion = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.traerDatos();

  }

  get(event, i:number) {

    let tipo_id: number = event.value.valor2

    this.empleados[i].tipo_id = tipo_id;

    if(tipo_id == 10) {
      this.empleados[i].horas_sin_trabajar -= this.empleados[i].horas_tardanza;
      this.empleados[i].horas_trabajadas += this.empleados[i].horas_tardanza;
      this.empleados[i].horas_tardanza = 0;
    } else {
  
      let diferencia_inicio: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].incio_ing, this.empleados[i].incio_val);
  
      if(diferencia_inicio < 0){
        this.empleados[i].horas_tardanza = diferencia_inicio*(-1);
      }

      if(tipo_id == 7) {
        this.empleados[i].horas_sin_trabajar = 0;
        this.empleados[i].horas_trabajadas = 8;
        this.empleados[i].horas_extras = 0;
      } else {
        let tiempo_valido: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].incio_val, this.empleados[i].fin_val);

        let difHe: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].incio_ing, this.empleados[i].fin_ing) - tiempo_valido
    
        this.empleados[i].horas_extras = (difHe>0?difHe:0);

        let diferencia_salida: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].fin_ing,   this.empleados[i].fin_val);
        this.empleados[i].horas_trabajadas = 8 + diferencia_inicio - diferencia_salida;
        this.empleados[i].horas_sin_trabajar = 8 - this.empleados[i].horas_trabajadas < 0?0: 8 - this.empleados[i].horas_trabajadas;

      }

    }
  }

  cancelar() {
    this.traerDatos();
  }

  editar() {
    this.empleados.forEach(e => {
      e.marcacion_entity = this.tiposMarcacion[0];
      e.tipo_id = e.marcacion_id?e.marcacion_id:this.tiposMarcacion[0].valor2;
      e.horas_trabajadas = e.asistencia_id?e.horas_trabajadas:8;
    })
    this.blnEditando = true;
  }

  close() {
    this.ref.close()
  }

  traerDatos() {
    let fecha: string = `${this.anioSeleccionado.anio}-${this.mesSeleccionado.idstr}-${this.dia}`

    this.empleadoService.getActivos(
      fecha, 
      this.indVerInactivos?1:0
    ).subscribe({
      next: res => {
        console.log(res)
        this.blnEditando = false;
        this.empleados = res;

        let si: boolean = true;

        this.empleados.forEach(e => {
          if(e.asistencia_id != null) {
            si = false;
          }
        })

        this.blnEditar = si;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  menos() {
    this.dia -= 1;

    this.traerDatos();
  }

  mas() {
    this.dia += 1;

    this.traerDatos();
  }

  changeAnio() {
    ((this.anioSeleccionado.anio%4==0 && this.anioSeleccionado.anio%100!=0) || this.anioSeleccionado.anio%400==0)?this.meses[1].ultimoDia = 29:'';
  }

  validarHoras(i: number) {

    let hi: string = this.empleados[i].incio_ing;
    let hs: string = this.empleados[i].fin_ing;

    if(hi.split(':').length != 2) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una hora de ingreso válida.'})
      this.empleados[i].incio_ing = '';
      return;
    }

    if(!this.isNumeric(hi.split(':')[0]) || !this.isNumeric(hi.split(':')[1])){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una hora de ingreso válida.'})
      this.empleados[i].incio_ing = '';
      return;
    }

    let hih: number = +hi.split(':')[0]
    let him: number = +hi.split(':')[1]

    if(hih < 0 || hih > 23 || him < 0 || him > 59) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una hora de ingreso válida.'})
      this.empleados[i].incio_ing = '';
      return;
    }

    if(!this.isNumeric(hs.split(':')[0]) || !this.isNumeric(hs.split(':')[1])){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una hora de ingreso válida.'})
      this.empleados[i].fin_ing = '';
      return;
    }

    let hsh: number = +hs.split(':')[0]
    let hsm: number = +hs.split(':')[1]

    if(hsh < 0 || hsh > 23 || hsm < 0 || hsm > 59) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una hora de ingreso válida.'})
      this.empleados[i].fin_ing = '';
      return;
    }

    let tiempo_valido: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].incio_val, this.empleados[i].fin_val);

    let diferencia_inicio: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].incio_ing, this.empleados[i].incio_val);
    let diferencia_salida: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].fin_ing,   this.empleados[i].fin_val);

    if(diferencia_inicio < 0){
      this.empleados[i].horas_tardanza = diferencia_inicio*(-1);
    }

    let difHe: number = this.funcionesComunes.diferenciaHoras(this.empleados[i].incio_ing, this.empleados[i].fin_ing) - tiempo_valido

    this.empleados[i].horas_extras = (difHe>0?difHe:0);

    this.empleados[i].horas_trabajadas = 8 + diferencia_inicio - diferencia_salida;
    this.empleados[i].horas_sin_trabajar = 8 - this.empleados[i].horas_trabajadas < 0?0: 8 - this.empleados[i].horas_trabajadas;

  }

  validar(): boolean {
    return true;
  }

  guardar() {
    let fecha: string = `${this.anioSeleccionado.anio}-${this.mesSeleccionado.idstr}-` + (this.dia.toString().length==2?`${this.dia}`:`0${this.dia}`)

    this.empleados.forEach(e => {
      e.incio_ing = `${fecha} ${e.incio_ing}`;
      e.fin_ing = `${fecha} ${e.fin_ing}`;
      delete e.marcacion_entity;
      e.fecha = fecha;
      e.id_crea = this.authService.usuario.id;
    })

    this.asistenciaService.registrarAsistencia(JSON.stringify(this.empleados)).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Asistencia registrada.'})
        this.traerDatos();
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  isNumeric(val) {
    return /^-?\d+$/.test(val);
  }

}
