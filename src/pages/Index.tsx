import { GameProvider } from '@/store/GameContext';
import { GameCanvas } from '@/components/GameCanvas';

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-background overflow-hidden">
        <GameCanvas />
      </div>
    </GameProvider>
  );
};

export default Index;
