import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ProductComponent } from "./product.component";
import { BankService } from "../bank.service";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";

describe("ProductComponent", () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let bankService: jasmine.SpyObj<BankService>;
  let router: jasmine.SpyObj<Router>;

  const mockProduct = {
    id: "test-id",
    name: "Product",
    description: "Description",
    logo: "logo.png",
    date_release: new Date("2024-05-01"),
    date_revision: new Date(
      new Date("2024-05-01").setFullYear(
        new Date().getFullYear() + 1
      )
    )
  };

  beforeEach(async () => {
    bankService = jasmine.createSpyObj("BankService", [
      "getFinancialProducts",
      "validateProductExists",
      "updateProduct",
      "createProduct"
    ]);
    router = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [ProductComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: BankService, useValue: bankService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: of({ id: "test-id" })
            },
            params: of({ id: "test-id" })
          }
        },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;

    bankService.getFinancialProducts.and.returnValue(of([mockProduct]));
    bankService.validateProductExists.and.returnValue(of(true));

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should disable date_revision if date_release is invalid", () => {
    component.productForm.get("date_release")?.setValue("");
    fixture.detectChanges();
    expect(component.productForm.get("date_revision")?.disabled).toBeTrue();
  });

  it("should not set invalidId error if product id does not exist", () => {
    bankService.validateProductExists.and.returnValue(of(false));
    component.productForm.get("id")?.setValue("new-id");
    fixture.detectChanges();
    expect(component.productForm.get("id")?.errors).toBeNull();
  });

  it("should format date correctly", () => {
    const formattedDate = component.formatDateForInput(
      "2024-05-01T12:00:00.000Z"
    );
    expect(formattedDate).toBe("2024-05-01");
  });
});
