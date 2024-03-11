import { Component, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { DefaultPlyrDriver } from '../plyr-driver/default-plyr-driver';
import * as i0 from "@angular/core";
export class PlyrComponent {
    get player() {
        return this.playerChange.getValue();
    }
    constructor(elementRef, ngZone, renderer) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.playerChange = new BehaviorSubject(null);
        this.events = new Map();
        this.plyrType = 'video';
        // ngx-plyr events
        this.plyrInit = this.playerChange.pipe(filter(player => !!player));
        // standard media events
        this.plyrProgress = this.createLazyEvent('progress');
        this.plyrPlaying = this.createLazyEvent('playing');
        this.plyrPlay = this.createLazyEvent('play');
        this.plyrPause = this.createLazyEvent('pause');
        this.plyrTimeUpdate = this.createLazyEvent('timeupdate');
        this.plyrVolumeChange = this.createLazyEvent('volumechange');
        this.plyrSeeking = this.createLazyEvent('seeking');
        this.plyrSeeked = this.createLazyEvent('seeked');
        this.plyrRateChange = this.createLazyEvent('ratechange');
        this.plyrEnded = this.createLazyEvent('ended');
        this.plyrEnterFullScreen = this.createLazyEvent('enterfullscreen');
        this.plyrExitFullScreen = this.createLazyEvent('exitfullscreen');
        this.plyrCaptionsEnabled = this.createLazyEvent('captionsenabled');
        this.plyrCaptionsDisabled = this.createLazyEvent('captionsdisabled');
        this.plyrLanguageChange = this.createLazyEvent('languagechange');
        this.plyrControlsHidden = this.createLazyEvent('controlshidden');
        this.plyrControlsShown = this.createLazyEvent('controlsshown');
        this.plyrReady = this.createLazyEvent('ready');
        // HTML5 events
        this.plyrLoadStart = this.createLazyEvent('loadstart');
        this.plyrLoadedData = this.createLazyEvent('loadeddata');
        this.plyrLoadedMetadata = this.createLazyEvent('loadedmetadata');
        this.plyrQualityChange = this.createLazyEvent('qualitychange');
        this.plyrCanPlay = this.createLazyEvent('canplay');
        this.plyrCanPlayThrough = this.createLazyEvent('canplaythrough');
        this.plyrStalled = this.createLazyEvent('stalled');
        this.plyrWaiting = this.createLazyEvent('waiting');
        this.plyrEmptied = this.createLazyEvent('emptied');
        this.plyrCueChange = this.createLazyEvent('cuechange');
        this.plyrError = this.createLazyEvent('error');
        // YouTube events
        this.plyrStateChange = this.createLazyEvent('statechange');
        this.subscriptions = [];
    }
    ngOnChanges(changes) {
        this.subscriptions.push(this.plyrInit.pipe(first()).subscribe((player) => {
            const reinitTriggers = [changes.plyrOptions, changes.plyrPlaysInline, changes.plyrCrossOrigin].filter(t => !!t);
            if (reinitTriggers.length) {
                if (reinitTriggers.some(t => !t.firstChange)) {
                    this.initPlyr(true);
                }
            }
            else {
                this.updatePlyrSource(player);
            }
        }));
    }
    ngOnDestroy() {
        this.destroyPlayer();
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    ngAfterViewInit() {
        this.initPlyr();
    }
    initPlyr(force = false) {
        if (force || !this.player) {
            this.ngZone.runOutsideAngular(() => {
                this.destroyPlayer();
                this.driver = this.plyrDriver || new DefaultPlyrDriver();
                this.ensureVideoElement();
                const newPlayer = this.driver.create({
                    videoElement: this.videoElement,
                    options: this.plyrOptions,
                });
                this.updatePlyrSource(newPlayer);
                this.playerChange.next(newPlayer);
            });
        }
    }
    updatePlyrSource(plyr) {
        this.driver.updateSource({
            videoElement: this.videoElement,
            plyr,
            source: {
                type: this.plyrType,
                title: this.plyrTitle,
                sources: this.plyrSources,
                poster: this.plyrPoster,
                tracks: this.plyrTracks,
            },
        });
    }
    // see https://stackoverflow.com/a/53704102/1990451
    createLazyEvent(name) {
        return this.plyrInit.pipe(switchMap(() => new Observable(observer => this.on(name, (data) => this.ngZone.run(() => observer.next(data))))));
    }
    destroyPlayer() {
        if (this.player) {
            Array.from(this.events.keys()).forEach(name => this.off(name));
            this.driver.destroy({
                plyr: this.player,
            });
            this.videoElement = null;
        }
    }
    get hostElement() {
        return this.elementRef.nativeElement;
    }
    // this method is required because the plyr inserts clone of the original element on destroy
    // so we catch the clone element right here and reuse it
    ensureVideoElement() {
        const videoElement = this.hostElement.querySelector('video');
        if (videoElement) {
            this.videoElement = videoElement;
        }
        else {
            this.videoElement = this.renderer.createElement('video');
            this.videoElement.controls = true;
            if (this.plyrCrossOrigin) {
                this.videoElement.setAttribute('crossorigin', '');
            }
            if (this.plyrPlaysInline) {
                this.videoElement.setAttribute('playsinline', '');
            }
            this.renderer.appendChild(this.hostElement, this.videoElement);
        }
    }
    on(name, handler) {
        this.events.set(name, handler);
        this.player.on(name, handler);
    }
    off(name) {
        this.player.off(name, this.events.get(name));
        this.events.delete(name);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.4", ngImport: i0, type: PlyrComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.4", type: PlyrComponent, selector: "plyr, [plyr]", inputs: { plyrDriver: "plyrDriver", plyrType: "plyrType", plyrTitle: "plyrTitle", plyrPoster: "plyrPoster", plyrSources: "plyrSources", plyrTracks: "plyrTracks", plyrOptions: "plyrOptions", plyrCrossOrigin: "plyrCrossOrigin", plyrPlaysInline: "plyrPlaysInline" }, outputs: { plyrInit: "plyrInit", plyrProgress: "plyrProgress", plyrPlaying: "plyrPlaying", plyrPlay: "plyrPlay", plyrPause: "plyrPause", plyrTimeUpdate: "plyrTimeUpdate", plyrVolumeChange: "plyrVolumeChange", plyrSeeking: "plyrSeeking", plyrSeeked: "plyrSeeked", plyrRateChange: "plyrRateChange", plyrEnded: "plyrEnded", plyrEnterFullScreen: "plyrEnterFullScreen", plyrExitFullScreen: "plyrExitFullScreen", plyrCaptionsEnabled: "plyrCaptionsEnabled", plyrCaptionsDisabled: "plyrCaptionsDisabled", plyrLanguageChange: "plyrLanguageChange", plyrControlsHidden: "plyrControlsHidden", plyrControlsShown: "plyrControlsShown", plyrReady: "plyrReady", plyrLoadStart: "plyrLoadStart", plyrLoadedData: "plyrLoadedData", plyrLoadedMetadata: "plyrLoadedMetadata", plyrQualityChange: "plyrQualityChange", plyrCanPlay: "plyrCanPlay", plyrCanPlayThrough: "plyrCanPlayThrough", plyrStalled: "plyrStalled", plyrWaiting: "plyrWaiting", plyrEmptied: "plyrEmptied", plyrCueChange: "plyrCueChange", plyrError: "plyrError", plyrStateChange: "plyrStateChange" }, viewQueries: [{ propertyName: "vr", first: true, predicate: ["v"], descendants: true }], exportAs: ["plyr"], usesOnChanges: true, ngImport: i0, template: "", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.4", ngImport: i0, type: PlyrComponent, decorators: [{
            type: Component,
            args: [{ selector: 'plyr, [plyr]', exportAs: 'plyr', template: "" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }], propDecorators: { plyrDriver: [{
                type: Input
            }], plyrType: [{
                type: Input
            }], plyrTitle: [{
                type: Input
            }], plyrPoster: [{
                type: Input
            }], plyrSources: [{
                type: Input
            }], plyrTracks: [{
                type: Input
            }], plyrOptions: [{
                type: Input
            }], plyrCrossOrigin: [{
                type: Input
            }], plyrPlaysInline: [{
                type: Input
            }], vr: [{
                type: ViewChild,
                args: ['v']
            }], plyrInit: [{
                type: Output
            }], plyrProgress: [{
                type: Output
            }], plyrPlaying: [{
                type: Output
            }], plyrPlay: [{
                type: Output
            }], plyrPause: [{
                type: Output
            }], plyrTimeUpdate: [{
                type: Output
            }], plyrVolumeChange: [{
                type: Output
            }], plyrSeeking: [{
                type: Output
            }], plyrSeeked: [{
                type: Output
            }], plyrRateChange: [{
                type: Output
            }], plyrEnded: [{
                type: Output
            }], plyrEnterFullScreen: [{
                type: Output
            }], plyrExitFullScreen: [{
                type: Output
            }], plyrCaptionsEnabled: [{
                type: Output
            }], plyrCaptionsDisabled: [{
                type: Output
            }], plyrLanguageChange: [{
                type: Output
            }], plyrControlsHidden: [{
                type: Output
            }], plyrControlsShown: [{
                type: Output
            }], plyrReady: [{
                type: Output
            }], plyrLoadStart: [{
                type: Output
            }], plyrLoadedData: [{
                type: Output
            }], plyrLoadedMetadata: [{
                type: Output
            }], plyrQualityChange: [{
                type: Output
            }], plyrCanPlay: [{
                type: Output
            }], plyrCanPlayThrough: [{
                type: Output
            }], plyrStalled: [{
                type: Output
            }], plyrWaiting: [{
                type: Output
            }], plyrEmptied: [{
                type: Output
            }], plyrCueChange: [{
                type: Output
            }], plyrError: [{
                type: Output
            }], plyrStateChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx5ci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcGx5ci9zcmMvbGliL3BseXIvcGx5ci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcGx5ci9zcmMvbGliL3BseXIvcGx5ci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBNEIsS0FBSyxFQUFnQyxNQUFNLEVBQTJCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVwSyxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDakUsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7O0FBU3ZFLE1BQU0sT0FBTyxhQUFhO0lBSXhCLElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBcUVELFlBQ1UsVUFBc0MsRUFDdEMsTUFBYyxFQUNkLFFBQW1CO1FBRm5CLGVBQVUsR0FBVixVQUFVLENBQTRCO1FBQ3RDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBNUVyQixpQkFBWSxHQUFHLElBQUksZUFBZSxDQUFPLElBQUksQ0FBQyxDQUFDO1FBTS9DLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBSWxCLGFBQVEsR0FBbUIsT0FBTyxDQUFDO1FBa0I1QyxrQkFBa0I7UUFDUixhQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUF1QixDQUFD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Q0csV0FBVztzQkFBcEIsTUFBTTtnQkFDRyxVQUFVO3NCQUFuQixNQUFNO2dCQUNHLGNBQWM7c0JBQXZCLE1BQU07Z0JBQ0csU0FBUztzQkFBbEIsTUFBTTtnQkFDRyxtQkFBbUI7c0JBQTVCLE1BQU07Z0JBQ0csa0JBQWtCO3NCQUEzQixNQUFNO2dCQUNHLG1CQUFtQjtzQkFBNUIsTUFBTTtnQkFDRyxvQkFBb0I7c0JBQTdCLE1BQU07Z0JBQ0csa0JBQWtCO3NCQUEzQixNQUFNO2dCQUNHLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFDRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBQ0csU0FBUztzQkFBbEIsTUFBTTtnQkFHRyxhQUFhO3NCQUF0QixNQUFNO2dCQUNHLGNBQWM7c0JBQXZCLE1BQU07Z0JBQ0csa0JBQWtCO3NCQUEzQixNQUFNO2dCQUNHLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFDRyxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFDRyxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLFdBQVc7c0JBQXBCLE1BQU07Z0JBQ0csV0FBVztzQkFBcEIsTUFBTTtnQkFDRyxhQUFhO3NCQUF0QixNQUFNO2dCQUNHLFNBQVM7c0JBQWxCLE1BQU07Z0JBR0csZUFBZTtzQkFBeEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3V0cHV0LCBSZW5kZXJlcjIsIFNpbXBsZUNoYW5nZSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBQbHlyIGZyb20gJ3BseXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgZmlyc3QsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERlZmF1bHRQbHlyRHJpdmVyIH0gZnJvbSAnLi4vcGx5ci1kcml2ZXIvZGVmYXVsdC1wbHlyLWRyaXZlcic7XG5pbXBvcnQgeyBQbHlyRHJpdmVyIH0gZnJvbSAnLi4vcGx5ci1kcml2ZXIvcGx5ci1kcml2ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwbHlyLCBbcGx5cl0nLCAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gIHRlbXBsYXRlVXJsOiAnLi9wbHlyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGx5ci5jb21wb25lbnQuY3NzJ10sXG4gIGV4cG9ydEFzOiAncGx5cidcbn0pXG5leHBvcnQgY2xhc3MgUGx5ckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcblxuICBwcml2YXRlIHBsYXllckNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UGx5cj4obnVsbCk7XG5cbiAgZ2V0IHBsYXllcigpOiBQbHlyIHtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXJDaGFuZ2UuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZXZlbnRzID0gbmV3IE1hcCgpO1xuXG4gIEBJbnB1dCgpIHBseXJEcml2ZXI6IFBseXJEcml2ZXI7XG5cbiAgQElucHV0KCkgcGx5clR5cGU6IFBseXIuTWVkaWFUeXBlID0gJ3ZpZGVvJztcblxuICBASW5wdXQoKSBwbHlyVGl0bGU6IHN0cmluZztcblxuICBASW5wdXQoKSBwbHlyUG9zdGVyOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgcGx5clNvdXJjZXM6IFBseXIuU291cmNlW107XG5cbiAgQElucHV0KCkgcGx5clRyYWNrczogUGx5ci5UcmFja1tdO1xuXG4gIEBJbnB1dCgpIHBseXJPcHRpb25zOiBQbHlyLk9wdGlvbnM7XG5cbiAgQElucHV0KCkgcGx5ckNyb3NzT3JpZ2luOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpIHBseXJQbGF5c0lubGluZTogYm9vbGVhbjtcblxuICBAVmlld0NoaWxkKCd2JykgcHJpdmF0ZSB2cjogRWxlbWVudFJlZjtcblxuICAvLyBuZ3gtcGx5ciBldmVudHNcbiAgQE91dHB1dCgpIHBseXJJbml0ID0gdGhpcy5wbGF5ZXJDaGFuZ2UucGlwZShmaWx0ZXIocGxheWVyID0+ICEhcGxheWVyKSkgYXMgRXZlbnRFbWl0dGVyPFBseXI+O1xuXG4gIC8vIHN0YW5kYXJkIG1lZGlhIGV2ZW50c1xuICBAT3V0cHV0KCkgcGx5clByb2dyZXNzID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3Byb2dyZXNzJyk7XG4gIEBPdXRwdXQoKSBwbHlyUGxheWluZyA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdwbGF5aW5nJyk7XG4gIEBPdXRwdXQoKSBwbHlyUGxheSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdwbGF5Jyk7XG4gIEBPdXRwdXQoKSBwbHlyUGF1c2UgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgncGF1c2UnKTtcbiAgQE91dHB1dCgpIHBseXJUaW1lVXBkYXRlID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3RpbWV1cGRhdGUnKTtcbiAgQE91dHB1dCgpIHBseXJWb2x1bWVDaGFuZ2UgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgndm9sdW1lY2hhbmdlJyk7XG4gIEBPdXRwdXQoKSBwbHlyU2Vla2luZyA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdzZWVraW5nJyk7XG4gIEBPdXRwdXQoKSBwbHlyU2Vla2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3NlZWtlZCcpO1xuICBAT3V0cHV0KCkgcGx5clJhdGVDaGFuZ2UgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgncmF0ZWNoYW5nZScpO1xuICBAT3V0cHV0KCkgcGx5ckVuZGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2VuZGVkJyk7XG4gIEBPdXRwdXQoKSBwbHlyRW50ZXJGdWxsU2NyZWVuID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2VudGVyZnVsbHNjcmVlbicpO1xuICBAT3V0cHV0KCkgcGx5ckV4aXRGdWxsU2NyZWVuID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2V4aXRmdWxsc2NyZWVuJyk7XG4gIEBPdXRwdXQoKSBwbHlyQ2FwdGlvbnNFbmFibGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2NhcHRpb25zZW5hYmxlZCcpO1xuICBAT3V0cHV0KCkgcGx5ckNhcHRpb25zRGlzYWJsZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnY2FwdGlvbnNkaXNhYmxlZCcpO1xuICBAT3V0cHV0KCkgcGx5ckxhbmd1YWdlQ2hhbmdlID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2xhbmd1YWdlY2hhbmdlJyk7XG4gIEBPdXRwdXQoKSBwbHlyQ29udHJvbHNIaWRkZW4gPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnY29udHJvbHNoaWRkZW4nKTtcbiAgQE91dHB1dCgpIHBseXJDb250cm9sc1Nob3duID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2NvbnRyb2xzc2hvd24nKTtcbiAgQE91dHB1dCgpIHBseXJSZWFkeSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdyZWFkeScpO1xuXG4gIC8vIEhUTUw1IGV2ZW50c1xuICBAT3V0cHV0KCkgcGx5ckxvYWRTdGFydCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdsb2Fkc3RhcnQnKTtcbiAgQE91dHB1dCgpIHBseXJMb2FkZWREYXRhID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2xvYWRlZGRhdGEnKTtcbiAgQE91dHB1dCgpIHBseXJMb2FkZWRNZXRhZGF0YSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdsb2FkZWRtZXRhZGF0YScpO1xuICBAT3V0cHV0KCkgcGx5clF1YWxpdHlDaGFuZ2UgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgncXVhbGl0eWNoYW5nZScpO1xuICBAT3V0cHV0KCkgcGx5ckNhblBsYXkgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnY2FucGxheScpO1xuICBAT3V0cHV0KCkgcGx5ckNhblBsYXlUaHJvdWdoID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2NhbnBsYXl0aHJvdWdoJyk7XG4gIEBPdXRwdXQoKSBwbHlyU3RhbGxlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdzdGFsbGVkJyk7XG4gIEBPdXRwdXQoKSBwbHlyV2FpdGluZyA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCd3YWl0aW5nJyk7XG4gIEBPdXRwdXQoKSBwbHlyRW1wdGllZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdlbXB0aWVkJyk7XG4gIEBPdXRwdXQoKSBwbHlyQ3VlQ2hhbmdlID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2N1ZWNoYW5nZScpO1xuICBAT3V0cHV0KCkgcGx5ckVycm9yID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2Vycm9yJyk7XG5cbiAgLy8gWW91VHViZSBldmVudHNcbiAgQE91dHB1dCgpIHBseXJTdGF0ZUNoYW5nZSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdzdGF0ZWNoYW5nZScpO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBwcml2YXRlIGRyaXZlcjogUGx5ckRyaXZlcjtcblxuICBwcml2YXRlIHZpZGVvRWxlbWVudDogSFRNTFZpZGVvRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+LFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICApIHtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IHsgW3AgaW4ga2V5b2YgUGx5ckNvbXBvbmVudF0/OiBTaW1wbGVDaGFuZ2U7IH0pIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLnBseXJJbml0LnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKChwbGF5ZXI6IFBseXIpID0+IHtcbiAgICAgIGNvbnN0IHJlaW5pdFRyaWdnZXJzID0gW2NoYW5nZXMucGx5ck9wdGlvbnMsIGNoYW5nZXMucGx5clBsYXlzSW5saW5lLCBjaGFuZ2VzLnBseXJDcm9zc09yaWdpbl0uZmlsdGVyKHQgPT4gISF0KTtcblxuICAgICAgaWYgKHJlaW5pdFRyaWdnZXJzLmxlbmd0aCkge1xuICAgICAgICBpZiAocmVpbml0VHJpZ2dlcnMuc29tZSh0ID0+ICF0LmZpcnN0Q2hhbmdlKSkge1xuICAgICAgICAgIHRoaXMuaW5pdFBseXIodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlUGx5clNvdXJjZShwbGF5ZXIpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveVBsYXllcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHMgPT4gcy51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmluaXRQbHlyKCk7XG4gIH1cblxuICBwcml2YXRlIGluaXRQbHlyKGZvcmNlID0gZmFsc2UpIHtcbiAgICBpZiAoZm9yY2UgfHwgIXRoaXMucGxheWVyKSB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuZGVzdHJveVBsYXllcigpO1xuXG4gICAgICAgIHRoaXMuZHJpdmVyID0gdGhpcy5wbHlyRHJpdmVyIHx8IG5ldyBEZWZhdWx0UGx5ckRyaXZlcigpO1xuXG4gICAgICAgIHRoaXMuZW5zdXJlVmlkZW9FbGVtZW50KCk7XG5cbiAgICAgICAgY29uc3QgbmV3UGxheWVyID0gdGhpcy5kcml2ZXIuY3JlYXRlKHtcbiAgICAgICAgICB2aWRlb0VsZW1lbnQ6IHRoaXMudmlkZW9FbGVtZW50LFxuICAgICAgICAgIG9wdGlvbnM6IHRoaXMucGx5ck9wdGlvbnMsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlUGx5clNvdXJjZShuZXdQbGF5ZXIpO1xuXG4gICAgICAgIHRoaXMucGxheWVyQ2hhbmdlLm5leHQobmV3UGxheWVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUGx5clNvdXJjZShwbHlyOiBQbHlyKSB7XG4gICAgdGhpcy5kcml2ZXIudXBkYXRlU291cmNlKHtcbiAgICAgIHZpZGVvRWxlbWVudDogdGhpcy52aWRlb0VsZW1lbnQsXG4gICAgICBwbHlyLFxuICAgICAgc291cmNlOiB7XG4gICAgICAgIHR5cGU6IHRoaXMucGx5clR5cGUsXG4gICAgICAgIHRpdGxlOiB0aGlzLnBseXJUaXRsZSxcbiAgICAgICAgc291cmNlczogdGhpcy5wbHlyU291cmNlcyxcbiAgICAgICAgcG9zdGVyOiB0aGlzLnBseXJQb3N0ZXIsXG4gICAgICAgIHRyYWNrczogdGhpcy5wbHlyVHJhY2tzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTM3MDQxMDIvMTk5MDQ1MVxuICBwcml2YXRlIGNyZWF0ZUxhenlFdmVudDxUIGV4dGVuZHMgUGx5ci5QbHlyRXZlbnQ+KG5hbWU6IFBseXIuU3RhbmRhcmRFdmVudCB8IFBseXIuSHRtbDVFdmVudCB8IFBseXIuWW91dHViZUV2ZW50KTogRXZlbnRFbWl0dGVyPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5wbHlySW5pdC5waXBlKFxuICAgICAgc3dpdGNoTWFwKCgpID0+IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHRoaXMub24obmFtZSwgKGRhdGE6IFQpID0+IHRoaXMubmdab25lLnJ1bigoKSA9PiBvYnNlcnZlci5uZXh0KGRhdGEpKSkpKVxuICAgICkgYXMgRXZlbnRFbWl0dGVyPFQ+O1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95UGxheWVyKCkge1xuICAgIGlmICh0aGlzLnBsYXllcikge1xuICAgICAgQXJyYXkuZnJvbSh0aGlzLmV2ZW50cy5rZXlzKCkpLmZvckVhY2gobmFtZSA9PiB0aGlzLm9mZihuYW1lKSk7XG5cbiAgICAgIHRoaXMuZHJpdmVyLmRlc3Ryb3koe1xuICAgICAgICBwbHlyOiB0aGlzLnBsYXllcixcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgaG9zdEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLy8gdGhpcyBtZXRob2QgaXMgcmVxdWlyZWQgYmVjYXVzZSB0aGUgcGx5ciBpbnNlcnRzIGNsb25lIG9mIHRoZSBvcmlnaW5hbCBlbGVtZW50IG9uIGRlc3Ryb3lcbiAgLy8gc28gd2UgY2F0Y2ggdGhlIGNsb25lIGVsZW1lbnQgcmlnaHQgaGVyZSBhbmQgcmV1c2UgaXRcbiAgcHJpdmF0ZSBlbnN1cmVWaWRlb0VsZW1lbnQoKSB7XG4gICAgY29uc3QgdmlkZW9FbGVtZW50ID0gdGhpcy5ob3N0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlbycpO1xuXG4gICAgaWYgKHZpZGVvRWxlbWVudCkge1xuICAgICAgdGhpcy52aWRlb0VsZW1lbnQgPSB2aWRlb0VsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgICAgdGhpcy52aWRlb0VsZW1lbnQuY29udHJvbHMgPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy5wbHlyQ3Jvc3NPcmlnaW4pIHtcbiAgICAgICAgdGhpcy52aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdjcm9zc29yaWdpbicsICcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGx5clBsYXlzSW5saW5lKSB7XG4gICAgICAgIHRoaXMudmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZSgncGxheXNpbmxpbmUnLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5ob3N0RWxlbWVudCwgdGhpcy52aWRlb0VsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb24obmFtZTogc3RyaW5nLCBoYW5kbGVyOiBhbnkpIHtcbiAgICB0aGlzLmV2ZW50cy5zZXQobmFtZSwgaGFuZGxlcik7XG4gICAgdGhpcy5wbGF5ZXIub24obmFtZSBhcyBhbnksIGhhbmRsZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBvZmYobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5wbGF5ZXIub2ZmKG5hbWUgYXMgYW55LCB0aGlzLmV2ZW50cy5nZXQobmFtZSkpO1xuICAgIHRoaXMuZXZlbnRzLmRlbGV0ZShuYW1lKTtcbiAgfVxuXG59XG4iLCIiXX0=