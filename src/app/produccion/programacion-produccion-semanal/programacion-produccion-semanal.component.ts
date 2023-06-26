import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { PlantaService } from 'src/app/maestros/planta.service';
import { ProgramacionSemanalPlanta } from '../models/programacion-semanal-planta';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { ProgramacionDiariaHistorico } from '../models/programacion-diaria-historico';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { ProgramacionSemanal } from '../models/programacion-semanal';
import { ProgramacionSemanalPlantaCliente } from '../models/programacion-semanal-planta-cliente';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { OrdenTrabajoService } from '../orden-trabajo.service';
import { OrdenTrabajo } from '../models/orden-trabajo';
import { MessageService } from 'primeng/api';
import { ProgramacionSemanalService } from '../programacion-semanal.service';
import { ProgramacionSemanalVigencia } from '../models/programacion-semanal-vigencia';
import { AuthService } from 'src/app/seguridad/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-programacion-produccion-semanal',
  templateUrl: './programacion-produccion-semanal.component.html',
  styleUrls: ['./programacion-produccion-semanal.component.css']
})
export class ProgramacionProduccionSemanalComponent implements OnInit {

  vigente: ProgramacionSemanalVigencia = new ProgramacionSemanalVigencia();

  progSem: ProgramacionSemanal = new ProgramacionSemanal();
  dias: Date[] = [];
  diasAux: TablaAuxiliarDetalle[];

  ordenesTrabajoAutocomplete: OrdenTrabajo[];

  validarFila: number[] = [];

  constructor(
    private authService: AuthService,
    private plantaService: PlantaService,
    private programacionService: ProgramacionSemanalService,
    private auxiliarService: AuxiliarService,
    private otService: OrdenTrabajoService,
    private messageService: MessageService,
    private funcionesComunes: FuncionesComunesService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.activatedRouter.params.subscribe(param => {
      this.vigente.id = +param['id'];

      if(this.vigente.id == 0) {

        let fechaStr: string = this.funcionesComunes.getNextMonday();
    
        this.progSem.fechaInicio = new Date(`${fechaStr} 00:00:00.000000`);
    
        while((new Date(`${fechaStr} 00:00:00.000000`)).getDay() < 6) {
          this.dias.push(new Date(`${fechaStr} 00:00:00.000000`));

          fechaStr = this.funcionesComunes.agregarDias(fechaStr, 1);
    
          if((new Date(`${fechaStr} 00:00:00.000000`)).getDay() == 6) {
            this.dias.push(new Date(`${fechaStr} 00:00:00.000000`));
            this.progSem.fechaFin = new Date(`${fechaStr} 00:00:00.000000`);
          }
        }
    
        let fork = forkJoin([
          this.auxiliarService.getListSelect('TIPDIA'),
          this.plantaService.getPlantasActivas(),
        ])
    
        fork.subscribe({
          next: res => {
            this.diasAux = res[0];
            res[1].forEach(pl => {
              let newProgPlanta: ProgramacionSemanalPlanta = new ProgramacionSemanalPlanta();
    
              newProgPlanta.planta = pl;
    
              this.progSem.detallePlantas.push(newProgPlanta);
              this.validarFila.push(-1)
            })
          }
        })

      } else {
    
        let fork = forkJoin([
          this.auxiliarService.getListSelect('TIPDIA'),
          this.programacionService.getVigenciaById(this.vigente.id)
        ])
    
        fork.subscribe({
          next: res => {
            this.diasAux = res[0];

            this.dias = res[1].versionesProgramacionSemanal.find(ps => ps.version == res[1].version).detallePlantas[0].detalleCliente[0].detalleDiarios.map(d => new Date(`${d.fecha} 00:00:00.0000`));
            
            this.vigente = res[1];
            this.progSem = JSON.parse(JSON.stringify(this.vigente.versionesProgramacionSemanal.find(ps => ps.version == res[1].version)));
            this.progSem.id = 0; 
          }
        })
      }
    })
  }

  setOrdenTrabajoByAutocomplete(event, i, j) {
    
  }

  autocompleteOrdenTrabajo(event) {
    this.otService.autocomplete(event.query).subscribe({
      next: res => {
        this.ordenesTrabajoAutocomplete = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  addProgramacion(indexPlanta: number) {
    let progSemPlanCliente: ProgramacionSemanalPlantaCliente = new ProgramacionSemanalPlantaCliente();

    this.dias.forEach(d => {
      let progDiaria: ProgramacionDiariaHistorico = new ProgramacionDiariaHistorico();

      progDiaria.fecha = d;
      progDiaria.dia = this.diasAux.find(td => +td.observacion == d.getDay())

      progSemPlanCliente.detalleDiarios.push(progDiaria);

    })

    this.progSem.detallePlantas[indexPlanta].detalleCliente.push(progSemPlanCliente);
  }

  calcularProgramacionChangeProduct(event, i: number, j: number) {
    let progSemN: number = 0;
    let valor = event.value;
    let asignacion: number = this.progSem.detallePlantas[i].detalleCliente[j].vueltasMolde*this.progSem.detallePlantas[i].detalleCliente[j].cantidadMoldes;
    let pendiente: number = Number(valor.cantidadPendiente);

    this.progSem.detallePlantas[i].detalleCliente[j].detalleDiarios.forEach(d => {

      if(pendiente - asignacion >= 0) {
        d.cantidadProgramada = asignacion;
      } else if (pendiente - asignacion < 0) {
        d.cantidadProgramada = pendiente
      } 

      pendiente = pendiente - d.cantidadProgramada;

      progSemN = progSemN + d.cantidadProgramada;
    })

    this.progSem.detallePlantas[i].detalleCliente[j].cantidadProgramada = progSemN;
  }

  calcularProgramacion(event, ind: number, i: number, j: number) {
    let progSemN: number = 0;
    let valor = event.value;
    let asignacion: number;
    let pendiente: number = Number(this.progSem.detallePlantas[i].detalleCliente[j].cantidadPendiente);

    (ind == 1)?asignacion=this.progSem.detallePlantas[i].detalleCliente[j].vueltasMolde*valor:asignacion=this.progSem.detallePlantas[i].detalleCliente[j].cantidadMoldes*valor;

    this.progSem.detallePlantas[i].detalleCliente[j].detalleDiarios.forEach(d => {

      if(pendiente - asignacion >= 0) {
        d.cantidadProgramada = asignacion;
      } else if (pendiente - asignacion < 0) {
        d.cantidadProgramada = pendiente
      } 

      pendiente = pendiente - d.cantidadProgramada;

      progSemN = progSemN + d.cantidadProgramada;
    })

    this.progSem.detallePlantas[i].detalleCliente[j].cantidadProgramada = progSemN;
  }

  selectRow(i: number, j: number) {
    this.validarFila[i] = j;
  }

  quitar(i,j) {
    this.progSem.detallePlantas[i].detalleCliente = this.progSem.detallePlantas[i].detalleCliente.filter((cl, k) => k != j)
  }

  setProducto(event, i: number, j: number) {
    if(this.progSem.detallePlantas[i].detalleCliente.find((cl, k) => cl.ordenTrabajoDetalle.ordenVentaDetalle.id == event.value.ordenVentaDetalle.id && j != k)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Ya existe una registro de este producto de la orden seleccionada en esta planta.'});
      setTimeout(()=> {
        this.progSem.detallePlantas[i].detalleCliente[j].ordenTrabajoDetalle = null;
      }, 100)
      return;
    }

    let cntProgramadaActual: number = 0;

    this.progSem.detallePlantas.forEach(pl => {
      pl.detalleCliente.forEach(cl => {
        if(cl.ordenTrabajoDetalle.ordenVentaDetalle.id == event.value?.ordenVentaDetalle.id) {
          cntProgramadaActual = Number(cntProgramadaActual) + Number(cl.cantidadProgramada);
        }

      })
    })

    this.progSem.detallePlantas[i].detalleCliente[j].cantidadPendiente = event.value.cantidadPendiente - cntProgramadaActual;

    this.calcularProgramacionChangeProduct(event, i, j);
  }

  guardar() {
    let blnValido: boolean = true;
    this.progSem.detallePlantas.forEach(pl => {
      if(pl.detalleCliente.length == 0) {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:`La ${pl.planta.nombre} no tiene trabajos asignados.`});
        blnValido = false;
      }

      pl.detalleCliente.forEach((cl, i) => {

        if(!cl.ordenTrabajo) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:`El registro número ${i+1} en la ${pl.planta.nombre} no tiene una orden de trabajo asignado.`});
          blnValido = false;
        }

        if(!cl.ordenTrabajoDetalle) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:`El registro número ${i+1} en la ${pl.planta.nombre} no tiene un producto asignado.`});
          blnValido = false;
        }

        let concatenado: number = Number(cl.detalleDiarios.map(di => di.cantidadProgramada).join(''))

        if(concatenado == 0) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:`El registroen la ${pl.planta.nombre} de la orden de trabajo ${cl.ordenTrabajo.codigo} del producto ${cl.ordenTrabajoDetalle.ordenVentaDetalle.producto.resumen} no tiene trabajos asignados en la semana.`});
          blnValido = false;
        }
      })
    })

    if(!blnValido) {
      return;
    }

    this.progSem.idUsuarioCrea = this.authService.usuario.id;
    this.progSem.fechaCrea = new Date();

    this.progSem.detallePlantas.forEach(pl => {
      pl.idUsuarioCrea = this.authService.usuario.id;
      pl.fechaCrea = new Date();
    })

    this.progSem.version = this.vigente.versionesProgramacionSemanal.length + 1;

    this.vigente.versionesProgramacionSemanal.push(this.progSem);
    this.vigente.version = this.vigente.versionesProgramacionSemanal.length;

    if(this.vigente.id == 0) {
    
      this.programacionService.guardarProgramacionSemanal(this.vigente).subscribe({
        next: res => {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Programación guardada correctamente.'});
          this.router.navigate(['/produccion/programacion-semanal/listado']);
          return;
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
          }
        }
      })

    } else {
      
      this.vigente.versionesProgramacionSemanal.forEach(ps => {
        ps.detallePlantas.forEach(pl => {
          pl.id = 0;
          pl.detalleCliente.forEach(cl => {
            cl.id = 0;
            cl.detalleDiarios.forEach(di => {
              di.id = 0;
            })
          })
        })
      })
    
      this.programacionService.actualizarProgramacionSemanal(this.vigente).subscribe({
        next: res => {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Programación guardada correctamente.'});
          this.router.navigate(['/produccion/programacion-semanal/listado']);
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

}