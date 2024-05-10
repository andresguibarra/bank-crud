import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, take, takeUntil } from "rxjs";
import { FinancialProduct, BankService } from "../bank.service";
import { CommonModule } from "@angular/common";
import { ValidateUrlPipe } from "../valid-url.pipe";
import { Router } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

type ViewFinancialProduct = {
  showMenu?: boolean;
} & FinancialProduct;

@Component({
  selector: "app-products-list",
  standalone: true,
  imports: [CommonModule, ValidateUrlPipe, ReactiveFormsModule],
  templateUrl: "./products-list.component.html",
  styleUrl: "./products-list.component.scss",
  providers: [BankService]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  financialProducts: ViewFinancialProduct[] = [];
  fullFinancialProducts: ViewFinancialProduct[] = [];
  searchControl: FormControl = new FormControl();
  destroyed$: Subject<boolean> = new Subject();
  selectedToRemoveFinancialProduct: ViewFinancialProduct | null = null;
  itemsToShow: number = 5;

  constructor(readonly bankService: BankService, private router: Router) {}

  ngOnInit(): void {
    this.loadFinancialProducts();
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.onSearch.bind(this));
  }

  loadFinancialProducts(): void {
    this.bankService
      .getFinancialProducts()
      .pipe(take(1))
      .subscribe((financialProducts) => {
        this.fullFinancialProducts = financialProducts;
        this.updateProductsList();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onItemsToShowChange(items: number): void {
    this.itemsToShow = items;
    this.updateProductsList();
  }

  onSearch(value: string): void {
    this.updateProductsList();
  }

  updateProductsList(): void {
    const searchValue = this.searchControl.value?.toLowerCase() || "";
    const filteredProducts = this.fullFinancialProducts.filter((fp) =>
      fp.name.toLowerCase().startsWith(searchValue)
    );
    this.financialProducts = filteredProducts.slice(0, this.itemsToShow);
  }

  onAdd(): void {
    this.router.navigate(["products"]);
  }

  onEdit(financialProduct: ViewFinancialProduct): void {
    this.router.navigate(["products", financialProduct.id]);
  }

  onDelete(financialProduct: ViewFinancialProduct): void {
    this.selectedToRemoveFinancialProduct = financialProduct;
  }

  cancelDelete(): void {
    if (this.selectedToRemoveFinancialProduct) {
      this.selectedToRemoveFinancialProduct.showMenu = false;
      this.selectedToRemoveFinancialProduct = null;
    }
  }

  confirmDelete(): void {
    if (this.selectedToRemoveFinancialProduct) {
      this.selectedToRemoveFinancialProduct.showMenu = false;
      this.bankService
        .deleteProduct(this.selectedToRemoveFinancialProduct.id)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loadFinancialProducts();
            this.selectedToRemoveFinancialProduct = null;
          }
        });
    }
  }
}
