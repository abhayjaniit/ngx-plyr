import * as Plyr from 'plyr';
import * as i0 from '@angular/core';
import { Component, Input, ViewChild, Output, NgModule } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

class DefaultPlyrDriver {
    create(params) {
        return new Plyr(params.videoElement, params.options);
    }
    updateSource(params) {
        params.plyr.source = params.source;
    }
    destroy(params) {
        params.plyr.destroy();
    }
}

class PlyrComponent {
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

class PlyrModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.4", ngImport: i0, type: PlyrModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.2.4", ngImport: i0, type: PlyrModule, declarations: [PlyrComponent], exports: [PlyrComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.2.4", ngImport: i0, type: PlyrModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.4", ngImport: i0, type: PlyrModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        PlyrComponent,
                    ],
                    exports: [
                        PlyrComponent,
                    ]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { DefaultPlyrDriver, PlyrComponent, PlyrModule };
//# sourceMappingURL=ngx-plyr.mjs.map
