import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { EmpresaTransporteService } from 'src/app/transporte/empresa-transporte.service';
import { EmpresaTransporte } from 'src/app/transporte/models/empresa-transporte';
98765
@Component({
  selector: 'app-modal-ingresar-empresa-transporte',
  templateUrl: './modal-ingresar-empresa-transporte.component.html',
  styleUrls: ['./modal-ingresar-empresa-transporte.component.css']
})
export class ModalIngresarEmpresaTransporteComponent implements OnInit {

  tiposDocumentoSelect: TablaAuxiliarDetalle[];

  empresaTransporte: EmpresaTransporte = new EmpresaTransporte();

  blnHabilitar: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private auxiliarService: AuxiliarService,
    private empresaTransporteService: EmpresaTransporteService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.auxiliarService.getListSelect('TIPDOC').subscribe({
      next: res => {
        this.tiposDocumentoSelect = res;
      }
    })
  }

  buscarEmpresa() {
    this.empresaTransporteService.getFromSunat(this.empresaTransporte.nroDocumentoIdentidad).subscribe({
      next: res => {
        console.log(res)
        if(res.estado == "ACTIVO") {
          this.blnHabilitar = true;
          this.empresaTransporte.razonSocial = res.nombre;
          this.empresaTransporte.nombreComercial = res.nombre;
        } else {
          this.blnHabilitar = false;
          this.empresaTransporte.razonSocial = null;
          this.empresaTransporte.nombreComercial = null;
        }
      },error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail: err.error.mensaje});
          this.blnHabilitar = false;
          this.empresaTransporte.razonSocial = null;
          this.empresaTransporte.nombreComercial = null;
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error con el servidor.'});
          this.blnHabilitar = false;
          this.empresaTransporte.razonSocial = null;
          this.empresaTransporte.nombreComercial = null;
        }
      }
    })
  }

  guardar() {
    if(!this.empresaTransporte.razonSocial) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar una empresa de transportes válida.'});
      return;
    }

    this.empresaTransporteService.createUpdate(this.empresaTransporte).subscribe({
      next: res => {
        this.ref.close(res);
      }
    })
  }

  close() {
    this.ref.close()
  }

}
