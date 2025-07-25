import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MagnifyingGlass } from '@phosphor-icons/react';
import { timezones, type TimezoneData } from '@/lib/timezone-utils';

interface TimezoneSelectorProps {
  selectedTimezones: string[];
  onAddTimezone: (timezone: TimezoneData) => void;
}

export function TimezoneSelector({ selectedTimezones, onAddTimezone }: TimezoneSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredTimezones = timezones.filter(tz => {
    if (!searchQuery) return !selectedTimezones.includes(tz.value);
    
    const query = searchQuery.toLowerCase();
    return !selectedTimezones.includes(tz.value) && (
      tz.city.toLowerCase().includes(query) ||
      tz.country.toLowerCase().includes(query) ||
      tz.label.toLowerCase().includes(query)
    );
  });

  const popularTimezones = timezones.filter(tz => 
    !selectedTimezones.includes(tz.value) && [
      'America/New_York', 'America/Los_Angeles', 'Europe/London', 
      'Asia/Tokyo', 'Asia/Shanghai', 'Europe/Paris'
    ].includes(tz.value)
  );

  const handleAddTimezone = (timezone: TimezoneData) => {
    onAddTimezone(timezone);
    setSearchQuery('');
    setIsSearching(false);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlass 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search timezones..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(e.target.value.length > 0);
              }}
              onFocus={() => setIsSearching(true)}
              className="pl-9"
            />
          </div>
          {!isSearching && (
            <Button
              variant="outline"
              onClick={() => setIsSearching(true)}
              className="whitespace-nowrap"
            >
              <Plus size={16} className="mr-1" />
              Add Zone
            </Button>
          )}
        </div>

        {isSearching && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredTimezones.length > 0 ? (
              filteredTimezones.slice(0, 8).map((timezone) => (
                <button
                  key={timezone.value}
                  onClick={() => handleAddTimezone(timezone)}
                  className="w-full text-left p-2 rounded-md hover:bg-secondary transition-colors border border-transparent hover:border-border"
                >
                  <div className="font-medium text-sm">{timezone.city}</div>
                  <div className="text-xs text-muted-foreground">
                    {timezone.country} • {timezone.offset}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No timezones found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {!isSearching && popularTimezones.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Quick Add</h4>
            <div className="flex flex-wrap gap-2">
              {popularTimezones.map((timezone) => (
                <Button
                  key={timezone.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTimezone(timezone)}
                  className="text-xs"
                >
                  <Plus size={12} className="mr-1" />
                  {timezone.city}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}