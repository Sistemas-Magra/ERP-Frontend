import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProduccionRegistroCentrifugado } from '../../../models/produccion-registro-centrifugado';
import { OrdenTrabajoService } from '../../../orden-trabajo.service';
import { MessageService } from 'primeng/api';
import { OrdenTrabajo } from '../../../models/orden-trabajo';
import { FormatosService } from '../../../formatos.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { forkJoin } from 'rxjs'
import { AuthService } from 'src/app/seguridad/auth.service';
import { UsuarioService } from 'src/app/seguridad/usuario.service';
import { UsuarioPlanta } from 'src/app/seguridad/models/usuario-planta';

@Component({
  selector: 'app-formato-centrifugado',
  templateUrl: './formato-centrifugado.component.html',
  styleUrls: ['./formato-centrifugado.component.css']
})
export class FormatoCentrifugadoComponent implements OnInit {

  usuarioPlanta: UsuarioPlanta;

  listado: ProduccionRegistroCentrifugado[] = [];

  fecha: Date = new Date();
  responsable: string;

  listadoOrdenesTrabajo: OrdenTrabajo[];

  estadoMaquinaSelect: TablaAuxiliarDetalle[];
  velocidadMaquinaSelect: TablaAuxiliarDetalle[] = [];

  validarFila: number = -1;
  blnFilaAniadidaSinGuardar: boolean = false;

  constructor(
    private messageService: MessageService,
    private ordenTrabajoService: OrdenTrabajoService,
    private auxiliarService: AuxiliarService,
    private formatoService: FormatosService,
    private funcionesComunes: FuncionesComunesService,
    private pipe: DatePipe,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {

    let fork = forkJoin([
      this.auxiliarService.getListSelect('ESTMAQ'),
      this.auxiliarService.getListSelect('VELCEN'),
      this.usuarioService.getUsuarioPlantaByUsuarioId(this.authService.usuario.id)
    ])

    fork.subscribe({
      next: res => {
        this.estadoMaquinaSelect = res[0];
        this.velocidadMaquinaSelect = res[1];
        this.usuarioPlanta = res[2];
        this.responsable = this.authService.usuario.nombreCompleto;
        this.setListado();
      }
    })

  }

  setListado() {
    this.formatoService.getListadoFormato(this.usuarioPlanta.planta.id, 4).subscribe({
      next: res => {
        if(res.listado) {
          let list: ProduccionRegistroCentrifugado[];

          list = res.listado;

          list.forEach(cent => {
            cent.listadoVelocidades = JSON.parse(cent.tiempoVelocidades);
          })

          this.listado = list;
        } else {
          this.listado = [];
        }
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'});
        }
      }
    });

  }

  asignarFila(i: number) {
    if(this.blnFilaAniadidaSinGuardar) {
      return;
    }
    
    this.validarFila = i;
  }

  addRegistro() {
    if(this.blnFilaAniadidaSinGuardar) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe terminar de guardar el registro para añadir otro.'});
      return;
    }
    
    let cent: ProduccionRegistroCentrifugado = new ProduccionRegistroCentrifugado();

    cent.indConforme = true;
    cent.responsable = this.responsable;

    this.velocidadMaquinaSelect.forEach(vel => {
      cent.listadoVelocidades.push({id: vel.tablaAuxiliarDetalleId.id, minutos:0})
    })

    this.validarFila = this.listado.length;
    this.blnFilaAniadidaSinGuardar = true;
    this.listado.push(cent);
  }

  ordenTrabajoAutocomplete(event) {
    this.ordenTrabajoService.autocomplete(event.query).subscribe({
      next: res => {
        this.listadoOrdenesTrabajo = res;
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'});
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

  guardar(i) {
    let cent: ProduccionRegistroCentrifugado = this.listado[i];

    if(!cent.ordenTrabajo || typeof(cent.ordenTrabajo) == "string") {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una orden de trabajo del autocompletado.'});
      return;
    }

    if(!cent.ordenTrabajoDetalle || typeof(cent.ordenTrabajoDetalle) == "string") {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un producto del autocompletado.'});
      return;
    }

    if(!cent.horaIngreso) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar la hora en el que el poste ha ingresado a la centrifugadora.'});
      return;
    }

    if(!cent.horaSalida) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar la hora en el que el poste ha salido de la centrifugadora.'});
      return;
    }

    if(cent.minutosTotal <= 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'La hora de salida debe ser mayor que la hora de ingreso.'});
      return;
    }

    let sumaTiempos: number = 0;

    cent.listadoVelocidades.forEach(vel => {
      sumaTiempos += Number(vel.minutos);
    })

    if(sumaTiempos != cent.minutosTotal) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'El tiempo total de las velocidades debe coincidir con el tiempo en el que el poste estuvo en la máquina.'});
      return;
    }

    if(!cent.estadoMaquina) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el estado de la máquina.'});
      return;
    }

    if(!cent.indConforme && (!cent.observacion || cent.observacion.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Para una salida inconforme debe ingresar una observación.'})
      return;
    }

    cent.tiempoVelocidades = JSON.stringify(cent.listadoVelocidades)

    this.formatoService.saveRegistroCentrifugado(this.usuarioPlanta.planta.id, cent).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro de centrifugado guardado correctamente.'});
        this.blnFilaAniadidaSinGuardar = false;
        this.validarFila = -1;
        this.setListado();
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
