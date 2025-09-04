export class HookSystem {
    constructor() {
        this.componentStates = new WeakMap();
        this.currentComponent = null;
        this.isRendering = false;
    }

    registerHook(component, hookType, initializer) {
        // 공통 Hook 등록 로직
        if (!this.componentStates.has(component)) {
            this.componentStates.set(component, {
                hooks: [],
                currentIndex: 0,
                renderCount: 0,
                hookCount: 0
            });
        }

        const state = this.componentStates.get(component);
        const index = state.currentIndex++;

        // Hook 순서 일관성 검증 (개발 모드에서만)
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            if (state.renderCount > 0) {
                if (state.renderCount === 1 && index === 1) {
                    state.hookCount = state.hooks.length;
                }

                if (index >= state.hookCount) {
                    throw new Error(`Hook order changed in ${component.componentName}. Expected ${state.hookCount} hooks, but trying to call hook at index ${index}`);
                }
            }
        }

        if (state.hooks[index] === undefined) {
            state.hooks[index] = {
                type: hookType,
                data: initializer()
            };
        }

        // Hook 타입 검증
        if (state.hooks[index].type !== hookType) {
            throw new Error(`Hook type mismatch at index ${index}. Expected ${state.hooks[index].type}, got ${hookType}`);
        }

        return state.hooks[index];
    }

    startRender(component) {
        if (this.isRendering) {
            throw new Error('Cannot start render while already rendering!');
        }

        this.currentComponent = component;
        this.isRendering = true;

        // Hook 인덱스 리셋 및 렌더 카운트 증가
        if (this.componentStates.has(component)) {
            const componentState = this.componentStates.get(component);
            componentState.currentIndex = 0;
            componentState.renderCount++;
        }
    }

    finishRender() {
        if (!this.isRendering) {
            console.warn('finishRender called but not currently rendering');
            return;
        }

        // 사용되지 않은 Hook이 있는지 검사
        if (this.componentStates.has(this.currentComponent)) {
            const componentState = this.componentStates.get(this.currentComponent);

            // 첫 렌더링이 아니고, 사용된 Hook 개수가 예상보다 적은 경우
            if (componentState.renderCount > 1 &&
                componentState.currentIndex < componentState.hookCount) {
                throw new Error(`Hook count decreased in ${this.currentComponent.componentName}. Expected ${componentState.hookCount} hooks, but only ${componentState.currentIndex} were called`);
            }
        }

        this.currentComponent = null;
        this.isRendering = false;
    }

    // 컴포넌트 정리 시 Hook 데이터도 정리
    cleanupComponent(component) {
        if (this.componentStates.has(component)) {
            this.componentStates.delete(component);
        }
    }

    // 디버깅용 메서드들
    debugComponent(component) {
        if (this.componentStates.has(component)) {
            const state = this.componentStates.get(component);
            console.log(`[DEBUG] ${component.componentName} hooks:`, {
                hookCount: state.hooks.length,
                renderCount: state.renderCount,
                hooks: state.hooks.map((hook, index) => ({
                    index,
                    type: hook.type,
                    data: hook.data
                }))
            });
        }
    }

    getHookCount(component) {
        if (this.componentStates.has(component)) {
            return this.componentStates.get(component).hooks.length;
        }
        return 0;
    }

    // Hook이 올바른 컨텍스트에서 호출되는지 검증
    validateHookCall() {
        if (!this.isRendering) {
            throw new Error('Hook can only be called during render! Make sure you\'re not calling Hook inside loops, conditions, or nested functions.');
        }

        if (!this.currentComponent) {
            throw new Error('No component context found! Hook must be called within a Component.');
        }
    }
}

const hookSystem = new HookSystem();
export default hookSystem;