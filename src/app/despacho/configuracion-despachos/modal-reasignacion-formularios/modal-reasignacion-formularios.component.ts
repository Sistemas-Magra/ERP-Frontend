import { Component, OnInit } from '@angular/core';
import { Formulario } from '../../models/formulario';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common'
import { FormularioService } from '../../formulario.service';

@Component({
  selector: 'app-modal-reasignacion-formularios',
  templateUrl: './modal-reasignacion-formularios.component.html',
  styleUrls: ['./modal-reasignacion-formularios.component.css']
})
export class ModalReasignacionFormulariosComponent implements OnInit {

  formsNoAsignados: Formulario[];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private datePipe: DatePipe,
    private formularioService: FormularioService
  ) { }

  ngOnInit(): void {
    let forms: Formulario[] = this.config.data.formsNoAsignados;

    forms.forEach(f => {
      f.fecha = new Date(`${this.datePipe.transform(f.fecha, 'yyyy-MM-dd')} 00:00:00.00000`);
    });

    this.formsNoAsignados = forms;
  }

  reasignar() {
    this.ref.close(this.formsNoAsignados)
  }

  close() {
    this.ref.close()
  }

}
