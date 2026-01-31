import * as ex from 'excalibur';

// Entity sprites
import circleImg from '@/assets/entities/circle.png';
import enemyFamilyImg from '@/assets/entities/enemy-family.png';
import enemySocialImg from '@/assets/entities/enemy-social.png';
import enemyWorkImg from '@/assets/entities/enemy-work.png';
import man01Img from '@/assets/entities/man-01.png';
import man02Img from '@/assets/entities/man-02.png';
import maskFamilyImg from '@/assets/entities/mask-family.png';
import maskSocialImg from '@/assets/entities/mask-social.png';
import maskWorkImg from '@/assets/entities/mask-work.png';

// FX sprites
import fxBrokenMaskImg from '@/assets/fx/fx-broken-mask.png';
import fxEnemyOutImg from '@/assets/fx/fx-enemy-out.png';
import fxStressImg from '@/assets/fx/fx-stress.png';
import fxSuccessImg from '@/assets/fx/fx-success.png';

// Level backgrounds
import level1Bg from '@/assets/level-background/level-1.png';
import level2Bg from '@/assets/level-background/level-2.png';
import level3Bg from '@/assets/level-background/level-3.png';

// Logo
import logoImg from '@/assets/logo/logo.png';

// Sound effects
import fastSwooshSfx from '@/assets/sound/sound-effect/fast-swoosh.mp3';
import gameOverSfx from '@/assets/sound/sound-effect/game-over.mp3';
import glassBreakingSfx from '@/assets/sound/sound-effect/glass-breaking.mp3';
import glassCling from '@/assets/sound/sound-effect/glass-cling.mp3';
import warningAlarmSfx from '@/assets/sound/sound-effect/warning-alarm.mp3';

// Soundtracks
import level1Music from '@/assets/sound/soundtrack/level-1.mp3';
import level2Music from '@/assets/sound/soundtrack/level-2.mp3';
import level3Music from '@/assets/sound/soundtrack/level-3.mp3';

// Create Excalibur ImageSource objects
export const Images = {
  // Entities
  circle: new ex.ImageSource(circleImg),
  enemyFamily: new ex.ImageSource(enemyFamilyImg),
  enemySocial: new ex.ImageSource(enemySocialImg),
  enemyWork: new ex.ImageSource(enemyWorkImg),
  player1: new ex.ImageSource(man01Img),
  player2: new ex.ImageSource(man02Img),
  maskFamily: new ex.ImageSource(maskFamilyImg),
  maskSocial: new ex.ImageSource(maskSocialImg),
  maskWork: new ex.ImageSource(maskWorkImg),

  // FX
  fxBrokenMask: new ex.ImageSource(fxBrokenMaskImg),
  fxEnemyOut: new ex.ImageSource(fxEnemyOutImg),
  fxStress: new ex.ImageSource(fxStressImg),
  fxSuccess: new ex.ImageSource(fxSuccessImg),

  // Backgrounds
  level1Bg: new ex.ImageSource(level1Bg),
  level2Bg: new ex.ImageSource(level2Bg),
  level3Bg: new ex.ImageSource(level3Bg),

  // Logo
  logo: new ex.ImageSource(logoImg),
};

// Create Excalibur Sound objects
export const Sounds = {
  // SFX
  fastSwoosh: new ex.Sound(fastSwooshSfx),
  gameOver: new ex.Sound(gameOverSfx),
  glassBreaking: new ex.Sound(glassBreakingSfx),
  glassCling: new ex.Sound(glassCling),
  warningAlarm: new ex.Sound(warningAlarmSfx),

  // Music
  level1Music: new ex.Sound(level1Music),
  level2Music: new ex.Sound(level2Music),
  level3Music: new ex.Sound(level3Music),
};

// Create loader with all resources
export const loader = new ex.Loader();

// Add all images to loader
Object.values(Images).forEach((image) => loader.addResource(image));

// Add all sounds to loader
Object.values(Sounds).forEach((sound) => loader.addResource(sound));

// Configure loader appearance
loader.backgroundColor = '#0a0a14';
loader.loadingBarColor = ex.Color.fromHex('#8B5CF6');
loader.suppressPlayButton = true;
