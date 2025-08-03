interface HistoryState {
  gridComponents: Record<string, any>;
  gridSize: { columns: number; rows: number };
  currentPage: string;
}

export class HistoryManager {
  private history: HistoryState[] = [];
  private currentIndex = -1;
  private maxHistorySize = 50;

  pushState(state: HistoryState): void {
    // Remove any redo history if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add the new state
    this.history.push(JSON.parse(JSON.stringify(state))); // Deep clone
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  undo(): HistoryState | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  redo(): HistoryState | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  getCurrentState(): HistoryState | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }
}
