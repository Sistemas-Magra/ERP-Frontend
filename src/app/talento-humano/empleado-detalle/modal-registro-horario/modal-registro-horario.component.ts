import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmpleadoHorarios } from '../../models/empleado-horarios';
import { forkJoin } from 'rxjs';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-registro-horario',
  templateUrl: './modal-registro-horario.component.html',
  styleUrls: ['./modal-registro-horario.component.css']
})
export class ModalRegistroHorarioComponent implements OnInit {

  horario: EmpleadoHorarios[] = [];
  dias: TablaAuxiliarDetalle[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private auxiliarService: AuxiliarService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    let fork = forkJoin(
      this.auxiliarService.getListSelect('TIPDIA')
    )

    fork.subscribe({
      next: res => {

        this.dias = res[0].filter(t => t.valor == '1');

        if(!this.config.data.horarios || this.config.data.horarios.length == 0) {
          this.dias.forEach(d => {
            let newH: EmpleadoHorarios = new EmpleadoHorarios();

            newH.dia = d;

            this.horario.push(newH);
          })
        } else {
          this.horario = this.config.data.horarios
        }
      }
    })
  }

  validar(): boolean {
    let blnValido: boolean = true;
    for(let i: number = 0; i < this.horario.length; i++) {

      let h = this.horario[i]

      let hi: string = h.horaIngreso;
      let hs: string = h.horaSalida;

      if(hi.split(':').length != 2) {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:`Debe ingresar una hora de ingreso válida el dia ${h.dia.nombre}.`})
        h.horaIngreso = '';
        blnValido = false;
        break;
      }

      if(hs.split(':').length != 2) {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:`Debe ingresar una hora de salida válida el dia ${h.dia.nombre}.`})
        h.horaSalida = '';
        blnValido = false;
        break;
      }
  
      if(!this.isNumeric(hi.split(':')[0]) || !this.isNumeric(hi.split(':')[1])){
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:`Debe ingresar una hora de ingreso válida el dia ${h.dia.nombre}.`})
        h.horaIngreso = '';
        blnValido = false;
        break;
      }

      let hih: number = +hi.split(':')[0]
      let him: number = +hi.split(':')[1]
  
      if(hih < 0 || hih > 23 || him < 0 || him > 59) {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:`Debe ingresar una hora de ingreso válida el dia ${h.dia.nombre}.`})
        h.horaIngreso = '';
        blnValido = false;
        break;
      }
  
      if(!this.isNumeric(hs.split(':')[0]) || !this.isNumeric(hs.split(':')[1])){
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:`Debe ingresar una hora de salida válida el dia ${h.dia.nombre}.`})
        h.horaSalida = '';
        blnValido = false;
        break;
      }
  
      let hsh: number = +hs.split(':')[0]
      let hsm: number = +hs.split(':')[1]
  
      if(hsh < 0 || hsh > 23 || hsm < 0 || hsm > 59) {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:`Debe ingresar una hora de salida válida el dia ${h.dia.nombre}.`})
        h.horaSalida = '';
        blnValido = false;
        break;
      }
    }

    return blnValido;
  }

  guardar() {
    if(!this.validar()) {
      return;
    }

    this.ref.close(JSON.parse(JSON.stringify(this.horario)));
  }

  close() {
    this.ref.close();
  }

  isNumeric(val) {
    return /^-?\d+$/.test(val);
  }

}
