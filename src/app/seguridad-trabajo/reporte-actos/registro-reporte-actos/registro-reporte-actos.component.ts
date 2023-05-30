import { Component, OnInit } from '@angular/core';
import { ReporteActosCondiciones } from '../../models/reporte-actos-condiciones';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { AuthService } from 'src/app/seguridad/auth.service';
import { DatePipe } from '@angular/common';
import { UsuarioService } from 'src/app/seguridad/usuario.service';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { EmpleadoService } from 'src/app/talento-humano/empleado.service';
import { Empleado } from 'src/app/talento-humano/models/empleado';
import { CaracteristicaService } from '../../caracteristica.service';
import { CondicionService } from '../../condicion.service';
import { CaracteristicaReporte } from '../../models/caracteristica-reporte';
import { CondicionReporte } from '../../models/condicion-reporte';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAgregarActoCondicionComponent } from './modal-agregar-acto-condicion/modal-agregar-acto-condicion.component';
import { MessageService } from 'primeng/api';
import { ReporteActoService } from '../../reporte-acto.service';
import { ReporteCaracteristicaEncontrada } from '../../models/reporte-caracteristica-encontrada';
import { ReporteCondicionEncontrada } from '../../models/reporte-condicion-encontrada';

@Component({
  selector: 'app-registro-reporte-actos',
  templateUrl: './registro-reporte-actos.component.html',
  styleUrls: ['./registro-reporte-actos.component.css']
})
export class RegistroReporteActosComponent implements OnInit {

  reporte: ReporteActosCondiciones = new ReporteActosCondiciones();

  tiposEventoSelected: TablaAuxiliarDetalle[] = [];
  tiposEventoSelect: TablaAuxiliarDetalle[] = [];

  tiposAfectacionSelected: TablaAuxiliarDetalle[] = [];
  tiposAfectacionSelect: TablaAuxiliarDetalle[] = [];

  caracteristicasSelect: CaracteristicaReporte[] = [];
  condicionSelect: CondicionReporte[] = [];
  caracteristicasSelected: CaracteristicaReporte[] = [];
  condicionSelected: CondicionReporte[] = [];

  plantas: Planta[];
  empleadosAutocomplete: Empleado[];
  usuario: any;

  fecha: Date = new Date();

  blnActos: boolean = false;
  blnCondiciones: boolean = false;

  ref: DynamicDialogRef;

  constructor(
    private plantaService: PlantaService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private auxiliarService: AuxiliarService,
    private empleadoService: EmpleadoService,
    private caracteristicaService: CaracteristicaService,
    private condicionService: CondicionService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private reporteService: ReporteActoService,
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.usuarioService.getDatosEmpleado(this.authService.usuario.id).subscribe({
      next: res => {
        this.usuario = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.auxiliarService.getDetalleById('ESTRST', 1).subscribe({
      next: res => {
        this.reporte.estado = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.auxiliarService.getListSelect('TIPEVN').subscribe({
      next: res => {
        this.tiposEventoSelect = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.auxiliarService.getListSelect('TIPAFE').subscribe({
      next: res => {
        this.tiposAfectacionSelect = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.plantaService.getPlantasActivas().subscribe({
      next: res => {
        this.plantas = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.caracteristicaService.getAll().subscribe({
      next: res => {
        this.caracteristicasSelect = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.condicionService.getAll().subscribe({
      next: res => {
        this.condicionSelect = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  getEmpleadoAutocomplete(event) {
    this.empleadoService.autocomplete(event.query).subscribe({
      next: res => {
        this.empleadosAutocomplete = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  addCaracteristica() {
    this.ref = this.dialogService.open(ModalAgregarActoCondicionComponent, {
      data: {
        ind: 2
      }, 
      height: '165px', 
      width: '500px'
    })

    this.ref.onClose.subscribe({
      next: res => {
        if(res) {
          this.caracteristicasSelect.push(res);
        }
      }
    })
  }

  addCondicion() {
    this.ref = this.dialogService.open(ModalAgregarActoCondicionComponent, {
      data: {
        ind: 1
      }, 
      height: '165px', 
      width: '500px'
    })

    this.ref.onClose.subscribe({
      next: res => {
        if(res) {
          this.condicionSelect.push(res);
        }
      }
    })

  }
  
  setBools() {
    this.blnActos = this.tiposEventoSelected.map(e => e.tablaAuxiliarDetalleId.id).includes(1);
    this.blnCondiciones = this.tiposEventoSelected.map(e => e.tablaAuxiliarDetalleId.id).includes(2)
  }

  guardar() {
    if(!this.reporte.fechaOcurrenciaStr || this.reporte.fechaOcurrenciaStr.length==0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la fecha en la que ocurrió el acto.'})
      return;
    }
    
    if(!this.reporte.planta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la planta en la que ocurrió el acto.'})
      return;
    }
    
    if(!this.tiposEventoSelected || this.tiposEventoSelected.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar al menos un tipo de evento del acto.'})
      return;
    }
    
    if(!this.tiposAfectacionSelected || this.tiposAfectacionSelected.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar al menos una afectación del acto.'})
      return;
    }
    
    if(!this.reporte.descripcion || this.reporte.descripcion.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la descripción del acto.'})
      return;
    }

    this.reporte.idUsuarioCrea = this.authService.usuario.id;
    
    this.reporte.fechaOcurrencia = new Date(this.reporte.fechaOcurrenciaStr);
    this.reporte.afectacion = this.tiposAfectacionSelected.map(t => t.tablaAuxiliarDetalleId.id).join(',');
    this.reporte.tipoEvento = this.tiposEventoSelected.map(t => t.tablaAuxiliarDetalleId.id).join(',');

    this.caracteristicasSelected.forEach(ce => {
      let cc: ReporteCaracteristicaEncontrada = new ReporteCaracteristicaEncontrada();
      cc.caracteristica = ce;
      this.reporte.caracteristicas.push(cc)
    })

    this.condicionSelected.forEach(ce => {
      let co: ReporteCondicionEncontrada = new ReporteCondicionEncontrada();
      co.condicion = ce;
      this.reporte.condiciones.push(co)
    })

    this.reporteService.create(this.reporte).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Datos guardados correctamente.'})
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

}
