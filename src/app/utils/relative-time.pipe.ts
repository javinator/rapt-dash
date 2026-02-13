import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe transforms date strings into human-readable relative time formats.
 * Useful for displaying timestamps in notifications, social media posts, comments,
 * messaging apps, and any context where relative time is more meaningful than absolute dates.
 */
@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string, now: number): string {
    const diff = now - new Date(value).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) {
      return 'just now';
    }

    if (minutes < 60) {
      return `${minutes}min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (hours < 36) {
      return 'yesterday';
    }

    return new Date(value).toLocaleString();
  }
}
