import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../models/user.model';
import {catchError} from 'rxjs/operators';
import {ForbiddenError} from '../../errors/forbidden-error';
import {AppError} from '../../errors/app-error';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
  user$: Observable<User>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private toasts: ToastService
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.auth.me()
      .pipe(catchError((err: AppError) => {
        if (err instanceof ForbiddenError) {
          return this.logout().then(() => null);
        }
      }));
  }

  openModal(content) {
    return this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result;
  }

  closeModal(modal: NgbModalRef) {
    modal.dismiss();
  }

  logout() {
    this.auth.logout();
    return this.router.navigate(['/']);
  }
}
