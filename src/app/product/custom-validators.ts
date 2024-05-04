import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
  static dateMinimum(date: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date(date.toDateString());
      const inputDate = new Date(control.value);
      return inputDate >= currentDate
        ? null
        : { dateMinimum: { valid: false } };
    };
  }

  static dateReleaseAndRevisionValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const dateRelease = control.get("date_release")?.value;
    const dateRevision = control.get("date_revision")?.value;
    if (!dateRelease || !dateRevision) {
      return null;
    }
    const expectedRevisionDate = new Date(dateRelease);
    expectedRevisionDate.setFullYear(expectedRevisionDate.getFullYear() + 1);
    return new Date(dateRevision).getTime() === expectedRevisionDate.getTime()
      ? null
      : { dateMismatch: true };
  }
}
