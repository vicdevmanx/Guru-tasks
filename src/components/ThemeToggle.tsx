
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      {/* <span className="text-sm">Theme</span> */}
       <div className='items-center text-sm flex gap-2'> 
        <Button
          variant={theme === 'light' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme('light')}
          className="p-2"
        >
          <Sun className="h-4 w-4" />
        </Button>
</div>
 <div className='items-center text-sm flex gap-2'> 
        <Button
          variant={theme === 'dark' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="p-2"
        >
          <Moon className="h-4 w-4" />
        </Button>
        </div>
    </div>
  );
};
