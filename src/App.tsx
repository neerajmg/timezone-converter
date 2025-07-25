import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { TimezoneCard } from './components/TimezoneCard';
import { TimezoneSelector } from './components/TimezoneSelector';
import { TimeConverter } from './components/TimeConverter';
import { MeetingTimeFinder } from './components/MeetingTimeFinder';
import { TimezoneComparison } from './components/TimezoneComparison';
import { TimeDifferenceCalculator } from './components/TimeDifferenceCalculator';
import { Globe } from '@phosphor-icons/react';
import { timezones, type TimezoneData, convertTimeToTimezone } from './lib/timezone-utils';

function App() {
  const [selectedTimezones, setSelectedTimezones] = useKV<TimezoneData[]>('selected-timezones', [
    timezones.find(tz => tz.value === 'America/New_York')!,
    timezones.find(tz => tz.value === 'Europe/London')!,
    timezones.find(tz => tz.value === 'Asia/Tokyo')!,
  ]);
  
  const [use24Hour, setUse24Hour] = useKV<boolean>('use-24-hour', false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConverting, setIsConverting] = useState(false);
  const [conversionTime, setConversionTime] = useState<Date>();
  const [conversionTimezone, setConversionTimezone] = useState<string>('');

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTimezone = (timezone: TimezoneData) => {
    setSelectedTimezones(current => [...current, timezone]);
  };

  const removeTimezone = (timezoneValue: string) => {
    setSelectedTimezones(current => current.filter(tz => tz.value !== timezoneValue));
  };

  const handleTimeConversion = (date: Date, fromTimezone: string) => {
    setConversionTime(date);
    setConversionTimezone(fromTimezone);
    setIsConverting(true);
  };

  const resetConversion = () => {
    setIsConverting(false);
    setConversionTime(undefined);
    setConversionTimezone('');
  };

  const handleTimeClick = (timezone: string) => {
    if (isConverting) {
      resetConversion();
    }
  };

  const getConvertedTimeForTimezone = (targetTimezone: string): Date => {
    if (!isConverting || !conversionTime) return currentTime;
    
    try {
      return convertTimeToTimezone(conversionTime, conversionTimezone, targetTimezone);
    } catch {
      return currentTime;
    }
  };

  const getUserTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  };

  const userTimezone = getUserTimezone();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Timezone Converter</h1>
          </div>
          <p className="text-muted-foreground">
            Manage time across multiple zones with real-time updates
          </p>
        </div>

        {/* Timezone Selector */}
        <TimezoneSelector
          selectedTimezones={selectedTimezones.map(tz => tz.value)}
          onAddTimezone={addTimezone}
        />

        {/* Time Converter */}
        <TimeConverter
          selectedTimezones={selectedTimezones}
          onConvert={handleTimeConversion}
          onReset={resetConversion}
          isConverting={isConverting}
          use24Hour={use24Hour}
          onToggle24Hour={setUse24Hour}
        />

        {/* Timezone Cards Grid */}
        {selectedTimezones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {selectedTimezones.map((timezone) => {
              const convertedTime = getConvertedTimeForTimezone(timezone.value);
              
              return (
                <TimezoneCard
                  key={timezone.value}
                  timezone={timezone}
                  currentTime={currentTime}
                  use24Hour={use24Hour}
                  isConverting={isConverting}
                  conversionTime={convertedTime}
                  onRemove={removeTimezone}
                  onTimeClick={handleTimeClick}
                  isCurrentTimeZone={timezone.value === userTimezone}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <Globe size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No timezones selected</h3>
            <p className="text-muted-foreground">
              Add your first timezone to get started with time conversion
            </p>
          </div>
        )}

        {/* Time Difference Calculator */}
        <TimeDifferenceCalculator
          selectedTimezones={selectedTimezones}
          use24Hour={use24Hour}
        />

        {/* Meeting Time Finder */}
        <div className="mb-8">
          <MeetingTimeFinder
            selectedTimezones={selectedTimezones}
            use24Hour={use24Hour}
          />
        </div>

        {/* Timezone Comparison Charts */}
        <TimezoneComparison
          selectedTimezones={selectedTimezones}
          currentTime={currentTime}
          use24Hour={use24Hour}
        />
      </div>
    </div>
  );
}

export default App;