import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { ModalAgregarAuxiliarComponent } from 'src/app/commons/modal-agregar-auxiliar/modal-agregar-auxiliar.component';
import { AuthService } from 'src/app/seguridad/auth.service';
import { EmpleadoService } from '../../empleado.service';
import { Cese } from '../../models/cese';

@Component({
  selector: 'app-modal-registro-ceses',
  templateUrl: './modal-registro-ceses.component.html',
  styleUrls: ['./modal-registro-ceses.component.css']
})
export class ModalRegistroCesesComponent implements OnInit {

  cese: Cese = new Cese();

  blnCargando: boolean = false;

  motivosCese: TablaAuxiliarDetalle[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private auxiliarService: AuxiliarService,
    private empleadoService: EmpleadoService,
    private authService: AuthService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.cese.fechaCese = new Date();

    this.auxiliarService.getListSelect('MOTCSE').subscribe({
      next: res => {
        this.motivosCese = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.empleadoService.getPeriodosCeseActivos().subscribe({
      next: res => {
        
        this.cese.periodoCts = res.cts;
        this.cese.periodoGratificacion = res.grati;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }
  
  close() {
    this.ref.close();
  }

  guardar() {

    if(!this.cese.fechaCese) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la fecha de cese del personal.'});
      return;
    }

    this.cese.fechaCrea = new Date();
    this.cese.idUsuarioCrea = this.authService.usuario.id;

    this.blnCargando = true;
    this.empleadoService.registrarCese(this.cese, this.config.data.id).subscribe({
      next: res => {
        this.blnCargando = false;
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Cese de personal registrado correctamente.'})
        this.ref.close();
      }, error: err => {
        this.blnCargando = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'Error al registrar permiso.'})
      }
    })
  }
  
  agregarAuxiliar() {
    let id: number = this.motivosCese.length + 1;

    this.ref = this.dialogService.open(ModalAgregarAuxiliarComponent,{
      data: {
        id: id,
        codAux: 'MOTCSE',
      },
      width: '500px',
      height: '200px'
    })

    this.ref.onClose.subscribe(resp => {
      if(resp?.response){
        this.motivosCese.push(resp.response)
      }
    })
  }

}
