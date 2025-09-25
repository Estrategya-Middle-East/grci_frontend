import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { DatePickerModule } from "primeng/datepicker";
import { OrganizationsService } from "../../services/organizations.service";
import { Select } from "primeng/select";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CountryCode,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { MessageService } from "primeng/api";
import { environment } from "../../../../../environments/environment";
import { AppRoute } from "../../../../app.routes.enum";
import { parseTimeString } from "../../../../shared/utils/parse-time";
import { City, Country, Group } from "../../models/organization.interface";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    Select,
    TextareaModule,
    DatePickerModule,
    HeaderComponent,
  ],
  templateUrl: "./add-edit.component.html",
  styleUrls: ["./add-edit.component.scss"],
})
export class AddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orgService = inject(OrganizationsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  isOrganization = signal(true);
  switchHeadquarter = signal(1);
  logoPreview = signal<string | null>(null);
  selectedFile: File | null = null;

  countries = signal<Country[]>([]);
  cities = signal<City[]>([]);
  groupNames = signal<Group[]>([]);
  organizationId: number | null = null;

  ngOnInit(): void {
    this.loadInitialData();
    this.createForm();
    this.checkIfEditMode();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      title: ["", Validators.required],
      groupId: ["", Validators.required],
      description: ["", Validators.required],
      address: ["", Validators.required],
      countryId: ["", Validators.required],
      cityId: ["", Validators.required],
      countryCode: [{ value: "", disabled: true }, Validators.required],
      phone: ["", [Validators.required, this.phoneValidator]],
      workHoursFrom: ["", Validators.required],
      workHoursTo: ["", Validators.required],
    });
    this.initValueChangeListeners();
  }

  private initValueChangeListeners(): void {
    this.formGroup
      .get("countryId")
      ?.valueChanges.subscribe((countryId) =>
        this.handleCountryChange(countryId)
      );

    this.formGroup
      .get("countryCode")
      ?.valueChanges.subscribe(() =>
        this.formGroup.get("phone")?.updateValueAndValidity()
      );
  }

  private loadInitialData(): void {
    this.loadCountries();
    this.loadGroupNames();
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.organizationId = +id;
        this.loadOrganization(this.organizationId);
      }
    });
  }

  private loadCountries(): void {
    this.orgService.getCountries().subscribe((res) => {
      this.countries.set(res);
      this.formGroup.get("phone")?.updateValueAndValidity();
    });
  }

  private loadGroupNames(): void {
    this.orgService
      .getGroupNames()
      .subscribe((res) => this.groupNames.set(res));
  }

  private loadCities(countryId: number): void {
    this.orgService
      .getCities(countryId)
      .subscribe((res) => this.cities.set(res));
  }

  private loadOrganization(id: number): void {
    this.orgService.getOrganizationById(id).subscribe({
      next: (res) => {
        this.formGroup.patchValue({
          title: res.title,
          groupId: res.groupId,
          description: res.description,
          address: res.address,
          countryId: res.countryId,
          cityId: res.cityId,
          countryCode:
            "+" +
            getCountryCallingCode(
              (this.countries().find((c) => c.id === res.countryId)?.isoCode ??
                "US") as CountryCode
            ),
          phone: res.phone,
          workHoursFrom: parseTimeString(res.workHoursFrom),
          workHoursTo: parseTimeString(res.workHoursTo),
        });

        if (res.logoUrl) {
          this.logoPreview.set(`${environment.baseUrl}${res.logoUrl}`);
        }
        this.isOrganization.set(!res.isGroup);
        this.switchHeadquarter.set(res.type);
        this.formGroup.updateValueAndValidity();
      },
      error: () => {
        this.router.navigateByUrl(`${AppRoute.ORGANIZATIONS}`);
      },
    });
  }

  private handleCountryChange(countryId: number | null): void {
    this.formGroup.get("cityId")?.setValue(null);
    this.formGroup.get("cityId")?.setValidators([Validators.required]);
    if (countryId) {
      this.loadCities(countryId);
      const selected = this.countries().find((c) => c.id === countryId);

      if (selected) {
        const dialCode =
          "+" +
          getCountryCallingCode(
            (selected.isoCode === "UK" ? "GB" : selected.isoCode) as CountryCode
          );
        this.formGroup.patchValue({
          countryCode: dialCode,
        });
      }
    } else {
      this.cities.set([]);
      this.formGroup.patchValue({ countryCode: "" });
    }
  }

  private phoneValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const phone = control.value?.toString().trim();
    if (!phone) return null;

    const countryId = this.formGroup?.get("countryId")?.value;
    const isoCode = this.countries().find((c) => c.id === countryId)?.isoCode;

    if (!isoCode) {
      return { invalidPhone: true };
    }

    try {
      const phoneNumber = parsePhoneNumberFromString(
        phone,
        (isoCode === "UK" ? "GB" : isoCode) as CountryCode
      );
      return phoneNumber && phoneNumber.isValid()
        ? null
        : { invalidPhone: true };
    } catch {
      return { invalidPhone: true };
    }
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.logoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.logoPreview.set(null);
    }
  }

  toggleHeadquarter(value: number): void {
    this.switchHeadquarter.set(value);
  }

  toggleUnitType(isOrg: boolean): void {
    this.isOrganization.set(isOrg);
  }

  getControl(name: string) {
    return this.formGroup.get(name);
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const action$ = this.organizationId
      ? this.orgService.updateOrganization(
          this.organizationId,
          this.formGroup.value,
          this.isOrganization(),
          this.switchHeadquarter(),
          this.selectedFile
        )
      : this.orgService.createOrganization(
          this.formGroup.value,
          this.isOrganization(),
          this.switchHeadquarter(),
          this.selectedFile
        );

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Organization saved successfully 🎉",
        });

        this.router.navigateByUrl(`${AppRoute.ORGANIZATIONS}`);
      },
    });
  }
}
