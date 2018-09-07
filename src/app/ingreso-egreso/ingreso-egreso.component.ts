import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import { ToastService } from '../toast.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.action';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  formIngresoEgreso: FormGroup;
  tipo = 'ingreso';
  loadingSubs: Subscription = new Subscription();
  loading: boolean;

  constructor(private spinnerService: Ng4LoadingSpinnerService,
              public ingresoEgresoService: IngresoEgresoService,
              private snfyService: ToastService,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui').subscribe( ui => {
      this.loading = ui.isLoading;
    });
    this.crearFormIngresoEgreso();
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

  crearFormIngresoEgreso() {
    this.formIngresoEgreso = new FormGroup({
      'descripcion': new FormControl('', Validators.required),
      'monto': new FormControl(1, Validators.min(1))
    });
  }

  crearIngresoEgreso() {
    this.spinnerService.show();
    this.store.dispatch( new ActivarLoadingAction());
    const ingresoEgreso = new IngresoEgreso({ ...this.formIngresoEgreso.value, tipo: this.tipo});
    console.log(ingresoEgreso);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.formIngresoEgreso.reset({
          monto: 1
        });
        this.spinnerService.hide();
        this.store.dispatch(new DesactivarLoadingAction());
        this.snfyService.toastSuccess(" Guardado con Exito!")  ;
      }).catch(error => {
        this.spinnerService.hide();
        this.snfyService.toastError("Error al Guardar");
      });
  }

}
