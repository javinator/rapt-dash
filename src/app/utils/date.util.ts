export class DateUtil {
  static isActive(endDate: Date | string | undefined): boolean {
    if (!endDate) {
      return true;
    }

    return new Date(endDate) > new Date();
  }
}
