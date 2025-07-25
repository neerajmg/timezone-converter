import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock } from '@phosphor-icons/react';
import { formatTime, formatDate, getTimezoneAbbreviation, type TimezoneData } from '@/lib/timezone-utils';
import { cn } from '@/lib/utils';

interface TimezoneCardProps {
  timezone: TimezoneData;
  currentTime: Date;
  use24Hour: boolean;
  isConverting: boolean;
  conversionTime?: Date;
  onRemove: (timezoneValue: string) => void;
  onTimeClick: (timezone: string) => void;
  isCurrentTimeZone?: boolean;
}

export function TimezoneCard({
  timezone,
  currentTime,
  use24Hour,
  isConverting,
  conversionTime,
  onRemove,
  onTimeClick,
  isCurrentTimeZone = false,
}: TimezoneCardProps) {
  const [displayTime, setDisplayTime] = useState(currentTime);

  useEffect(() => {
    if (isConverting && conversionTime) {
      setDisplayTime(conversionTime);
    } else {
      setDisplayTime(currentTime);
    }
  }, [currentTime, isConverting, conversionTime]);

  const timeString = formatTime(displayTime, timezone.value, use24Hour);
  const dateString = formatDate(displayTime, timezone.value);
  const abbreviation = getTimezoneAbbreviation(timezone.value, displayTime);

  const isDifferentDay = () => {
    if (isCurrentTimeZone) return false;
    const currentDateStr = formatDate(currentTime, Intl.DateTimeFormat().resolvedOptions().timeZone);
    return dateString !== currentDateStr;
  };

  return (
    <Card 
      className={cn(
        "relative group hover:shadow-md transition-all duration-200 cursor-pointer",
        isCurrentTimeZone && "ring-2 ring-accent",
        isConverting && "ring-2 ring-primary"
      )}
      onClick={() => onTimeClick(timezone.value)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground leading-tight">
              {timezone.city}
            </h3>
            <p className="text-xs text-muted-foreground">
              {timezone.country}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {isCurrentTimeZone && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-accent text-accent-foreground">
                <Clock size={10} className="mr-1" />
                Now
              </Badge>
            )}
            {abbreviation && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {abbreviation}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(timezone.value);
              }}
            >
              <X size={12} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className={cn(
            "font-bold text-lg tabular-nums transition-colors duration-200",
            isConverting && "text-primary"
          )}>
            {timeString}
          </div>
          <div className={cn(
            "text-xs text-muted-foreground",
            isDifferentDay() && "text-destructive font-medium"
          )}>
            {dateString}
            {isDifferentDay() && " (next day)"}
          </div>
        </div>
        
        {isConverting && (
          <div className="absolute top-2 left-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}