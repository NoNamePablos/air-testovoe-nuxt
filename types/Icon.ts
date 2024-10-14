export namespace Icon {
  export enum Models {
    CHEVRON = 'chevron',
    CLOSE = 'close'
  }

  export interface Base {
    isSvg?: boolean
    filled?: boolean
  }

  export enum Directions {
    RIGHT = 'right',
    LEFT = 'left',
    UP = 'up',
    DOWN = 'down'
  }
}
