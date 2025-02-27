import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit() {
        this.initScrollAnimations();
    }

    private initScrollAnimations() {
        const animatedElements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');

        const features = this.elementRef.nativeElement.querySelectorAll('.features-grid .feature');
        features.forEach((feature: HTMLElement, index: number) => {
            this.renderer.setStyle(feature, '--animation-order', index);
        });

        const isInViewport = (element: HTMLElement) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                rect.bottom >= 0
            );
        };

        const handleScrollAnimation = () => {
            animatedElements.forEach((element: HTMLElement) => {
                if (isInViewport(element) && !element.classList.contains('animated')) {
                    this.renderer.addClass(element, 'animated');
                }
            });
        };

        handleScrollAnimation();

        window.addEventListener('scroll', handleScrollAnimation);

        window.addEventListener('scroll', () => {
            const parallaxSections = this.elementRef.nativeElement.querySelectorAll('.parallax-section');
            const scrollPosition = window.pageYOffset;

            parallaxSections.forEach((section: HTMLElement) => {
                const speed = section.dataset['speed'] || 0.5;
                this.renderer.setStyle(section, 'background-position-y', `${scrollPosition * Number(speed)}px`);
            });
        });
    }
}