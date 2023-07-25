'use client';

import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface BetaBadgeProps {
  badgeClassName?: string;
}

export function BetaBadge({ badgeClassName }: BetaBadgeProps) {
  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger>
        <Badge variant="outline" className={cn('ml-2 h-fit text-muted-foreground', badgeClassName)}>
          Beta
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm text-muted-foreground">
          This tool is may not be fully functional and is still in development.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
