import { Component, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { CustomValidators } from "./custom-validators";
import { CommonModule } from "@angular/common";
import { BankService, FinancialProduct } from "../bank.service";
import { Subject, switchMap, take, takeUntil } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

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
  selectedProduct: FinancialProduct | undefined | null;

  constructor(private bankService: BankService, private route: ActivatedRoute, protected router: Router) {
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

    this.productForm
      .get("id")
      ?.valueChanges.pipe(
        takeUntil(this.destroyed$),
        switchMap((id) => this.bankService.validateProductExists(id))
      )
      .subscribe((productExists) => {
        const control = this.productForm.get("id");

        if (control && this.route.snapshot.params["id"] !== control.value) {
          if (!productExists) {
            const errors = control.errors;
            if (errors) {
              delete errors["invalidId"];
              if (Object.keys(errors).length === 0) {
                control.setErrors(null);
              } else {
                control.setErrors(errors);
              }
            }
          } else {
            control.setErrors({
              ...control.errors,
              invalidId: true
            });
          }
        }
      });

    this.route.params
      .pipe(switchMap(() => this.bankService.getFinancialProducts()))
      .subscribe((financialProducts) => {
        const id = this.route.snapshot.params["id"];
        if (id) {
          this.selectedProduct =
            financialProducts.find((fp) => fp.id === id) || null;
          if (this.selectedProduct) {
            this.productForm.patchValue({
              ...this.selectedProduct,
              date_release: this.formatDateForInput(
                this.selectedProduct.date_release
              ),
              date_revision: this.formatDateForInput(
                this.selectedProduct.date_revision
              )
            });
          }
        }
      });
  }

  formatDateForInput(dateString: string | Date): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.selectedProduct) {
      this.bankService
        .updateProduct(this.productForm.value)
        .pipe(take(1))
        .subscribe(() => this.router.navigate(['/products']));
    } else {
      this.bankService
        .createProduct(this.productForm.value)
        .pipe(take(1))
        .subscribe(() => this.router.navigate(['/products']));
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
  onReset() {
    this.productForm.reset();
  }
}
