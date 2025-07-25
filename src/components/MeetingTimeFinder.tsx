import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Clock, Gear } from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';
import { findBusinessHourOverlaps, formatTime, type TimezoneData } from '@/lib/timezone-utils';

interface MeetingTimeFinderProps {
  selectedTimezones: TimezoneData[];
  use24Hour: boolean;
}

export function MeetingTimeFinder({ selectedTimezones, use24Hour }: MeetingTimeFinderProps) {
  const [overlaps, setOverlaps] = useState<{ hour: number; zones: string[] }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Persistent business hours settings
  const [startHour, setStartHour] = useKV<number>('meeting-start-hour', 9);
  const [endHour, setEndHour] = useKV<number>('meeting-end-hour', 17);

  const findOptimalTimes = () => {
    if (selectedTimezones.length < 2) return;
    
    setIsAnalyzing(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      const timezoneValues = selectedTimezones.map(tz => tz.value);
      const results = findBusinessHourOverlaps(timezoneValues, startHour, endHour);
      setOverlaps(results);
      setIsAnalyzing(false);
    }, 500);
  };

  const handleHourChange = (type: 'start' | 'end', value: string) => {
    const hour = parseInt(value, 10);
    if (isNaN(hour) || hour < 0 || hour > 23) return;
    
    if (type === 'start') {
      if (hour < endHour) {
        setStartHour(hour);
      }
    } else {
      if (hour > startHour) {
        setEndHour(hour);
      }
    }
  };

  const formatHourForInput = (hour: number) => {
    return hour.toString().padStart(2, '0');
  };

  const formatBusinessHours = () => {
    const start = new Date();
    start.setHours(startHour, 0, 0, 0);
    const end = new Date();
    end.setHours(endHour, 0, 0, 0);
    
    const startFormatted = formatTime(start, 'UTC', use24Hour);
    const endFormatted = formatTime(end, 'UTC', use24Hour);
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const getTimezoneByValue = (value: string) => {
    return selectedTimezones.find(tz => tz.value === value);
  };

  const formatOverlapTime = (hour: number) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    
    // Use a reference timezone (UTC) for consistent formatting
    return formatTime(date, 'UTC', use24Hour);
  };

  const getOverlapQuality = (zonesCount: number, totalZones: number) => {
    const percentage = (zonesCount / totalZones) * 100;
    if (percentage === 100) return { label: 'Perfect', color: 'bg-green-500' };
    if (percentage >= 75) return { label: 'Great', color: 'bg-blue-500' };
    if (percentage >= 50) return { label: 'Good', color: 'bg-yellow-500' };
    return { label: 'Limited', color: 'bg-orange-500' };
  };

  if (selectedTimezones.length < 2) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Users size={32} className="mx-auto mb-2 opacity-50" />
          <p>Add at least 2 timezones to find optimal meeting times</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Meeting Time Finder</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Gear size={16} className="mr-1" />
              Settings
            </Button>
            <Button 
              onClick={findOptimalTimes}
              disabled={isAnalyzing}
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Clock size={16} className="mr-1" />
                  Find Times
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSettings && (
          <div className="border rounded-lg p-4 bg-secondary/20">
            <h4 className="font-medium text-sm mb-3">Business Hours Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-hour" className="text-xs">Start Hour (24h)</Label>
                <Input
                  id="start-hour"
                  type="number"
                  min="0"
                  max="22"
                  value={formatHourForInput(startHour)}
                  onChange={(e) => handleHourChange('start', e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-hour" className="text-xs">End Hour (24h)</Label>
                <Input
                  id="end-hour"
                  type="number"
                  min="1"
                  max="23"
                  value={formatHourForInput(endHour)}
                  onChange={(e) => handleHourChange('end', e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Current range: <span className="font-medium">{formatBusinessHours()}</span>
            </div>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          Analyzing business hours (9:00 AM - 05:00 PM) across timezones
        </div>
        
        {overlaps.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Optimal Meeting Times</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {overlaps.map((overlap, index) => {
                const quality = getOverlapQuality(overlap.zones.length, selectedTimezones.length);
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-medium tabular-nums">
                        {formatOverlapTime(overlap.hour)}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-white ${quality.color}`}
                      >
                        {quality.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {overlap.zones.length} of {selectedTimezones.length} zones
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Times shown in your local timezone. All participants should be in business hours.
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Finding optimal meeting times...</p>
          </div>
        ) : overlaps.length === 0 && !isAnalyzing ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No overlapping business hours found</p>
            <p className="text-xs mt-1">Try different timezones or consider flexible working hours</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}