import { Component, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { CustomValidators } from "./custom-validators";
import { CommonModule } from "@angular/common";
import { BankService } from "../bank.service";
import { Subject, take, takeUntil } from "rxjs";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss"
})
export class ProductComponent implements OnDestroy {
  productForm: FormGroup;
  destroyed$: Subject<boolean> = new Subject();

  constructor(private bankService: BankService) {
    this.productForm = new FormGroup(
      {
        id: new FormControl("", [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ]),
        name: new FormControl("", [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]),
        description: new FormControl("", [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ]),
        logo: new FormControl("", Validators.required),
        date_release: new FormControl("", [
          Validators.required,
          CustomValidators.dateMinimum(new Date())
        ]),
        date_revision: new FormControl({ value: "", disabled: true }, [
          Validators.required
        ])
      },
      CustomValidators.dateReleaseAndRevisionValidator
    );

    this.productForm
      .get("date_release")
      ?.statusChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        if (status === "VALID") {
          this.productForm.get("date_revision")?.enable();
        } else {
          this.productForm.get("date_revision")?.disable();
        }
      });
  }

  onSubmit() {
    this.bankService
      .updateProduct(this.productForm.value)
      .pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
  onReset() {
    this.productForm.reset();
  }
}
