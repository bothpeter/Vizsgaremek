import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollLockService {
    private renderer: Renderer2;
    private scrollbarWidth = 0;
    private lockedElements = new Map<HTMLElement, string>();

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.calculateScrollbarWidth();
    }

    private calculateScrollbarWidth(): void {
        const scrollDiv = this.renderer.createElement('div');
        this.renderer.setStyle(scrollDiv, 'width', '100px');
        this.renderer.setStyle(scrollDiv, 'height', '100px');
        this.renderer.setStyle(scrollDiv, 'overflow', 'scroll');
        this.renderer.setStyle(scrollDiv, 'position', 'absolute');
        this.renderer.setStyle(scrollDiv, 'top', '-9999px');
        this.renderer.appendChild(document.body, scrollDiv);

        this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.renderer.removeChild(document.body, scrollDiv);

        this.renderer.setStyle(document.documentElement, '--scrollbar-width', `${this.scrollbarWidth}px`);
    }

    lockScroll(element?: HTMLElement): void {
        const target = element || document.body;

        if (this.lockedElements.has(target)) return;

        const originalPadding = window.getComputedStyle(target).paddingRight;
        this.lockedElements.set(target, originalPadding);

        this.renderer.setStyle(target, 'overflow', 'hidden');
        this.renderer.setStyle(target, 'padding-right', `calc(${originalPadding} + ${this.scrollbarWidth}px)`);
    }

    unlockScroll(element?: HTMLElement): void {
        const target = element || document.body;

        if (!this.lockedElements.has(target)) return;

        this.renderer.setStyle(target, 'overflow', '');
        this.renderer.setStyle(target, 'padding-right', this.lockedElements.get(target));
        this.lockedElements.delete(target);
    }
}