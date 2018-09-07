import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.action';
import { SetUserAction, UnSetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor(private spinnerService: Ng4LoadingSpinnerService,
              private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      if (fbUser) {
        this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
          .subscribe( (userObj: any) => {
            const newUser = new User(userObj);
            this.store.dispatch(new SetUserAction(newUser));
            this.usuario = newUser;
          });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario ( nombre: string, email: string, password: string ) {
    this.spinnerService.show();
    this.store.dispatch( new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword( email, password )
    .then( response => {
      console.log(response);
      const user: User = {
        uid: response.user.uid,
        nombre: nombre,
        email: response.user.email
      };
      this.afDB.doc(`${ user.uid }/usuario`).set( user ).then( () => {
        this.router.navigate(['/']);
        this.store.dispatch(new DesactivarLoadingAction());
        this.spinnerService.hide();
      });
    }).catch( error => {
      console.log(error);
      this.store.dispatch(new DesactivarLoadingAction());
      this.spinnerService.hide();
      Swal('Error al crear Usuario', error.message, 'error');
    });
  }

  login(email: string, password: string) {
    this.spinnerService.show();
    this.store.dispatch( new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password )
    .then( response => {
      console.log(response);
      this.router.navigate(['/']);
      this.store.dispatch(new DesactivarLoadingAction());
      this.spinnerService.hide();
    })
    .catch( error => {
      console.log(error);
      this.store.dispatch(new DesactivarLoadingAction());
      this.store.dispatch(new UnSetUserAction());
      this.spinnerService.hide();
      Swal('Error en el login', error.message, 'error');
    });
  }

  logOut() {
    this.afAuth.auth.signOut()
      .then( () => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(['/login']);
        this.store.dispatch( new UnSetUserAction);
      }).catch( error => {
        this.store.dispatch(new DesactivarLoadingAction());
        Swal('Error al cerrar sesion', error.message, 'error');
      });
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map(fbUser => {
        if (fbUser == null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;
      })
    );
  }

  getUser() {
    return {...this.usuario};
  }

}
