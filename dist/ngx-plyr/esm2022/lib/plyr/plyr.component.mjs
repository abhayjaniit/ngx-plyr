import { Component, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { DefaultPlyrDriver } from '../plyr-driver/default-plyr-driver';
import * as i0 from "@angular/core";
const _c0 = ["v"];
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
    static { this.ɵfac = function PlyrComponent_Factory(t) { return new (t || PlyrComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.Renderer2)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlyrComponent, selectors: [["plyr"], ["", "plyr", ""]], viewQuery: function PlyrComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.vr = _t.first);
        } }, inputs: { plyrDriver: "plyrDriver", plyrType: "plyrType", plyrTitle: "plyrTitle", plyrPoster: "plyrPoster", plyrSources: "plyrSources", plyrTracks: "plyrTracks", plyrOptions: "plyrOptions", plyrCrossOrigin: "plyrCrossOrigin", plyrPlaysInline: "plyrPlaysInline" }, outputs: { plyrInit: "plyrInit", plyrProgress: "plyrProgress", plyrPlaying: "plyrPlaying", plyrPlay: "plyrPlay", plyrPause: "plyrPause", plyrTimeUpdate: "plyrTimeUpdate", plyrVolumeChange: "plyrVolumeChange", plyrSeeking: "plyrSeeking", plyrSeeked: "plyrSeeked", plyrRateChange: "plyrRateChange", plyrEnded: "plyrEnded", plyrEnterFullScreen: "plyrEnterFullScreen", plyrExitFullScreen: "plyrExitFullScreen", plyrCaptionsEnabled: "plyrCaptionsEnabled", plyrCaptionsDisabled: "plyrCaptionsDisabled", plyrLanguageChange: "plyrLanguageChange", plyrControlsHidden: "plyrControlsHidden", plyrControlsShown: "plyrControlsShown", plyrReady: "plyrReady", plyrLoadStart: "plyrLoadStart", plyrLoadedData: "plyrLoadedData", plyrLoadedMetadata: "plyrLoadedMetadata", plyrQualityChange: "plyrQualityChange", plyrCanPlay: "plyrCanPlay", plyrCanPlayThrough: "plyrCanPlayThrough", plyrStalled: "plyrStalled", plyrWaiting: "plyrWaiting", plyrEmptied: "plyrEmptied", plyrCueChange: "plyrCueChange", plyrError: "plyrError", plyrStateChange: "plyrStateChange" }, exportAs: ["plyr"], features: [i0.ɵɵNgOnChangesFeature], decls: 0, vars: 0, template: function PlyrComponent_Template(rf, ctx) { } }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlyrComponent, [{
        type: Component,
        args: [{ selector: 'plyr, [plyr]', exportAs: 'plyr', template: "" }]
    }], () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }], { plyrDriver: [{
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
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlyrComponent, { className: "PlyrComponent" }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx5ci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcGx5ci9zcmMvbGliL3BseXIvcGx5ci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFpQixTQUFTLEVBQTRCLEtBQUssRUFBZ0MsTUFBTSxFQUEyQixTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFcEssT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDOzs7QUFTdkUsTUFBTSxPQUFPLGFBQWE7SUFJeEIsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFxRUQsWUFDVSxVQUFzQyxFQUN0QyxNQUFjLEVBQ2QsUUFBbUI7UUFGbkIsZUFBVSxHQUFWLFVBQVUsQ0FBNEI7UUFDdEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUE1RXJCLGlCQUFZLEdBQUcsSUFBSSxlQUFlLENBQU8sSUFBSSxDQUFDLENBQUM7UUFNL0MsV0FBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFJbEIsYUFBUSxHQUFtQixPQUFPLENBQUM7UUFrQjVDLGtCQUFrQjtRQUNSLGFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQXVCLENBQUM7UUFFOUYsd0JBQXdCO1FBQ2QsaUJBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FB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QUFtQjtrQkFBNUIsTUFBTTtZQUNHLGtCQUFrQjtrQkFBM0IsTUFBTTtZQUNHLG1CQUFtQjtrQkFBNUIsTUFBTTtZQUNHLG9CQUFvQjtrQkFBN0IsTUFBTTtZQUNHLGtCQUFrQjtrQkFBM0IsTUFBTTtZQUNHLGtCQUFrQjtrQkFBM0IsTUFBTTtZQUNHLGlCQUFpQjtrQkFBMUIsTUFBTTtZQUNHLFNBQVM7a0JBQWxCLE1BQU07WUFHRyxhQUFhO2tCQUF0QixNQUFNO1lBQ0csY0FBYztrQkFBdkIsTUFBTTtZQUNHLGtCQUFrQjtrQkFBM0IsTUFBTTtZQUNHLGlCQUFpQjtrQkFBMUIsTUFBTTtZQUNHLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxrQkFBa0I7a0JBQTNCLE1BQU07WUFDRyxXQUFXO2tCQUFwQixNQUFNO1lBQ0csV0FBVztrQkFBcEIsTUFBTTtZQUNHLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxhQUFhO2tCQUF0QixNQUFNO1lBQ0csU0FBUztrQkFBbEIsTUFBTTtZQUdHLGVBQWU7a0JBQXhCLE1BQU07O2tGQW5FSSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPdXRwdXQsIFJlbmRlcmVyMiwgU2ltcGxlQ2hhbmdlLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIFBseXIgZnJvbSAncGx5cic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGVmYXVsdFBseXJEcml2ZXIgfSBmcm9tICcuLi9wbHlyLWRyaXZlci9kZWZhdWx0LXBseXItZHJpdmVyJztcbmltcG9ydCB7IFBseXJEcml2ZXIgfSBmcm9tICcuLi9wbHlyLWRyaXZlci9wbHlyLWRyaXZlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BseXIsIFtwbHlyXScsIC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgdGVtcGxhdGVVcmw6ICcuL3BseXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wbHlyLmNvbXBvbmVudC5jc3MnXSxcbiAgZXhwb3J0QXM6ICdwbHlyJ1xufSlcbmV4cG9ydCBjbGFzcyBQbHlyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIHByaXZhdGUgcGxheWVyQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQbHlyPihudWxsKTtcblxuICBnZXQgcGxheWVyKCk6IFBseXIge1xuICAgIHJldHVybiB0aGlzLnBsYXllckNoYW5nZS5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBldmVudHMgPSBuZXcgTWFwKCk7XG5cbiAgQElucHV0KCkgcGx5ckRyaXZlcjogUGx5ckRyaXZlcjtcblxuICBASW5wdXQoKSBwbHlyVHlwZTogUGx5ci5NZWRpYVR5cGUgPSAndmlkZW8nO1xuXG4gIEBJbnB1dCgpIHBseXJUaXRsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHBseXJQb3N0ZXI6IHN0cmluZztcblxuICBASW5wdXQoKSBwbHlyU291cmNlczogUGx5ci5Tb3VyY2VbXTtcblxuICBASW5wdXQoKSBwbHlyVHJhY2tzOiBQbHlyLlRyYWNrW107XG5cbiAgQElucHV0KCkgcGx5ck9wdGlvbnM6IFBseXIuT3B0aW9ucztcblxuICBASW5wdXQoKSBwbHlyQ3Jvc3NPcmlnaW46IGJvb2xlYW47XG5cbiAgQElucHV0KCkgcGx5clBsYXlzSW5saW5lOiBib29sZWFuO1xuXG4gIEBWaWV3Q2hpbGQoJ3YnKSBwcml2YXRlIHZyOiBFbGVtZW50UmVmO1xuXG4gIC8vIG5neC1wbHlyIGV2ZW50c1xuICBAT3V0cHV0KCkgcGx5ckluaXQgPSB0aGlzLnBsYXllckNoYW5nZS5waXBlKGZpbHRlcihwbGF5ZXIgPT4gISFwbGF5ZXIpKSBhcyBFdmVudEVtaXR0ZXI8UGx5cj47XG5cbiAgLy8gc3RhbmRhcmQgbWVkaWEgZXZlbnRzXG4gIEBPdXRwdXQoKSBwbHlyUHJvZ3Jlc3MgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgncHJvZ3Jlc3MnKTtcbiAgQE91dHB1dCgpIHBseXJQbGF5aW5nID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3BsYXlpbmcnKTtcbiAgQE91dHB1dCgpIHBseXJQbGF5ID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3BsYXknKTtcbiAgQE91dHB1dCgpIHBseXJQYXVzZSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdwYXVzZScpO1xuICBAT3V0cHV0KCkgcGx5clRpbWVVcGRhdGUgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgndGltZXVwZGF0ZScpO1xuICBAT3V0cHV0KCkgcGx5clZvbHVtZUNoYW5nZSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCd2b2x1bWVjaGFuZ2UnKTtcbiAgQE91dHB1dCgpIHBseXJTZWVraW5nID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3NlZWtpbmcnKTtcbiAgQE91dHB1dCgpIHBseXJTZWVrZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnc2Vla2VkJyk7XG4gIEBPdXRwdXQoKSBwbHlyUmF0ZUNoYW5nZSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdyYXRlY2hhbmdlJyk7XG4gIEBPdXRwdXQoKSBwbHlyRW5kZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnZW5kZWQnKTtcbiAgQE91dHB1dCgpIHBseXJFbnRlckZ1bGxTY3JlZW4gPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnZW50ZXJmdWxsc2NyZWVuJyk7XG4gIEBPdXRwdXQoKSBwbHlyRXhpdEZ1bGxTY3JlZW4gPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnZXhpdGZ1bGxzY3JlZW4nKTtcbiAgQE91dHB1dCgpIHBseXJDYXB0aW9uc0VuYWJsZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnY2FwdGlvbnNlbmFibGVkJyk7XG4gIEBPdXRwdXQoKSBwbHlyQ2FwdGlvbnNEaXNhYmxlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdjYXB0aW9uc2Rpc2FibGVkJyk7XG4gIEBPdXRwdXQoKSBwbHlyTGFuZ3VhZ2VDaGFuZ2UgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbGFuZ3VhZ2VjaGFuZ2UnKTtcbiAgQE91dHB1dCgpIHBseXJDb250cm9sc0hpZGRlbiA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdjb250cm9sc2hpZGRlbicpO1xuICBAT3V0cHV0KCkgcGx5ckNvbnRyb2xzU2hvd24gPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnY29udHJvbHNzaG93bicpO1xuICBAT3V0cHV0KCkgcGx5clJlYWR5ID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3JlYWR5Jyk7XG5cbiAgLy8gSFRNTDUgZXZlbnRzXG4gIEBPdXRwdXQoKSBwbHlyTG9hZFN0YXJ0ID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2xvYWRzdGFydCcpO1xuICBAT3V0cHV0KCkgcGx5ckxvYWRlZERhdGEgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbG9hZGVkZGF0YScpO1xuICBAT3V0cHV0KCkgcGx5ckxvYWRlZE1ldGFkYXRhID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2xvYWRlZG1ldGFkYXRhJyk7XG4gIEBPdXRwdXQoKSBwbHlyUXVhbGl0eUNoYW5nZSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdxdWFsaXR5Y2hhbmdlJyk7XG4gIEBPdXRwdXQoKSBwbHlyQ2FuUGxheSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdjYW5wbGF5Jyk7XG4gIEBPdXRwdXQoKSBwbHlyQ2FuUGxheVRocm91Z2ggPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnY2FucGxheXRocm91Z2gnKTtcbiAgQE91dHB1dCgpIHBseXJTdGFsbGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3N0YWxsZWQnKTtcbiAgQE91dHB1dCgpIHBseXJXYWl0aW5nID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3dhaXRpbmcnKTtcbiAgQE91dHB1dCgpIHBseXJFbXB0aWVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2VtcHRpZWQnKTtcbiAgQE91dHB1dCgpIHBseXJDdWVDaGFuZ2UgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnY3VlY2hhbmdlJyk7XG4gIEBPdXRwdXQoKSBwbHlyRXJyb3IgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnZXJyb3InKTtcblxuICAvLyBZb3VUdWJlIGV2ZW50c1xuICBAT3V0cHV0KCkgcGx5clN0YXRlQ2hhbmdlID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3N0YXRlY2hhbmdlJyk7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIHByaXZhdGUgZHJpdmVyOiBQbHlyRHJpdmVyO1xuXG4gIHByaXZhdGUgdmlkZW9FbGVtZW50OiBIVE1MVmlkZW9FbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD4sXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICkge1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcCBpbiBrZXlvZiBQbHlyQ29tcG9uZW50XT86IFNpbXBsZUNoYW5nZTsgfSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMucGx5ckluaXQucGlwZShmaXJzdCgpKS5zdWJzY3JpYmUoKHBsYXllcjogUGx5cikgPT4ge1xuICAgICAgY29uc3QgcmVpbml0VHJpZ2dlcnMgPSBbY2hhbmdlcy5wbHlyT3B0aW9ucywgY2hhbmdlcy5wbHlyUGxheXNJbmxpbmUsIGNoYW5nZXMucGx5ckNyb3NzT3JpZ2luXS5maWx0ZXIodCA9PiAhIXQpO1xuXG4gICAgICBpZiAocmVpbml0VHJpZ2dlcnMubGVuZ3RoKSB7XG4gICAgICAgIGlmIChyZWluaXRUcmlnZ2Vycy5zb21lKHQgPT4gIXQuZmlyc3RDaGFuZ2UpKSB7XG4gICAgICAgICAgdGhpcy5pbml0UGx5cih0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVQbHlyU291cmNlKHBsYXllcik7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95UGxheWVyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuaW5pdFBseXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFBseXIoZm9yY2UgPSBmYWxzZSkge1xuICAgIGlmIChmb3JjZSB8fCAhdGhpcy5wbGF5ZXIpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZXN0cm95UGxheWVyKCk7XG5cbiAgICAgICAgdGhpcy5kcml2ZXIgPSB0aGlzLnBseXJEcml2ZXIgfHwgbmV3IERlZmF1bHRQbHlyRHJpdmVyKCk7XG5cbiAgICAgICAgdGhpcy5lbnN1cmVWaWRlb0VsZW1lbnQoKTtcblxuICAgICAgICBjb25zdCBuZXdQbGF5ZXIgPSB0aGlzLmRyaXZlci5jcmVhdGUoe1xuICAgICAgICAgIHZpZGVvRWxlbWVudDogdGhpcy52aWRlb0VsZW1lbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5wbHlyT3B0aW9ucyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVQbHlyU291cmNlKG5ld1BsYXllcik7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJDaGFuZ2UubmV4dChuZXdQbGF5ZXIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQbHlyU291cmNlKHBseXI6IFBseXIpIHtcbiAgICB0aGlzLmRyaXZlci51cGRhdGVTb3VyY2Uoe1xuICAgICAgdmlkZW9FbGVtZW50OiB0aGlzLnZpZGVvRWxlbWVudCxcbiAgICAgIHBseXIsXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgdHlwZTogdGhpcy5wbHlyVHlwZSxcbiAgICAgICAgdGl0bGU6IHRoaXMucGx5clRpdGxlLFxuICAgICAgICBzb3VyY2VzOiB0aGlzLnBseXJTb3VyY2VzLFxuICAgICAgICBwb3N0ZXI6IHRoaXMucGx5clBvc3RlcixcbiAgICAgICAgdHJhY2tzOiB0aGlzLnBseXJUcmFja3MsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLy8gc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MzcwNDEwMi8xOTkwNDUxXG4gIHByaXZhdGUgY3JlYXRlTGF6eUV2ZW50PFQgZXh0ZW5kcyBQbHlyLlBseXJFdmVudD4obmFtZTogUGx5ci5TdGFuZGFyZEV2ZW50IHwgUGx5ci5IdG1sNUV2ZW50IHwgUGx5ci5Zb3V0dWJlRXZlbnQpOiBFdmVudEVtaXR0ZXI8VD4ge1xuICAgIHJldHVybiB0aGlzLnBseXJJbml0LnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKCkgPT4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4gdGhpcy5vbihuYW1lLCAoZGF0YTogVCkgPT4gdGhpcy5uZ1pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQoZGF0YSkpKSkpXG4gICAgKSBhcyBFdmVudEVtaXR0ZXI8VD47XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3lQbGF5ZXIoKSB7XG4gICAgaWYgKHRoaXMucGxheWVyKSB7XG4gICAgICBBcnJheS5mcm9tKHRoaXMuZXZlbnRzLmtleXMoKSkuZm9yRWFjaChuYW1lID0+IHRoaXMub2ZmKG5hbWUpKTtcblxuICAgICAgdGhpcy5kcml2ZXIuZGVzdHJveSh7XG4gICAgICAgIHBseXI6IHRoaXMucGxheWVyLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudmlkZW9FbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBob3N0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvLyB0aGlzIG1ldGhvZCBpcyByZXF1aXJlZCBiZWNhdXNlIHRoZSBwbHlyIGluc2VydHMgY2xvbmUgb2YgdGhlIG9yaWdpbmFsIGVsZW1lbnQgb24gZGVzdHJveVxuICAvLyBzbyB3ZSBjYXRjaCB0aGUgY2xvbmUgZWxlbWVudCByaWdodCBoZXJlIGFuZCByZXVzZSBpdFxuICBwcml2YXRlIGVuc3VyZVZpZGVvRWxlbWVudCgpIHtcbiAgICBjb25zdCB2aWRlb0VsZW1lbnQgPSB0aGlzLmhvc3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJyk7XG5cbiAgICBpZiAodmlkZW9FbGVtZW50KSB7XG4gICAgICB0aGlzLnZpZGVvRWxlbWVudCA9IHZpZGVvRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWRlb0VsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5jb250cm9scyA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLnBseXJDcm9zc09yaWdpbikge1xuICAgICAgICB0aGlzLnZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Nyb3Nzb3JpZ2luJywgJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wbHlyUGxheXNJbmxpbmUpIHtcbiAgICAgICAgdGhpcy52aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGF5c2lubGluZScsICcnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmhvc3RFbGVtZW50LCB0aGlzLnZpZGVvRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbihuYW1lOiBzdHJpbmcsIGhhbmRsZXI6IGFueSkge1xuICAgIHRoaXMuZXZlbnRzLnNldChuYW1lLCBoYW5kbGVyKTtcbiAgICB0aGlzLnBsYXllci5vbihuYW1lIGFzIGFueSwgaGFuZGxlcik7XG4gIH1cblxuICBwcml2YXRlIG9mZihuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBsYXllci5vZmYobmFtZSBhcyBhbnksIHRoaXMuZXZlbnRzLmdldChuYW1lKSk7XG4gICAgdGhpcy5ldmVudHMuZGVsZXRlKG5hbWUpO1xuICB9XG5cbn1cbiJdfQ==