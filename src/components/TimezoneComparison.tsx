import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartBar, Clock, MapPin } from '@phosphor-icons/react';
import { TimezoneData, formatTime, formatDate, getTimezoneAbbreviation, isBusinessHour } from '@/lib/timezone-utils';

interface TimezoneComparisonProps {
  selectedTimezones: TimezoneData[];
  currentTime: Date;
  use24Hour: boolean;
}

export function TimezoneComparison({ selectedTimezones, currentTime, use24Hour }: TimezoneComparisonProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (selectedTimezones.length < 2) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar size={20} className="text-primary" />
            Timezone Comparison Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ChartBar size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Add at least 2 timezones to see comparison charts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate hourly comparison data for the selected date
  const generateHourlyComparison = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => {
      const testTime = new Date(selectedDate);
      testTime.setHours(hour, 0, 0, 0);
      
      const timeData = selectedTimezones.map(timezone => {
        try {
          const localTime = new Date(testTime.toLocaleString('en-US', { timeZone: timezone.value }));
          const isBusinessHourTime = isBusinessHour(localTime, timezone.value);
          const isNightTime = localTime.getHours() < 6 || localTime.getHours() >= 22;
          
          return {
            timezone: timezone.value,
            city: timezone.city,
            time: formatTime(localTime, timezone.value, use24Hour),
            hour: localTime.getHours(),
            isBusinessHour: isBusinessHourTime,
            isNightTime,
            date: formatDate(localTime, timezone.value)
          };
        } catch {
          return null;
        }
      }).filter(Boolean);
      
      return {
        baseHour: hour,
        timeData
      };
    });
  };

  const hourlyData = generateHourlyComparison();

  const getTimeSlotClass = (isBusinessHour: boolean, isNightTime: boolean) => {
    if (isBusinessHour) return 'bg-green-100 text-green-800 border-green-200';
    if (isNightTime) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const resetToToday = () => {
    setSelectedDate(new Date());
  };

  const adjustDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar size={20} className="text-primary" />
          Timezone Comparison Chart
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustDate(-1)}
          >
            Previous Day
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustDate(1)}
          >
            Next Day
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Business Hours (9AM-5PM)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Night Time (10PM-6AM)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Other Hours</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header with timezone names */}
            <div className="grid grid-cols-[80px_repeat(var(--cols),1fr)] gap-1 mb-2" style={{ '--cols': selectedTimezones.length } as any}>
              <div className="text-xs font-medium text-muted-foreground p-2">Hour</div>
              {selectedTimezones.map(timezone => (
                <div key={timezone.value} className="text-xs font-medium text-center p-2 bg-muted rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MapPin size={12} />
                    {timezone.city}
                  </div>
                  <div className="text-muted-foreground">
                    {getTimezoneAbbreviation(timezone.value)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Time comparison grid */}
            <div className="space-y-1">
              {hourlyData.map(({ baseHour, timeData }) => (
                <div 
                  key={baseHour} 
                  className="grid grid-cols-[80px_repeat(var(--cols),1fr)] gap-1" 
                  style={{ '--cols': selectedTimezones.length } as any}
                >
                  <div className="text-xs font-medium p-2 bg-secondary rounded flex items-center justify-center">
                    {use24Hour ? `${baseHour.toString().padStart(2, '0')}:00` : 
                     new Date(2000, 0, 1, baseHour).toLocaleTimeString('en-US', { 
                       hour: 'numeric', 
                       hour12: true 
                     }).replace(':00 ', ' ')
                    }
                  </div>
                  {timeData.map((data: any) => (
                    <div 
                      key={data.timezone}
                      className={`text-xs p-2 rounded border text-center ${getTimeSlotClass(data.isBusinessHour, data.isNightTime)}`}
                    >
                      <div className="font-medium">{data.time}</div>
                      {data.date !== formatDate(selectedDate, data.timezone) && (
                        <div className="text-[10px] opacity-75 mt-1">
                          {data.date}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Meeting time suggestions */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Clock size={16} />
            Best Meeting Times
          </h4>
          <div className="text-sm text-muted-foreground">
            {(() => {
              const goodTimes = hourlyData.filter(({ timeData }) => 
                timeData.every((data: any) => data.isBusinessHour)
              );
              
              if (goodTimes.length === 0) {
                return "No overlapping business hours found for all timezones.";
              }
              
              const timeRanges = goodTimes.map(({ baseHour }) => 
                use24Hour ? `${baseHour.toString().padStart(2, '0')}:00` :
                new Date(2000, 0, 1, baseHour).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  hour12: true 
                }).replace(':00 ', ' ')
              );
              
              return `Good meeting times when all zones are in business hours: ${timeRanges.join(', ')}`;
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}