import { Component } from "@angular/core";
import { take } from "rxjs";
import { FinancialProduct, BankService } from "../bank.service";
import { CommonModule } from "@angular/common";
import { ValidateUrlPipe } from "../valid-url.pipe";
import { Router } from "@angular/router";

@Component({
  selector: "app-products-list",
  standalone: true,
  imports: [CommonModule, ValidateUrlPipe],
  templateUrl: "./products-list.component.html",
  styleUrl: "./products-list.component.scss",
  providers: [BankService]
})
export class ProductsListComponent {
  financialProducts: FinancialProduct[] = [];
  constructor(readonly bankService: BankService, private router: Router) {}

  ngOnInit(): void {
    this.bankService
      .getFinancialProducts()
      .pipe(take(1))
      .subscribe(
        (financialProducts) => (this.financialProducts = financialProducts)
      );
  }

  onAdd(): void {
    this.router.navigate(["products"]);
  }
}
