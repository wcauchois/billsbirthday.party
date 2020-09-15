export class ResourceManager {
  private static readonly instance = new ResourceManager();
  private readonly imageMap = new Map<string, 'loading' | HTMLImageElement>();

  static get() {
    return ResourceManager.instance;
  }

  private loadImage(path: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = path;
    });
  }

  image(path: string): HTMLImageElement | undefined {
    if (!this.imageMap.has(path)) {
      this.imageMap.set(path, 'loading');
      this.loadImage(path).then(image => this.imageMap.set(path, image));
    } else {
      const entry = this.imageMap.get(path);
      return entry === 'loading' ? undefined : entry;
    }
  }
}
