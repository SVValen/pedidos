import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Pedido } from '../share/pedido';
import { PedidosService} from '../share/pedidos.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { Cliente } from '../share/cliente';
import { ClienteService } from '../share/cliente.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  items : Pedido[] = [];
  seleccionado = new Pedido();

  columnas: string[] =  ['pediId', 'pediFecha', 'clienNombre', 'acciones'];
  dataSource = new MatTableDataSource<Pedido>();

  form = new FormGroup({});

  mostrarFormulario = false;

  cliente: Cliente[] = [];

  minDate: Date = new Date();
  
  constructor(
    private pedidoService: PedidosService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      pediId: [''],
      pediFecha: [''],
      pediClienId: [''],
      pediFechaAlta: [''],
      pediBorrado: [''],
      clienNombre: ['']
    })

    this.getPedidos();
    this.getCliente();
  }

  getPedidos(): void {
    this.pedidoService.get().subscribe(
      (pedidos) => {
        this.items = pedidos;
        this.actualizarTabla();
      }
    )
  }

  getCliente() {
    this.clienteService.get().subscribe(
      (cliente) => {
        this.cliente = cliente;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.sort = this.sort;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new Pedido();
    this.mostrarFormulario = true;
  }

  delete(row: Pedido) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.pedidoService.delete(row.pediId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.items = this.items.filter((item) => {
              if (item.pediId != row.pediId) {
                return true
              } else {
                return false
              }
            });

            this.actualizarTabla();
          });
      }
    });
  }

  edit(seleccionado: Pedido) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    //si hay q agregar uno x uno
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;

    if (this.seleccionado.pediId) {
      this.pedidoService.put(this.seleccionado)
        .subscribe((pedido) => {
          //this.mostrarFormulario = false;
        });

    } else {
      this.pedidoService.post(this.seleccionado)
        .subscribe((pedido: Pedido) => {
          pedido.clienNombre = this.cliente.find(c => c.clienId == pedido.pediClienId)!.clienNombre;
          this.items.push(pedido);
          //this.mostrarFormulario = false;
          this.actualizarTabla();
        })
    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  }
