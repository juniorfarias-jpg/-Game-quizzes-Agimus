import { RoomThemeId } from '../types/game';
import livingRoomClassicHorizontal from '../assets/images/living_room_cat_scene_1795453020672.jpg';
import livingRoomClassicVertical from '../assets/images/living_room_classic_vertical_1795457600271.jpg';
import cozyBedroomHorizontal from '../assets/images/cozy_bedroom_horizontal_1795457600283.jpg';
import cozyBedroomVertical from '../assets/images/cozy_bedroom_vertical_1795457599218.jpg';
import sunlitLoungeHorizontal from '../assets/images/sunlit_lounge_horizontal_1795457601001.jpg';
import sunlitLoungeVertical from '../assets/images/sunlit_lounge_vertical_1795457601516.jpg';

export interface RoomHotspot {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  weight: number;
}

export interface RoomThemeDefinition {
  id: RoomThemeId;
  name: string;
  subtitle: string;
  badge: string;
  verticalImage: string;
  horizontalImage: string;
  verticalHotspots: RoomHotspot[];
  horizontalHotspots: RoomHotspot[];
}

export const ROOM_THEMES: RoomThemeDefinition[] = [
  {
    id: 'living_room_classic',
    name: 'Sala de Estar Clássica',
    subtitle: 'Sofá bege, poltronas coloridas, tapete tecido e gato malhado a descansar.',
    badge: 'CLÁSSICA',
    verticalImage: livingRoomClassicVertical,
    horizontalImage: livingRoomClassicHorizontal,
    verticalHotspots: [
      { xMin: 30, xMax: 52, yMin: 56, yMax: 66, weight: 2 }, // Tabby cat on sofa
      { xMin: 12, xMax: 88, yMin: 48, yMax: 70, weight: 3 }, // Beige sofa & cushions
      { xMin: 6, xMax: 24, yMin: 63, yMax: 86, weight: 2 },  // Teal armchair (lower left)
      { xMin: 18, xMax: 88, yMin: 71, yMax: 91, weight: 3 }, // Woven rug & hardwood floor
    ],
    horizontalHotspots: [
      { xMin: 32, xMax: 44, yMin: 55, yMax: 67, weight: 2 }, // Tabby cat on sofa
      { xMin: 22, xMax: 62, yMin: 47, yMax: 70, weight: 3 }, // Beige sofa & cushions
      { xMin: 8, xMax: 25, yMin: 53, yMax: 84, weight: 2 },  // Teal armchair (left)
      { xMin: 75, xMax: 92, yMin: 50, yMax: 80, weight: 2 }, // Mustard armchair (right)
      { xMin: 26, xMax: 86, yMin: 68, yMax: 90, weight: 3 }, // Area rug & wooden floor
    ],
  },
  {
    id: 'cozy_bedroom',
    name: 'Quarto Aconchegante',
    subtitle: 'Cama verde-sálvia com manta, poltrona terracota, tapete e gato ruivo.',
    badge: 'QUARTO',
    verticalImage: cozyBedroomVertical,
    horizontalImage: cozyBedroomHorizontal,
    verticalHotspots: [
      { xMin: 52, xMax: 78, yMin: 57, yMax: 67, weight: 2 }, // Ginger cat on bedspread
      { xMin: 24, xMax: 88, yMin: 46, yMax: 74, weight: 3 }, // Bed & pillows
      { xMin: 6, xMax: 24, yMin: 50, yMax: 76, weight: 2 },  // Terracotta armchair (left)
      { xMin: 16, xMax: 88, yMin: 74, yMax: 92, weight: 3 }, // Geometric rug & oak floor
    ],
    horizontalHotspots: [
      { xMin: 44, xMax: 58, yMin: 54, yMax: 66, weight: 2 }, // Ginger cat on bedspread
      { xMin: 30, xMax: 82, yMin: 42, yMax: 74, weight: 3 }, // Bed & duvet
      { xMin: 6, xMax: 24, yMin: 46, yMax: 76, weight: 2 },  // Terracotta armchair (left)
      { xMin: 20, xMax: 82, yMin: 72, yMax: 91, weight: 3 }, // Woven rug & floor
    ],
  },
  {
    id: 'sunlit_lounge',
    name: 'Varanda & Lounge Solar',
    subtitle: 'Jardim envidraçado, sofá azul, cadeirão de vime, tapete redondo e gato cinza.',
    badge: 'JARDIM',
    verticalImage: sunlitLoungeVertical,
    horizontalImage: sunlitLoungeHorizontal,
    verticalHotspots: [
      { xMin: 44, xMax: 62, yMin: 57, yMax: 66, weight: 2 }, // White-grey cat on sofa
      { xMin: 22, xMax: 78, yMin: 52, yMax: 70, weight: 3 }, // Dusty-blue sofa
      { xMin: 64, xMax: 92, yMin: 68, yMax: 90, weight: 2 }, // Rattan armchair (lower right)
      { xMin: 14, xMax: 70, yMin: 72, yMax: 90, weight: 3 }, // Round jute rug
    ],
    horizontalHotspots: [
      { xMin: 36, xMax: 50, yMin: 56, yMax: 66, weight: 2 }, // White-grey cat on sofa
      { xMin: 20, xMax: 60, yMin: 48, yMax: 72, weight: 3 }, // Dusty-blue sofa
      { xMin: 74, xMax: 93, yMin: 52, yMax: 88, weight: 2 }, // Rattan armchair (right)
      { xMin: 38, xMax: 82, yMin: 72, yMax: 92, weight: 3 }, // Round jute rug & floor
    ],
  },
];

export function getRoomTheme(themeId?: RoomThemeId): RoomThemeDefinition {
  return ROOM_THEMES.find((t) => t.id === themeId) || ROOM_THEMES[0];
}

export function getRoomSceneImage(themeId: RoomThemeId | undefined, isVertical: boolean): string {
  const theme = getRoomTheme(themeId);
  return isVertical ? theme.verticalImage : theme.horizontalImage;
}
