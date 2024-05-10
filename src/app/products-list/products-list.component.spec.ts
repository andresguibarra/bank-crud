import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ProductsListComponent } from "./products-list.component";
import { BankService } from "../bank.service";
import { of } from "rxjs";
import { Router } from "@angular/router";

describe("ProductsListComponent", () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let bankService: jasmine.SpyObj<BankService>;
  let router: Router;

  const mockFinancialProducts = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'http://valid.url/logo1.png',
      date_release: new Date(),
      date_revision: new Date(),
      showMenu: false
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'http://valid.url/logo2.png',
      date_release: new Date(),
      date_revision: new Date(),
      showMenu: false
    }
  ];

  beforeEach(async () => {
    bankService = jasmine.createSpyObj('BankService', ['getFinancialProducts', 'deleteProduct']);

    await TestBed.configureTestingModule({
      imports: [
        ProductsListComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: BankService, useValue: bankService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    bankService.getFinancialProducts.and.returnValue(of(mockFinancialProducts));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to add product page', () => {
    spyOn(router, 'navigate');
    component.onAdd();
    expect(router.navigate).toHaveBeenCalledWith(['products']);
  });

  it('should navigate to edit product page', () => {
    spyOn(router, 'navigate');
    const product = mockFinancialProducts[0];
    component.onEdit(product);
    expect(router.navigate).toHaveBeenCalledWith(['products', product.id]);
  });

  it('should select a product to remove', () => {
    const product = mockFinancialProducts[0];
    component.onDelete(product);
    expect(component.selectedToRemoveFinancialProduct).toBe(product);
  });

  it('should show menu when clicked', () => {
    const product = mockFinancialProducts[0];
    component.financialProducts = mockFinancialProducts;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const menuButton = compiled.querySelector('.ellipsis-vertical') as HTMLElement;

    menuButton.click();
    fixture.detectChanges();

    expect(component.financialProducts[0].showMenu).toBeTrue();
  });
});
