import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Cliente } from '../share/cliente';
import { ClienteService } from '../share/cliente.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  items : Cliente[] = [];
  seleccionado = new Cliente();

  columnas: string[] = ['clienId','clienNombre','clienDireccion','clienFechaAlta','acciones'];
  dataSource = new MatTableDataSource<Cliente>();

  form = new FormGroup({});

  mostrarFormulario = false;

  constructor(
    private clienteservice: ClienteService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      clienId: [''],
      clienNombre: [''],
      clienDireccion: ['', Validators.required],
      clienBorrado: [''],
      clienFechaAlta: ['']
    })

    this.getClientes();
  }

  getClientes(): void{
    this.clienteservice.get().subscribe(
      (clientes) => {
        this.items = clientes;
        this.actualizarTabla();
      }
    )
  }

  actualizarTabla(){
    this.dataSource.data = this.items;
    this.dataSource.sort = this.sort;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new Cliente();
    this.mostrarFormulario = true;
  }

  delete(row: Cliente) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.clienteservice.delete(row.clienId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.items = this.items.filter((item) => {
              if (item.clienId != row.clienId) {
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

  edit(seleccionado: Cliente) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if (this.seleccionado.clienId) {
      this.clienteservice.put(this.seleccionado)
        .subscribe((cliente) => {
          this.mostrarFormulario = false;
        });
    }else {
      this.clienteservice.post(this.seleccionado)
        .subscribe((cliente) => {   
          this.mostrarFormulario = false;
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