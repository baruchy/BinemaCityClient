import {BsModalRef} from 'ngx-bootstrap/modal';

import {BsModalService} from 'ngx-bootstrap';
import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationModalComponent implements OnInit {
  public active = false;
  public body: string;
  public title: string;
  public onClose: Subject<boolean>;
  modalRef: BsModalRef;
  @ViewChild('modal', {static: false}) modal: TemplateRef<any>;

  public constructor(
    private modalService: BsModalService,
  ) {
  }

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  public showConfirmationModal(title: string, body: string): void {
    this.title = title;
    this.body = body;
    this.active = true;
    this.modalRef = this.modalService.show(this.modal);
  }

  public onConfirm(): void {
    this.active = false;
    this.onClose.next(true);
    this.modalRef.hide();
  }

  public onCancel(): void {
    this.active = false;
    this.onClose.next(false);
    this.modalRef.hide();
  }

  public hideConfirmationModal(): void {
    this.active = false;
    this.onClose.next(null);
    this.modalRef.hide();
  }

  openModal() {
    this.modalRef = this.modalService.show(this.modal);
  }
}
