import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowClockwise, Calendar } from '@phosphor-icons/react';
import { type TimezoneData } from '@/lib/timezone-utils';

interface TimeConverterProps {
  selectedTimezones: TimezoneData[];
  onConvert: (date: Date, timezone: string) => void;
  onReset: () => void;
  isConverting: boolean;
  use24Hour: boolean;
  onToggle24Hour: (use24Hour: boolean) => void;
}

export function TimeConverter({
  selectedTimezones,
  onConvert,
  onReset,
  isConverting,
  use24Hour,
  onToggle24Hour,
}: TimeConverterProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');

  const handleConvert = () => {
    if (!selectedTimezone) return;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const date = new Date(selectedDate);
    date.setHours(hours, minutes, 0, 0);
    
    onConvert(date, selectedTimezone);
  };

  const handleReset = () => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
    onReset();
  };

  if (selectedTimezones.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Calendar size={32} className="mx-auto mb-2 opacity-50" />
          <p>Add some timezones to start converting times</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Time Converter</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="24hour-toggle" className="text-sm">24h</Label>
            <Switch
              id="24hour-toggle"
              checked={use24Hour}
              onCheckedChange={onToggle24Hour}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="convert-date">Date</Label>
            <Input
              id="convert-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="convert-time">Time</Label>
            <Input
              id="convert-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="convert-timezone">From Timezone</Label>
            <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {selectedTimezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleConvert}
            disabled={!selectedTimezone}
            className="flex-1"
          >
            Convert Time
          </Button>
          {isConverting && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <ArrowClockwise size={16} />
              Reset
            </Button>
          )}
        </div>
        
        {isConverting && (
          <div className="text-sm text-muted-foreground text-center">
            Showing converted time across all timezones
          </div>
        )}
      </CardContent>
    </Card>
  );
}