import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/seguridad/auth.service';
import { UsuarioPlanta } from 'src/app/seguridad/models/usuario-planta';
import { UsuarioService } from 'src/app/seguridad/usuario.service';

@Component({
  selector: 'app-registro-menu-produccion',
  templateUrl: './registro-menu-produccion.component.html',
  styleUrls: ['./registro-menu-produccion.component.css']
})
export class RegistroMenuProduccionComponent implements OnInit {

  usuarioPlanta: UsuarioPlanta;

  optionListPostes: any[] = [
    {title: 'MEZCLA', body: 'Formato de mezcla', route: 'mezcla', nrosPlantas: [1,2,3,4]},
    {title: 'ESTRUCTURA', body: 'Formato de armado de estructura', route: 'estructura', nrosPlantas: [1,2,3,4]},
    {title: 'TUBOS Y PINES', body: 'Formato de tubos y pines', route: 'tubos-pines', nrosPlantas: [1,2,3,4]},
    {title: 'CENTRIFUGADO', body: 'Formato de centrifugado', route: 'centrifugado', nrosPlantas: [1,2,3,4]},
    {title: 'DESENCROFADO', body: 'Formato de desencofrado', route: 'desencrofado', nrosPlantas: [1,2,3,4]},
    {title: 'CURADO', body: 'Formato de curado', route: 'curado', nrosPlantas: [1,2,3,4]}
  ]

  optionListAccesorios: any[] = [
    {title: 'MEZCLA', body: 'Formato de mezcla', route: 'mezcla', nrosPlantas: [3]},
    {title: 'ARMADO', body: 'Formato de armado de estructura', route: 'armado', nrosPlantas: [3]},
    {title: 'VIBRACION', body: 'Formato de vibracion', route: 'vibracion', nrosPlantas: [3]},
    {title: 'ACABADO', body: 'Formato de acabados', route: 'acabado', nrosPlantas: [3]},
  ]

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioPlantaByUsuarioId(this.authService.usuario.id).subscribe({
      next: res => {
        this.usuarioPlanta = res;

        this.optionListPostes = this.optionListPostes.filter(op => op.nrosPlantas.includes(this.usuarioPlanta.planta.id));
        this.optionListAccesorios = this.optionListAccesorios.filter(op => op.nrosPlantas.includes(this.usuarioPlanta.planta.id));
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  goTo(item: any, term: string) {
    this.router.navigate([`/produccion/formato/${term}/${item.route}`])
  }

}
