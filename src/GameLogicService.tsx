//GameLogicService is a singleton class that handles the logic for the game
export class GameLogicService {
    private static instance: GameLogicService;
    private hotspotEnabledState: Record<string, boolean> = {};
  
    private constructor() {}
  
    public static getInstance(): GameLogicService {
      if (!GameLogicService.instance) {
        GameLogicService.instance = new GameLogicService();
      }
      return GameLogicService.instance;
    }
  
    public setHotspotEnabled(hotspotId: string, isEnabled: boolean): void {
      this.hotspotEnabledState[hotspotId] = isEnabled;
    }
  
    public isHotspotEnabled(hotspotId: string): boolean {
      return this.hotspotEnabledState[hotspotId] ?? false;
    }
  }