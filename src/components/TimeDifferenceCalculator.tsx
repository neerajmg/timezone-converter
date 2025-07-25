import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Clock, ArrowRight, Info } from '@phosphor-icons/react';
import { TimezoneData, formatTime, formatDate, getTimezoneAbbreviation, getTimezoneOffsetDifference, getTimezoneOffset as getOffset } from '@/lib/timezone-utils';

interface TimeDifferenceCalculatorProps {
  selectedTimezones: TimezoneData[];
  use24Hour: boolean;
}

export function TimeDifferenceCalculator({ selectedTimezones, use24Hour }: TimeDifferenceCalculatorProps) {
  const [fromTimezone, setFromTimezone] = useState<string>('');
  const [toTimezone, setToTimezone] = useState<string>('');
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [result, setResult] = useState<{
    fromTime: string;
    toTime: string;
    fromDate: string;
    toDate: string;
    timeDifference: string;
    dayDifference: number;
  } | null>(null);

  const calculateTimeDifference = () => {
    if (!fromTimezone || !toTimezone || !inputDate || !inputTime) {
      return;
    }

    try {
      // Parse the input date and time
      const [year, month, day] = inputDate.split('-').map(Number);
      const [hours, minutes] = inputTime.split(':').map(Number);
      
      // Create a date object in the source timezone
      const sourceDate = new Date(year, month - 1, day, hours, minutes);
      
      // Get the time in both timezones
      const fromTimeString = formatTime(sourceDate, fromTimezone, use24Hour);
      const fromDateString = formatDate(sourceDate, fromTimezone);
      
      // Convert to target timezone by creating equivalent time
      const targetDate = new Date(sourceDate.toLocaleString('en-US', { timeZone: toTimezone }));
      const offsetDiff = targetDate.getTime() - new Date(sourceDate.toLocaleString('en-US', { timeZone: fromTimezone })).getTime();
      const adjustedTargetDate = new Date(sourceDate.getTime() + offsetDiff);
      
      const toTimeString = formatTime(adjustedTargetDate, toTimezone, use24Hour);
      const toDateString = formatDate(adjustedTargetDate, toTimezone);
      
      // Calculate time difference in hours
      const hoursDiff = getTimezoneOffsetDifference(fromTimezone, toTimezone, sourceDate);
      
      // Calculate day difference
      const fromDateOnly = new Date(sourceDate.toLocaleDateString('en-US', { timeZone: fromTimezone }));
      const toDateOnly = new Date(adjustedTargetDate.toLocaleDateString('en-US', { timeZone: toTimezone }));
      const dayDiff = Math.round((toDateOnly.getTime() - fromDateOnly.getTime()) / (1000 * 60 * 60 * 24));
      
      let timeDifferenceString = '';
      if (hoursDiff > 0) {
        timeDifferenceString = `${Math.abs(hoursDiff)} hours ahead`;
      } else if (hoursDiff < 0) {
        timeDifferenceString = `${Math.abs(hoursDiff)} hours behind`;
      } else {
        timeDifferenceString = 'Same time';
      }
      
      setResult({
        fromTime: fromTimeString,
        toTime: toTimeString,
        fromDate: fromDateString,
        toDate: toDateString,
        timeDifference: timeDifferenceString,
        dayDifference: dayDiff
      });
    } catch (error) {
      console.error('Error calculating time difference:', error);
    }
  };



  const setCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    setInputDate(date);
    setInputTime(time);
  };

  const swapTimezones = () => {
    const temp = fromTimezone;
    setFromTimezone(toTimezone);
    setToTimezone(temp);
    setResult(null);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator size={20} className="text-primary" />
          Time Difference Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculate precise time differences between any two timezones
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timezone Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-timezone">From Timezone</Label>
            <Select value={fromTimezone} onValueChange={setFromTimezone}>
              <SelectTrigger id="from-timezone">
                <SelectValue placeholder="Select source timezone" />
              </SelectTrigger>
              <SelectContent>
                {selectedTimezones.map(timezone => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    <div className="flex items-center gap-2">
                      <span>{timezone.city}</span>
                      <span className="text-muted-foreground text-xs">
                        ({getTimezoneAbbreviation(timezone.value)})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="to-timezone">To Timezone</Label>
            <div className="flex gap-2">
              <Select value={toTimezone} onValueChange={setToTimezone}>
                <SelectTrigger id="to-timezone">
                  <SelectValue placeholder="Select target timezone" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTimezones.map(timezone => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      <div className="flex items-center gap-2">
                        <span>{timezone.city}</span>
                        <span className="text-muted-foreground text-xs">
                          ({getTimezoneAbbreviation(timezone.value)})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={swapTimezones}
                disabled={!fromTimezone || !toTimezone}
                title="Swap timezones"
              >
                <ArrowRight size={16} className="rotate-90" />
              </Button>
            </div>
          </div>
        </div>

        {/* Date and Time Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-date">Date</Label>
            <Input
              id="input-date"
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="input-time">Time</Label>
            <Input
              id="input-time"
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button
              variant="outline"
              onClick={setCurrentDateTime}
              className="w-full"
            >
              <Clock size={16} className="mr-2" />
              Use Current Time
            </Button>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={calculateTimeDifference}
          disabled={!fromTimezone || !toTimezone || !inputDate || !inputTime}
          className="w-full"
        >
          <Calculator size={16} className="mr-2" />
          Calculate Time Difference
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Info size={16} />
                Conversion Result
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From timezone result */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    {selectedTimezones.find(tz => tz.value === fromTimezone)?.city}
                  </div>
                  <div className="text-lg font-semibold">{result.fromTime}</div>
                  <div className="text-sm text-muted-foreground">{result.fromDate}</div>
                  <Badge variant="secondary" className="mt-2">
                    {getTimezoneAbbreviation(fromTimezone)}
                  </Badge>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight size={24} className="text-primary" />
                </div>
                
                {/* To timezone result */}
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">
                    {selectedTimezones.find(tz => tz.value === toTimezone)?.city}
                  </div>
                  <div className="text-lg font-semibold">{result.toTime}</div>
                  <div className="text-sm text-muted-foreground">{result.toDate}</div>
                  <Badge variant="default" className="mt-2">
                    {getTimezoneAbbreviation(toTimezone)}
                  </Badge>
                </div>
              </div>
              
              {/* Time difference summary */}
              <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-sm font-medium text-accent-foreground">
                  Time Difference: {result.timeDifference}
                </div>
                {result.dayDifference !== 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {result.dayDifference > 0 ? `+${result.dayDifference}` : result.dayDifference} day
                    {Math.abs(result.dayDifference) !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTimezones.length < 2 && (
          <div className="text-center py-6">
            <Calculator size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Add at least 2 timezones to use the time difference calculator
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}