import Mousetrap from 'mousetrap';
import * as CM from './ControlManager';

export class KeyboardControls {
  private MouseTrap: any;
  private controlManager: CM.ControlManager;

  constructor(controlManager:CM.ControlManager){

    this.controlManager = controlManager;
    this.MouseTrap = Mousetrap;

    // Move left
    this.MouseTrap.bind('a', ()=>{
      this.controlManager.addCommand('left');
    });
    // Move down
    this.MouseTrap.bind('s', ()=>{
      this.controlManager.addCommand('down');
    });
    // right
    this.MouseTrap.bind('d', ()=>{
      this.controlManager.addCommand('right');
    });
    // Rotate CW
    this.MouseTrap.bind('k', ()=>{
      this.controlManager.addCommand('cw');
    });
    // Rotate CCW
    this.MouseTrap.bind('j', ()=>{
      this.controlManager.addCommand('ccw');
    });
  }

  
}