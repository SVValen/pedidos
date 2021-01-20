import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

import { Producto } from '../share/producto';
import { ProductoService } from '../share/producto.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  items : Producto[] = [];
  seleccionado = new Producto();

  columnas: string[] =  ['prodId', 'prodDescripcion', 'prodPrecio', 'prodFechaAlta', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();

  form = new FormGroup({});

  mostrarFormulario = false;

  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      prodId: [''],
      prodDescripcion: ['', Validators.required],
      prodPrecio: ['',Validators.required],
      prodBorrado: [''],
      prodFechaAlta: ['']
    })

    this.getProductos();
  }

  getProductos(): void {
    this.productoService.get().subscribe(
      (productos) => {
        this.items = productos;
        this.actualizarTabla();
      }
    )
  } 

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.sort = this.sort;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new Producto();
    this.mostrarFormulario = true;
  }

  delete(row: Producto) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.productoService.delete(row.prodId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.items = this.items.filter((item) => {
              if (item.prodId != row.prodId) {
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

  edit(seleccionado: Producto) {
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

    if (this.seleccionado.prodId) {
      this.productoService.put(this.seleccionado)
        .subscribe((producto) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.productoService.post(this.seleccionado)
        .subscribe((producto) => {
          this.items.push(producto);
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

