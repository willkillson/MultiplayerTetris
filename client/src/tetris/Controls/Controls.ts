import Mousetrap from 'mousetrap';
import * as CM from './ControlManager';

export class Controls {
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

    ////////////OnScreen
    // @ts-ignore
    window['document'].getElementById('button-left').onclick = () => {
      controlManager.addCommand('left');
    };
    // @ts-ignore
    window['document'].getElementById('button-down').onclick = () => {
      controlManager.addCommand('down');
    };
    // @ts-ignore
    window['document'].getElementById('button-right').onclick = () => {
      controlManager.addCommand('right');
    };
  }
  
}