import { Component, OnInit } from '@angular/core';
import { Formulario } from '../models/formulario';
import { OrdenTrabajo } from 'src/app/produccion/models/orden-trabajo';
import { OrdenTrabajoService } from 'src/app/produccion/orden-trabajo.service';
import { EmpresaTransporte } from 'src/app/transporte/models/empresa-transporte';
import { EmpresaTransporteService } from 'src/app/transporte/empresa-transporte.service';
import { forkJoin } from 'rxjs';
import { FormularioDetalle } from '../models/formulario-detalle';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { FormularioService } from '../formulario.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/seguridad/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';

@Component({
  selector: 'app-registro-formulario',
  templateUrl: './registro-formulario.component.html',
  styleUrls: ['./registro-formulario.component.css']
})
export class RegistroFormularioComponent implements OnInit {

  formulario: Formulario = new Formulario();

  indHoy: boolean;

  empresaTransporteSelect: EmpresaTransporte[];

  ordenesTrabajoAutocomplete: OrdenTrabajo[];

  estadoId: number = 1;

  blnSST: boolean = true;

  revisado: TablaAuxiliarDetalle;

  constructor(
    private otService: OrdenTrabajoService,
    private authService: AuthService,
    private empresaTransporteService: EmpresaTransporteService,
    private auxiliarService: AuxiliarService,
    private formularioService: FormularioService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.blnSST = ['ROLE_ASIST_SEGURIDAD', 'ROLE_SEGURIDAD'].every(rol => this.authService.usuario.rolesAuthorities.includes(rol));

    let hoy: Date = new Date();

    this.formulario.fecha =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1)

    let fork = forkJoin([
      this.empresaTransporteService.getAll(),
      this.auxiliarService.getDetalleById('ESTFRM', 1),
      this.auxiliarService.getDetalleById('ESTFRM', 3)
    ])

    fork.subscribe({
      next: res => {
        this.empresaTransporteSelect = res[0];

        this.activatedRoute.params.subscribe({
          next: params => {
            let id: number = +params['id'];
            if(id == 0){
              this.formulario.estado = res[1];
              this.estadoId = 1;
            } else {
              this.formularioService.getById(id).subscribe({
                next: resf => {
                  this.revisado = res[2];
                  this.formulario = resf;
                  this.estadoId = this.formulario.estado.tablaAuxiliarDetalleId.id;
                }
              })
            }
          }
        })
      }
    })
  }

  setIndCarga(i: number) {
    let blnCarga: boolean = this.formulario.detalle[i].indCarga;

    if(blnCarga == false) {
      this.formulario.detalle[i].cantidad = 0;
    }
  }

  setFecha() {
    if(this.indHoy) {
      this.formulario.fecha = new Date();
    } else {
      let hoy: Date = new Date();
  
      this.formulario.fecha =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1)

    }
  }

  setOrdenTrabajo(event) {
    let otSeleccionada: OrdenTrabajo = event;

    otSeleccionada.detalle.forEach(otd => {
      let formDetalle: FormularioDetalle = new FormularioDetalle();

      formDetalle.ordenTrabajoDetalle = otd;
      formDetalle.cantidadDisponible = otd.cantidadProducida - otd.cantidadDespachada;
      formDetalle.cantidadPendDespacho = otd.ordenVentaDetalle.cantidad - otd.cantidadDespachada;
      formDetalle.cantidadSolicitada = otd.ordenVentaDetalle.cantidad;

      this.formulario.detalle.push(formDetalle);
    })
  }

  searchOT(event) {
    this.otService.autocompletePedido(event.query).subscribe({
      next: res => {
        this.ordenesTrabajoAutocomplete = res;
      }
    })
  }

  setValueSuperficie(value: boolean) {
    if(!this.blnSST) {
      return;
    }
    
    this.formulario.indVerificacionSuperficie = value;
  }

  guardar() {
    if(!this.formulario.ordenTrabajo || typeof(this.formulario.ordenTrabajo)=="string"){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un pedido del listado.'});
      return;
    }

    if(!this.formulario.empresaTransporte) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una empresa de transportes.'});
      return;
    }

    if(!this.formulario.vehiculo) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un vehículo.'});
      return;
    }

    if(!this.formulario.conductor) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un conductor.'});
      return;
    }

    if(!this.formulario.destino || this.formulario.destino.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un destino.'});
      return;
    }

    if(this.formulario.detalle.find(d => d.indCarga && d.cantidad == 0)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar las cantidades faltantes de los productos marcados.'});
      return;
    }

    if(!this.formulario.cantReglas) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cantidad de listones.'});
      return;
    }

    if(!this.formulario.cantTacos) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cantidad de tacos.'});
      return;
    }

    if(!this.formulario.cantClavos) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cantidad de clavos.'});
      return;
    }console.log(this.formulario)

    if(this.formulario.id) {

      if(this.blnSST) {
        this.formulario.estado = this.revisado;
      }

      this.formularioService.update(this.formulario).subscribe({
        next: res => {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Formulario actualizado éxitosamente.'});
          this.router.navigate(['/despacho/listado-formulario'])
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail: err.error.mensaje});            
          }
        }
      })

    } else {

      this.formularioService.create(this.formulario).subscribe({
        next: res => {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Formulario registrado éxitosamente.'});
          this.router.navigate(['/despacho/listado-formulario'])
        }
      })

    }
  }

  anularEntrada(event) {
    event.preventDefault();
  }

}
