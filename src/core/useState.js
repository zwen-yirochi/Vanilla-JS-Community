import hookSystem from '../core/HookSystem.js';

export function useState(initialValue) {
    const component = hookSystem.currentComponent;

    const hook = hookSystem.registerHook(component, 'useState', () => ({
        value: initialValue,
        setValue: null
    }));

    if (!hook.data.setValue) {
        hook.data.setValue = (newValue) => {
            if (!Object.is(hook.data.value, newValue)) {
                hook.data.value = newValue;
                component.render();
            }
        };
    }

    return [hook.data.value, hook.data.setValue];
}