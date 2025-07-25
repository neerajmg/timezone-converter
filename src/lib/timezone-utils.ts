export interface TimezoneData {
  value: string;
  label: string;
  city: string;
  country: string;
  offset: string;
}

export const timezones: TimezoneData[] = [
  { value: 'America/New_York', label: 'New York (EST/EDT)', city: 'New York', country: 'United States', offset: 'UTC-5/-4' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', city: 'Los Angeles', country: 'United States', offset: 'UTC-8/-7' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', city: 'Chicago', country: 'United States', offset: 'UTC-6/-5' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', city: 'Denver', country: 'United States', offset: 'UTC-7/-6' },
  { value: 'Europe/London', label: 'London (GMT/BST)', city: 'London', country: 'United Kingdom', offset: 'UTC+0/+1' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', city: 'Paris', country: 'France', offset: 'UTC+1/+2' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', city: 'Berlin', country: 'Germany', offset: 'UTC+1/+2' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', city: 'Rome', country: 'Italy', offset: 'UTC+1/+2' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', city: 'Madrid', country: 'Spain', offset: 'UTC+1/+2' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', city: 'Amsterdam', country: 'Netherlands', offset: 'UTC+1/+2' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', city: 'Tokyo', country: 'Japan', offset: 'UTC+9' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', city: 'Shanghai', country: 'China', offset: 'UTC+8' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', city: 'Hong Kong', country: 'Hong Kong', offset: 'UTC+8' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', city: 'Singapore', country: 'Singapore', offset: 'UTC+8' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', city: 'Seoul', country: 'South Korea', offset: 'UTC+9' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)', city: 'Mumbai', country: 'India', offset: 'UTC+5:30' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', city: 'Dubai', country: 'UAE', offset: 'UTC+4' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', city: 'Sydney', country: 'Australia', offset: 'UTC+10/+11' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', city: 'Melbourne', country: 'Australia', offset: 'UTC+10/+11' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', city: 'Auckland', country: 'New Zealand', offset: 'UTC+12/+13' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', city: 'Toronto', country: 'Canada', offset: 'UTC-5/-4' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', city: 'Vancouver', country: 'Canada', offset: 'UTC-8/-7' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', city: 'São Paulo', country: 'Brazil', offset: 'UTC-3' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)', city: 'Mexico City', country: 'Mexico', offset: 'UTC-6/-5' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)', city: 'Buenos Aires', country: 'Argentina', offset: 'UTC-3' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', city: 'Moscow', country: 'Russia', offset: 'UTC+3' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)', city: 'Istanbul', country: 'Turkey', offset: 'UTC+3' },
  { value: 'Africa/Cairo', label: 'Cairo (EET)', city: 'Cairo', country: 'Egypt', offset: 'UTC+2' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', city: 'Johannesburg', country: 'South Africa', offset: 'UTC+2' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', city: 'Bangkok', country: 'Thailand', offset: 'UTC+7' },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)', city: 'Jakarta', country: 'Indonesia', offset: 'UTC+7' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)', city: 'Honolulu', country: 'United States', offset: 'UTC-10' },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)', city: 'Anchorage', country: 'United States', offset: 'UTC-9/-8' },
];

export const formatTime = (date: Date, timezone: string, use24Hour: boolean = false): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24Hour,
    }).format(date);
  } catch (error) {
    return 'Invalid timezone';
  }
};

export const formatDate = (date: Date, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return 'Invalid date';
  }
};

export const getTimezoneAbbreviation = (timezone: string, date: Date = new Date()): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(date);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName');
    return timeZoneName?.value || '';
  } catch (error) {
    return '';
  }
};

export const convertTimeToTimezone = (date: Date, fromTimezone: string, toTimezone: string): Date => {
  try {
    const fromTime = new Date(date.toLocaleString('en-US', { timeZone: fromTimezone }));
    const toTime = new Date(date.toLocaleString('en-US', { timeZone: toTimezone }));
    const offset = toTime.getTime() - fromTime.getTime();
    return new Date(date.getTime() + offset);
  } catch (error) {
    return date;
  }
};

export const findBusinessHourOverlaps = (timezones: string[], startHour: number = 9, endHour: number = 17, date: Date = new Date()) => {
  const overlaps: { hour: number; zones: string[] }[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const testTime = new Date(date);
    testTime.setHours(hour, 0, 0, 0);
    
    const zonesInBusinessHours = timezones.filter(tz => {
      try {
        const localTime = new Date(testTime.toLocaleString('en-US', { timeZone: tz }));
        const localHour = localTime.getHours();
        return localHour >= startHour && localHour < endHour;
      } catch {
        return false;
      }
    });
    
    if (zonesInBusinessHours.length > 1) {
      overlaps.push({ hour, zones: zonesInBusinessHours });
    }
  }
  
  return overlaps;
};

/**
 * Calculate the time difference in hours between two timezones
 */
export const getTimezoneOffsetDifference = (fromTimezone: string, toTimezone: string, date: Date = new Date()): number => {
  try {
    const fromOffset = getTimezoneOffset(fromTimezone, date);
    const toOffset = getTimezoneOffset(toTimezone, date);
    return (toOffset - fromOffset) / (1000 * 60 * 60);
  } catch {
    return 0;
  }
};

/**
 * Get timezone offset in milliseconds from UTC
 */
export const getTimezoneOffset = (timezone: string, date: Date): number => {
  try {
    const utcTime = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const localTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return localTime.getTime() - utcTime.getTime();
  } catch {
    return 0;
  }
};

/**
 * Check if a given time falls within business hours for a timezone
 */
export const isBusinessHour = (date: Date, timezone: string, startHour: number = 9, endHour: number = 17): boolean => {
  try {
    const localTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const hour = localTime.getHours();
    return hour >= startHour && hour < endHour;
  } catch {
    return false;
  }
};