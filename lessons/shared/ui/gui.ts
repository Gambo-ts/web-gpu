import type { GUI, GUIController, LessonSettings } from '../types.js';

let datGUI: any = null;

async function loadDatGUI(): Promise<any> {
  if (datGUI) return datGUI;
  const mod = await import('dat.gui');
  datGUI = mod.default;
  return datGUI;
}

export interface GUIOptions {
  autoPlace?: boolean;
  container?: HTMLElement;
  width?: number;
}

export async function createGUI(options: GUIOptions = {}): Promise<GUI> {
  const DatGUI = await loadDatGUI();
  const gui = new DatGUI({ autoPlace: options.autoPlace ?? false });

  if (options.container) {
    options.container.appendChild(gui.domElement);
  } else if (!options.autoPlace) {
    Object.assign(gui.domElement.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      zIndex: '1000',
      maxWidth: `${options.width ?? 300}px`,
    });
    document.body.appendChild(gui.domElement);
  }

  return gui;
}

export function addFolder(gui: GUI, name: string): GUI {
  return gui.addFolder(name);
}

export function addSlider(
  gui: GUI,
  object: LessonSettings,
  property: string,
  min: number,
  max: number,
  step?: number
): GUIController {
  const controller = gui.add(object, property, min, max);
  if (step !== undefined) {
    controller.step(step);
  }
  return controller;
}

export function addVector2(
  gui: GUI,
  object: LessonSettings,
  property: string,
  min: number,
  max: number,
  labels: [string, string] = ['x', 'y']
): [GUIController, GUIController] {
  const arr = object[property] as [number, number];
  const c1 = gui.add(arr, '0', min, max).name(`${property}.${labels[0]}`);
  const c2 = gui.add(arr, '1', min, max).name(`${property}.${labels[1]}`);
  return [c1, c2];
}

export function addVector3(
  gui: GUI,
  object: LessonSettings,
  property: string,
  min: number,
  max: number,
  labels: [string, string, string] = ['x', 'y', 'z']
): [GUIController, GUIController, GUIController] {
  const arr = object[property] as [number, number, number];
  const c1 = gui.add(arr, '0', min, max).name(`${property}.${labels[0]}`);
  const c2 = gui.add(arr, '1', min, max).name(`${property}.${labels[1]}`);
  const c3 = gui.add(arr, '2', min, max).name(`${property}.${labels[2]}`);
  return [c1, c2, c3];
}

export function addSelect(
  gui: GUI,
  object: LessonSettings,
  property: string,
  options: string[]
): GUIController {
  return gui.add(object, property, options);
}

export function addCheckbox(gui: GUI, object: LessonSettings, property: string): GUIController {
  return gui.add(object, property);
}

export function addButton(gui: GUI, object: LessonSettings, property: string): GUIController {
  return gui.add(object, property);
}

export function destroyGUI(gui: GUI): void {
  gui.destroy();
}
