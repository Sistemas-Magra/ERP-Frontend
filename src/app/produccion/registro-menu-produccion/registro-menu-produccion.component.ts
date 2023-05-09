import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-menu-produccion',
  templateUrl: './registro-menu-produccion.component.html',
  styleUrls: ['./registro-menu-produccion.component.css']
})
export class RegistroMenuProduccionComponent implements OnInit {

  optionListPostes: any[] = [
    {title: 'MEZCLA', body: 'Formato de mezcla', route: 'mezcla'},
    {title: 'ESTRUCTURA', body: 'Formato de armado de estructura', route: 'estructura'},
    {title: 'TUBOS Y PINES', body: 'Formato de tubos y pines', route: 'tubos-pines'},
    {title: 'CENTRIFUGADO', body: 'Formato de centrifugado', route: 'centrifugado'},
    {title: 'DESENCROFADO', body: 'Formato de desencofrado', route: 'desencrofado'},
    {title: 'CURADO', body: 'Formato de curado', route: 'curado'}
  ]

  optionListAccesorios: any[] = [
    {title: 'Formato de mezcla'},
    {title: 'Formato de armado de estructura'},
    {title: 'Formato de tubos y pines'},
    {title: 'Formato de centrifugado'},
    {title: 'Formato de desencofrado'},
    {title: 'Formato de curado'}
  ]

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goTo(item: any) {
    this.router.navigate([`/produccion/formato/${item.route}`])
  }

}
