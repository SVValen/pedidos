import { Component, OnInit } from '@angular/core';
import { Cliente } from '../share/cliente';
import { ClienteService } from '../share/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes : Cliente[] = [];

  constructor(
    private clienteservice: ClienteService
  ) { }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void{
    this.clienteservice.get().subscribe(
      (clientes) => {
        this.clientes = clientes;
      }
    )
  }
}
