import { useGame } from '@/store/GameContext';
import { MaskType } from '@/store/initialState';
import { cn } from '@/lib/utils';

const MaskIndicator = ({
  maskType,
  keyLabel,
  isActive,
}: {
  maskType: MaskType;
  keyLabel: string;
  isActive: boolean;
}) => {
  const styleMap: Record<MaskType, string> = {
    WORK: 'mask-indicator-work',
    FAMILY: 'mask-indicator-family',
    SOCIAL: 'mask-indicator-social',
    NEUTRAL: 'mask-indicator-neutral',
  };

  const labelMap: Record<MaskType, string> = {
    WORK: 'Work',
    FAMILY: 'Family',
    SOCIAL: 'Social',
    NEUTRAL: 'Self',
  };

  return (
    <div
      className={cn(
        'mask-indicator',
        styleMap[maskType],
        isActive && 'active scale-110'
      )}
    >
      <span className="text-xs opacity-60">[{keyLabel}]</span>
      <span className="ml-2">{labelMap[maskType]}</span>
    </div>
  );
};

export function GameHUD() {
  const { state } = useGame();
  const { hp, maxHp, score, combo, currentMask, level } = state;

  const hpPercentage = (hp / maxHp) * 100;
  const isLowHp = hpPercentage <= 30;

  return (
    <div className="absolute inset-0 pointer-events-none p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        {/* HP Bar */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-display uppercase tracking-wider text-muted-foreground">
            Mental Health
          </span>
          <div className="hp-bar-container">
            <div
              className={cn('hp-bar-fill', isLowHp && 'low')}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {hp} / {maxHp}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-display uppercase tracking-wider text-muted-foreground">
            Ego Points
          </span>
          <div className="score-display">{score.toLocaleString()}</div>
          {combo > 0 && (
            <span className="text-sm text-accent animate-pulse-scale">
              {combo}x Combo!
            </span>
          )}
        </div>
      </div>

      {/* Level Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <span className="font-display text-lg text-muted-foreground uppercase tracking-widest">
          Level {level}
        </span>
      </div>

      {/* Bottom Mask Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <MaskIndicator
          maskType="WORK"
          keyLabel="Q"
          isActive={currentMask === 'WORK'}
        />
        <MaskIndicator
          maskType="FAMILY"
          keyLabel="W"
          isActive={currentMask === 'FAMILY'}
        />
        <MaskIndicator
          maskType="SOCIAL"
          keyLabel="E"
          isActive={currentMask === 'SOCIAL'}
        />
      </div>

      {/* Current Mask State (center bottom) */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          Current Mask
        </span>
        <div className="mt-1">
          <MaskIndicator
            maskType={currentMask}
            keyLabel=""
            isActive={true}
          />
        </div>
      </div>
    </div>
  );
}
