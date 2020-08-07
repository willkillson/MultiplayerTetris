import Mousetrap from 'mousetrap';
import * as CM from './ControlManager';
import * as T from '../../common-utilities/types';
import * as COMMAND from './Command';
import * as THREE from 'three';

export class KeyboardControls {
  private MouseTrap: any;
  private controlManager: CM.ControlManager;

  constructor(controlManager:CM.ControlManager){
    this.controlManager = controlManager;
    this.MouseTrap = Mousetrap;
    // Move left
    this.MouseTrap.bind('a', ()=>{
      let newCommand = new COMMAND.Command("","movement", new THREE.Vector3(-1,0,0));
      this.controlManager.addCommand(newCommand);
    });
    // Move down
    this.MouseTrap.bind('s', ()=>{
      let newCommand = new COMMAND.Command("","movement", new THREE.Vector3(0,-1,0));
      this.controlManager.addCommand(newCommand);
    });
    // right
    this.MouseTrap.bind('d', ()=>{
      let newCommand = new COMMAND.Command("","movement", new THREE.Vector3(1,0,0));
      this.controlManager.addCommand(newCommand);
    });
    // Rotate CW
    this.MouseTrap.bind('k', ()=>{
      let newCommand = new COMMAND.Command("","rotation", new THREE.Vector3(0,0,-Math.PI/2));
      this.controlManager.addCommand(newCommand);
    });
    // Rotate CCW
    this.MouseTrap.bind('j', ()=>{
      let newCommand = new COMMAND.Command("","rotation", new THREE.Vector3(0,0,Math.PI/2));
      this.controlManager.addCommand(newCommand);
    });
  }
}