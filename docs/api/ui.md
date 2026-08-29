# UI Components API

## GUI (dat.GUI Wrapper)

### createGUI

Create a dat.GUI instance with consistent styling.

```typescript
async function createGUI(options?: {
  autoPlace?: boolean; // default: false
  container?: HTMLElement; // default: document.body
  width?: number; // default: 300
}): Promise<GUI>;
```

### GUI Interface

```typescript
interface GUI {
  add(object: any, property: string, min?: number, max?: number): GUIController;
  add(object: any, property: string, options: string[]): GUIController;
  addFolder(name: string): GUI;
  destroy(): void;
  domElement: HTMLElement;
}

interface GUIController {
  onChange(callback: () => void): GUIController;
  name(label: string): GUIController;
  step(step: number): GUIController;
}
```

### Helper Functions

```typescript
function addFolder(gui: GUI, name: string): GUI;
function addSlider(
  gui: GUI,
  object: any,
  property: string,
  min: number,
  max: number,
  step?: number
): GUIController;
function addVector2(
  gui: GUI,
  object: any,
  property: string,
  min: number,
  max: number,
  labels?: [string, string]
): [GUIController, GUIController];
function addVector3(
  gui: GUI,
  object: any,
  property: string,
  min: number,
  max: number,
  labels?: [string, string, string]
): [GUIController, GUIController, GUIController];
function addSelect(gui: GUI, object: any, property: string, options: string[]): GUIController;
function addCheckbox(gui: GUI, object: any, property: string): GUIController;
function addButton(gui: GUI, object: any, property: string): GUIController;
function destroyGUI(gui: GUI): void;
```

### Example: Basic Controls

```typescript
import {
  createGUI,
  addSlider,
  addVector2,
  addSelect,
  addCheckbox,
  addButton,
} from '@shared/ui/index.js';

const settings = {
  rotation: 0,
  scale: 1,
  translation: [0, 0] as [number, number],
  color: '#ff0000',
  mode: 'wireframe' as 'wireframe' | 'solid' | 'points',
  enabled: true,
  reset: () => {
    /* reset logic */
  },
};

const gui = await createGUI({ width: 300 });

// Sliders
addSlider(gui, settings, 'rotation', 0, Math.PI * 2, 0.01).name('Rotation');
addSlider(gui, settings, 'scale', 0.1, 5, 0.1).name('Scale');

// Vector controls
addVector2(gui, settings, 'translation', -500, 500, ['X', 'Y']);

// Select dropdown
addSelect(gui, settings, 'mode', ['wireframe', 'solid', 'points']).name('Render Mode');

// Checkbox
addCheckbox(gui, settings, 'enabled').name('Enabled');

// Button
addButton(gui, settings, 'reset').name('Reset View');

// React to changes
gui.onChange(() => {
  render();
});

// Or per-control
addSlider(gui, settings, 'rotation', 0, Math.PI * 2).onChange(render);
```

### Example: Organized with Folders

```typescript
const gui = await createGUI();

const transformFolder = gui.addFolder('Transform');
addSlider(transformFolder, settings, 'rotation', -Math.PI, Math.PI);
addSlider(transformFolder, settings, 'scale', 0.1, 3);
addVector3(transformFolder, settings, 'translation', -10, 10, ['X', 'Y', 'Z']);

const materialFolder = gui.addFolder('Material');
addSelect(materialFolder, settings, 'shader', ['basic', 'phong', 'pbr']);
addSlider(materialFolder, settings, 'roughness', 0, 1);
addSlider(materialFolder, settings, 'metalness', 0, 1);
```

## Error Overlay

User-friendly error display for WebGPU initialization failures.

### Functions

```typescript
function showError(message: string, details?: string): void;
function hideError(): void;
function handleWebGPUError(error: unknown): void;
```

### Automatic Error Handling

The error overlay automatically captures:

- Unhandled promise rejections
- Uncaught JavaScript errors
- WebGPU-specific errors (adapter/device failures)

### Example: Custom Error Handling

```typescript
import { handleWebGPUError } from '@shared/ui/index.js';

async function initWebGPU() {
  try {
    const adapter = await navigator.gpu?.requestAdapter();
    if (!adapter) throw new Error('No WebGPU adapter found');
    return await adapter.requestDevice();
  } catch (error) {
    handleWebGPUError(error); // Shows friendly overlay
    throw error;
  }
}
```

### Error Overlay Features

- **Dark theme** matching lesson aesthetic
- **Dismissible** with button
- **Technical details** in collapsible section
- **Auto-shows** for WebGPU-related errors
- **Accessible** with proper ARIA attributes

## Best Practices

1. **Create GUI after WebGPU init** - ensures canvas exists
2. **Use `onChange` for live updates** - avoid polling
3. **Group related controls** with folders
4. **Clean up** with `destroyGUI()` when lesson unloads
5. **Use typed settings objects** for TypeScript support

### Cleanup Pattern

```typescript
let gui: GUI | null = null;

async function main() {
  // ... WebGPU setup ...

  gui = await createGUI();
  addSlider(gui, settings, 'rotation', 0, Math.PI * 2).onChange(render);

  window.addEventListener('beforeunload', () => {
    if (gui) destroyGUI(gui);
  });
}
```
