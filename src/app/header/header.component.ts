import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { AuthService } from '../seguridad/auth.service';
import { Usuario } from '../seguridad/models/usuario';
import { Modulo } from '../seguridad/models/modulo';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  itemsButton: MenuItem[];
  modulos: MenuItem[] = [];
  usuario: Usuario;

  visibleBar: boolean = false;
  titulo: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    const navEndEvents$ = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) =>{
      this.titulo = this.route.root.firstChild.snapshot.data['menu']?this.route.root.firstChild.snapshot.data['menu']:'';
    })
  }

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
    let modulos: Modulo[] = this.authService.modulos;

    this.router.events.subscribe((val) => {
      this.usuario = this.authService.usuario;
    });

    this.itemsButton = [
      {
        label:'Mi Perfil',
        routerLink: ['/user/miperfil']
      },
      {
        label:'Cerrar Sesion',
        command: () => {
            this.logout();
        }
      }
    ];

    /*TODO: Adaptar los modulos del backend a la estructura de los MenuItem del PrimeNG*/
      modulos = this.authService.modulos;

      modulos.forEach(m => {
        let subModulos: MenuItem[] = [];

        m.subModulos.forEach(sm => {
          let menus: MenuItem[] = [];

          sm.menus.forEach(me => {
            menus.push({label: me.nombre, routerLink: me.ruta})
          })
          
          let subModulo: MenuItem = {label: sm.nombre, items: menus}

          subModulos.push(subModulo);
        })

        let modulo: MenuItem = {label: m.nombre, items: subModulos}

        this.modulos.push(modulo);

      })
  }

  verBar() {
    this.visibleBar = !this.visibleBar
  }

  closeSideBar() {
    this.visibleBar = false;
  }

  isAuthenticated():boolean{
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}