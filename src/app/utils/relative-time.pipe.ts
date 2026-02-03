import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

/**
 * This pipe transforms date strings into human-readable relative time formats.
 * Useful for displaying timestamps in notifications, social media posts, comments,
 * messaging apps, and any context where relative time is more meaningful than absolute dates.
 */
@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string): string {
    const now = moment();

    const created = moment(value);

    const diff = now.diff(created, 'days');

    if (diff < 1) {
      if (now.diff(created, 'minutes') < 1) {
        return 'now';
      }

      if (now.diff(created, 'hours') < 1) {
        return `${now.diff(created, 'minutes')}min ago`;
      }

      return `${now.diff(created, 'hours')}h ago`;
    } else if (diff === 1) {
      return 'Yesterday';
    } else if (diff < 7) {
      return `${diff} days ago`;
    } else {
      return created.format('MMM D, YYYY');
    }
  }
}
