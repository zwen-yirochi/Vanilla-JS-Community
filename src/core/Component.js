import hookSystem from './HookSystem.js';

export default class Component {
    $target;
    state;

    constructor($target) {
        this.debug = true;
        this.componentName = this.constructor.name;


        this.log('생성자 시작', { target: $target });

        this.$target = $target;
        this.render();

        this.log('생성자 완료');
    }


    log(message, data = null) {
        if (this.debug) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${timestamp}] ${this.componentName}: ${message}`, data || '');
        }
    }


    template() {
        this.log('template 호출됨');
        return '';
    }

    render() {
        try {
            hookSystem.startRender(this);
            const html = this.template();
            this.$target.innerHTML = html;
            hookSystem.finishRender();
            this.setEvent();
        } catch (error) {
            hookSystem.finishRender();
            // 에러 처리
        }
    }

    setEvent() {
        this.log('setEvent 시작');
    }

    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };

        this.log('setState 호출됨', {
            oldState,
            newState,
            finalState: this.state
        });

        this.render();
    }
}