import { Routes } from "@angular/router";
import { ProductsListComponent } from "./products-list/products-list.component";
import { ProductComponent } from "./product/product.component";

export const routes: Routes = [
  {
    path: "",
    component: ProductsListComponent
  },
  {
    path: "products/:id",
    component: ProductComponent
  },

  {
    path: "products",
    component: ProductComponent
  }
];
