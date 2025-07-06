import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="flex items-center mt-8">
      <div class="flex flex-col items-center">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center border-2"
          [ngClass]="{
            'border-blue-500 bg-blue-500 text-white': currentStep() >= 1,
            'border-gray-300 bg-white text-gray-500': currentStep() < 1
          }"
        >
          1
        </div>
        <span class="text-xs mt-1">E-mail</span>
      </div>

      <div
        class="w-12 h-0.5 mx-2"
        [ngClass]="{
          'bg-blue-500': currentStep() >= 2,
          'bg-gray-300': currentStep() < 2
        }"
      ></div>

      <div class="flex flex-col items-center">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center border-2"
          [ngClass]="{
            'border-blue-500 bg-blue-500 text-white': currentStep() >= 2,
            'border-gray-300 bg-white text-gray-500': currentStep() < 2
          }"
        >
          2
        </div>
        <span class="text-xs mt-1">Código</span>
      </div>

      <div
        class="w-12 h-0.5 mx-2"
        [ngClass]="{
          'bg-blue-500': currentStep() >= 3,
          'bg-gray-300': currentStep() < 3
        }"
      ></div>

      <div class="flex flex-col items-center">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center border-2"
          [ngClass]="{
            'border-blue-500 bg-blue-500 text-white': currentStep() >= 3,
            'border-gray-300 bg-white text-gray-500': currentStep() < 3
          }"
        >
          3
        </div>
        <span class="text-xs mt-1">Senha</span>
      </div>
    </div>
  `,
})
export class StepIndicatorComponent {
  currentStep = input.required<number>();
}
