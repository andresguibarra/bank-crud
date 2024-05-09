import { Component, OnDestroy } from "@angular/core";
import { Subject, take, takeUntil } from "rxjs";
import { FinancialProduct, BankService } from "../bank.service";
import { CommonModule } from "@angular/common";
import { ValidateUrlPipe } from "../valid-url.pipe";
import { Router } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-products-list",
  standalone: true,
  imports: [CommonModule, ValidateUrlPipe, ReactiveFormsModule],
  templateUrl: "./products-list.component.html",
  styleUrl: "./products-list.component.scss",
  providers: [BankService]
})
export class ProductsListComponent implements OnDestroy {
  financialProducts: FinancialProduct[] = [];
  fullFinancialProducts: FinancialProduct[] = [];
  searchControl: FormControl = new FormControl();
  destroyed$: Subject<boolean> = new Subject();

  constructor(readonly bankService: BankService, private router: Router) {}

  ngOnInit(): void {
    this.bankService
      .getFinancialProducts()
      .pipe(take(1))
      .subscribe(
        (financialProducts) =>
          (this.fullFinancialProducts = this.financialProducts =
            financialProducts)
      );
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.onSearch.bind(this));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  onAdd(): void {
    this.router.navigate(["products"]);
  }

  onSearch(value: string): void {
    console.log(value);
    if (value === "") {
    }

    this.financialProducts = this.fullFinancialProducts.filter((fp) =>
      fp.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
    );
  }
}
