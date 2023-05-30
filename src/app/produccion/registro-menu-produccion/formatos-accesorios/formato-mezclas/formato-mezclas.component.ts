import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { FormatosService } from 'src/app/produccion/formatos.service';
import { OrdenTrabajo } from 'src/app/produccion/models/orden-trabajo';
import { ProduccionAccesorioRegistroMezcla } from 'src/app/produccion/models/produccion-accesorio-registro-mezcla';
import { OrdenTrabajoService } from 'src/app/produccion/orden-trabajo.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/seguridad/auth.service';
import { UsuarioService } from 'src/app/seguridad/usuario.service';
import { forkJoin } from 'rxjs';
import { UsuarioPlanta } from 'src/app/seguridad/models/usuario-planta';

@Component({
  selector: 'app-formato-mezclas',
  templateUrl: './formato-mezclas.component.html',
  styleUrls: ['./formato-mezclas.component.css']
})
export class FormatoMezclasComponent implements OnInit {

  usuarioPlanta: UsuarioPlanta;

  listado: ProduccionAccesorioRegistroMezcla[] = [];

  fecha: Date = new Date();
  responsable: string;

  listadoOrdenesTrabajo: OrdenTrabajo[];

  validarFila: number = -1;
  blnFilaAniadidaSinGuardar: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private messageService: MessageService,
    private ordenTrabajoService: OrdenTrabajoService,
    private formatoService: FormatosService,
    private pipe: DatePipe,
    private funcionesComunes: FuncionesComunesService
  ) { }

  ngOnInit(): void {

    let fork = forkJoin([
      this.usuarioService.getUsuarioPlantaByUsuarioId(this.authService.usuario.id)
    ])

    fork.subscribe({
      next: res => {
        this.usuarioPlanta = res[0];
        this.responsable = this.authService.usuario.nombreCompleto;
        this.setListado();
      }
    })
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

    let mezcla: ProduccionAccesorioRegistroMezcla = new ProduccionAccesorioRegistroMezcla();

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

  setListado() {
    this.formatoService.getListadoFormato(this.usuarioPlanta.planta.id, 7).subscribe({
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

  setOrdenTrabajo(event, i: number) {
    this.listado[i].listadoAutocompleteAux = event.detalle;
  }

  findProducto(event, i: number) {
    let term: string = event.query;
    this.listado[i].listadoAutocompleteAux = this.listado[i].ordenTrabajo.detalle.filter(otd => otd.ordenVentaDetalle.producto.nombre.toUpperCase().includes(term.toUpperCase()))
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

  guardarMezcla(i: number) {
    let mezcla: ProduccionAccesorioRegistroMezcla = this.listado[i];

    if(!mezcla.ordenTrabajo || typeof(mezcla.ordenTrabajo) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar una orden de trabajo del autocompletado.'})
      return;
    }

    if(!mezcla.ordenTrabajoDetalle || typeof(mezcla.ordenTrabajoDetalle) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar un producto del autocompletado.'})
      return;
    }

    if(!mezcla.bolsasCemento) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar la cantidad de bolsas usadas en la mezcla.'})
      return;
    }

    if(!mezcla.carretillaPiedra) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar la cantidad de carretillas de piedra usadas en la mezcla.'})
      return;
    }

    if(!mezcla.carretillaArena) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar la cantidad de carretillas de arena usadas en la mezcla.'})
      return;
    }

    if(!mezcla.tipoCemento) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar el número del tipo de cemento usado en la mezcla.'})
      return;
    }

    if(!mezcla.litrosAgua) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar los litros de agua usados en la mezcla.'})
      return;
    }

    if(!mezcla.horaIngreso) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar la hora de ingreso de la mezcla.'})
      return;
    }

    if(!mezcla.horaSalida) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar la hora de salida de la mezcla.'})
      return;
    }

    if(mezcla.minutosTotal <= 0) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'La hora de salida de la mezcla debe ser mayor a la hora de ingreso.'})
      return;
    }

    if(!mezcla.indConforme && (!mezcla.observacion || mezcla.observacion.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Para una salida inconforme debe ingresar una observación.'})
      return;
    }

    this.formatoService.saveRegistroMezclaAccesorio(this.usuarioPlanta.planta.id, mezcla).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro de mezcla guardado correctamente.'});
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
