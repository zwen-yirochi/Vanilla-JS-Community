import Component from '../core/Component.js';
import { useState } from '../core/useState.js';

export default class Counter extends Component {
    template() {
        const [count, setCount] = useState(0);
        const [step, setStep] = useState(1);

        window.handleIncrement = () => {
            setCount(count + step);
        };

        window.handleDecrement = () => {
            setCount(count - step);
        };

        window.handleStepChange = (event) => {
            setStep(parseInt(event.target.value) || 1);
        };

        return `
            <div style="padding: 20px; border: 1px solid #ccc;">
                <h2>Counter</h2>
                <p>현재 값: <strong>${count}</strong></p>
                <p>
                    증가 단위: 
                    <input type="number" value="${step}" onchange="handleStepChange(event)" min="1" max="10">
                </p>
                <button onclick="handleIncrement()">+${step}</button>
                <button onclick="handleDecrement()">-${step}</button>
            </div>
        `;
    }
}