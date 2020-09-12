export abstract class InputEvent {}

export class ClickEvent extends InputEvent {
  constructor(
    public readonly clientX: number,
    public readonly clientY: number
  ) {
    super();
  }
}

export class InputManager {
  events: InputEvent[];
  private removeListenersFn: (() => void) | undefined;

  constructor(private readonly element: HTMLElement) {
    this.events = [];
  }

  reset() {
    this.events = [];
  }

  handleClick(evt: MouseEvent) {
    this.events.push(new ClickEvent(evt.clientX, evt.clientY));
  }

  addListeners() {
    const clickListener = this.handleClick.bind(this);
    this.element.addEventListener('click', clickListener);
    this.removeListenersFn = () => {
      this.element.removeEventListener('click', clickListener);
    }
    return this; // Chainable
  }

  removeListeners() {
    if (this.removeListenersFn) {
      this.removeListenersFn();
    }
  }
}
