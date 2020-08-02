import * as CM from './ControlManager';

export class OnscreenControls {
    
    private controlManager: CM.ControlManager;

    constructor(controlManager:CM.ControlManager){
        
        this.controlManager = controlManager;
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