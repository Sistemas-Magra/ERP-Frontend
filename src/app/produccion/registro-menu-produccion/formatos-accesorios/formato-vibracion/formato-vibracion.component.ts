import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { FormatosService } from 'src/app/produccion/formatos.service';
import { OrdenTrabajo } from 'src/app/produccion/models/orden-trabajo';
import { ProduccionAccesorioRegistroVibracion } from 'src/app/produccion/models/produccion-accesorio-registro-vibracion';
import { OrdenTrabajoService } from 'src/app/produccion/orden-trabajo.service';
import { DatePipe } from '@angular/common';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { UsuarioPlanta } from 'src/app/seguridad/models/usuario-planta';
import { AuthService } from 'src/app/seguridad/auth.service';
import { UsuarioService } from 'src/app/seguridad/usuario.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-formato-vibracion',
  templateUrl: './formato-vibracion.component.html',
  styleUrls: ['./formato-vibracion.component.css']
})
export class FormatoVibracionComponent implements OnInit {

  usuarioPlanta: UsuarioPlanta;

  listado: ProduccionAccesorioRegistroVibracion[] = [];

  fecha: Date = new Date();
  responsable: string;

  listadoOrdenesTrabajo: OrdenTrabajo[];
  listadoEstadoMaquina: TablaAuxiliarDetalle[];

  validarFila: number = -1;
  blnFilaAniadidaSinGuardar: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private messageService: MessageService,
    private ordenTrabajoService: OrdenTrabajoService,
    private auxiliarService: AuxiliarService,
    private formatoService: FormatosService,
    private pipe: DatePipe,
    private funcionesComunes: FuncionesComunesService
  ) { }

  ngOnInit(): void {

    let fork = forkJoin([
      this.auxiliarService.getListSelect('ESTMQA'),
      this.usuarioService.getUsuarioPlantaByUsuarioId(this.authService.usuario.id)
    ])

    fork.subscribe({
      next: res => {
        this.listadoEstadoMaquina = res[0];
        this.usuarioPlanta = res[1];
        this.responsable = this.authService.usuario.nombreCompleto;
        this.setListado();
      }
    })
  }

  setListado() {
    this.formatoService.getListadoFormato(this.usuarioPlanta.planta.id, 9).subscribe({
      next: res => {
        if(res.listado) {
          this.listado = res.listado;
        } else {
          this.listado = [];
        }
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  setHorasHI(event, i: number) {
    this.listado[i].horaIngreso = event;
    let horaIngresoStr: string = this.pipe.transform(this.listado[i].horaIngreso, 'HH:mm');

    if(this.listado[i].horaSalida) {
      this.listado[i].minutosTotal = this.funcionesComunes.getMinutosEntreHoras(horaIngresoStr, this.pipe.transform(this.listado[i].horaSalida, 'HH:mm'));
    }
  }

  setHorasHF(event, i: number) {
    this.listado[i].horaSalida = event;
    let horaSalidaStr: string = this.pipe.transform(this.listado[i].horaSalida, 'HH:mm');

    if(this.listado[i].horaIngreso) {
      this.listado[i].minutosTotal = this.funcionesComunes.getMinutosEntreHoras(this.pipe.transform(this.listado[i].horaIngreso, 'HH:mm'), horaSalidaStr);
    }
  }

  asignarFila(i: number) {
    if(this.blnFilaAniadidaSinGuardar) {
      return;
    }
    
    this.validarFila = i;
  }

  addRegistro() {
    if(this.blnFilaAniadidaSinGuardar) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe terminar de guardar el registro para añadir otro.'})
      return;
    }
    
    let mezcla: ProduccionAccesorioRegistroVibracion = new ProduccionAccesorioRegistroVibracion();

    mezcla.indConforme = true;
    mezcla.responsable = this.responsable;

    this.validarFila = this.listado.length;
    this.blnFilaAniadidaSinGuardar = true;
    this.listado.push(mezcla);
  }

  ordenTrabajoAutocomplete(event) {
    this.ordenTrabajoService.autocomplete(event.query).subscribe({
      next: res => {
        this.listadoOrdenesTrabajo = res;
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  setOrdenTrabajo(event, i: number) {
    this.listado[i].listadoAutocompleteAux = event.detalle;
  }

  findProducto(event, i: number) {
    let term: string = event.query;
    this.listado[i].listadoAutocompleteAux = this.listado[i].ordenTrabajo.detalle.filter(otd => otd.ordenVentaDetalle.producto.nombre.toUpperCase().includes(term.toUpperCase()))
  }

  guardar(i) {
    let vib: ProduccionAccesorioRegistroVibracion = this.listado[i];

    if(!vib.ordenTrabajo || typeof(vib.ordenTrabajo) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar una orden de trabajo del autocompletado.'})
      return;
    }

    if(!vib.ordenTrabajoDetalle || typeof(vib.ordenTrabajoDetalle) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar un producto del autocompletado.'})
      return;
    }

    if(!vib.estadoMaquina) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar el estado de la máquina.'})
      return;
    }

    if(!vib.indConforme && (!vib.observacion || vib.observacion.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Para una salida inconforme debe ingresar una observación.'})
      return;
    }

    this.formatoService.saveRegistroVibracionAccesorio(this.usuarioPlanta.planta.id, vib).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro de curado guardado correctamente.'});
        this.blnFilaAniadidaSinGuardar = false;
        this.validarFila = -1;
        this.setListado()
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

}
