import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit,OnDestroy {

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService,
              private toastService: ToastService) { }

  items: IngresoEgreso[];
  subcription: Subscription = new Subscription();

  ngOnInit() {
    this.subcription = this.store.select('ingresoEgreso')
      .subscribe(ingresoEgreso => {
        this.items = ingresoEgreso.items;
      });
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

  borrarItem(item: IngresoEgreso) {
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
      .then( () => {
        this.toastService.toastSuccess("Se Borro el item Exitosamente!");
      })
      .catch(() => {
        this.toastService.toastError("Error al borrar ese item");
      });
  }

}
