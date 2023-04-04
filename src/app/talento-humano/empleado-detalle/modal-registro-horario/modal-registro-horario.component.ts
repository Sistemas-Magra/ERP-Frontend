import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmpleadoHorarios } from '../../models/empleado-horarios';
import { forkJoin } from 'rxjs';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';

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

  guardar() {
    this.ref.close(JSON.parse(JSON.stringify(this.horario)));
  }

  close() {
    this.ref.close();
  }

}
