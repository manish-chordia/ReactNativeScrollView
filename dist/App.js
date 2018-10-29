var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import { View, PanResponder } from 'react-native';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.onViewLayout = (evt) => {
            const { height, width } = evt.nativeEvent.layout;
            this.viewHeight = height;
            this.viewWidth = width;
            if (this.props.onContentSizeChange) {
                this.props.onContentSizeChange(width, height);
            }
        };
        this.onParentLayout = (evt) => {
            const { width, height } = evt.nativeEvent.layout;
            if (this.props.horizontal) {
                this.height = this.viewWidth - width;
            }
            else {
                this.height = this.viewHeight - height;
            }
        };
        this.setNativeTranslation = (translation) => {
            this.sendScrollEvent();
            let transformObject = {};
            if (this.props.horizontal) {
                transformObject = { translateX: translation };
            }
            else {
                transformObject = { translateY: translation };
            }
            this.scrollViewRef.setNativeProps({
                transform: [transformObject],
            });
        };
        this.position = 0;
        this.min = 0;
        this.pressed = false;
        this.prevDistanceMoved = 0;
        this.isAutoScrolling = false;
        this.amplitude = 0;
        this.target = 0;
        this.timestamp = 0;
        this.viewHeight = 0;
        this.viewWidth = 0;
        this.height = 0;
        this.distanceMoved = 0;
        this.shouldScroll = true;
        this.autoScroll = this.autoScroll.bind(this);
        this.getScrollPosition = this.getScrollPosition.bind(this);
        this.isScrollable = this.isScrollable.bind(this);
        this.allowScroll = this.allowScroll.bind(this);
        this.sendScrollEvent = this.sendScrollEvent.bind(this);
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: () => {
                this.prevDistanceMoved = 0;
                this.pressed = true;
                this.isAutoScrolling = false;
            },
            onPanResponderMove: (evt, gestureState) => {
                const distanceMoved = this.props.horizontal ? gestureState.dx : gestureState.dy;
                if (!this.shouldScroll) {
                    this.sendScrollEvent();
                    return;
                }
                if (this.pressed) {
                    const delta = this.prevDistanceMoved - distanceMoved;
                    if (delta < -0.5 || delta > 0.5) {
                        this.prevDistanceMoved = distanceMoved;
                        this.position = this.getScrollPosition(this.position - delta);
                        this.setNativeTranslation(this.position);
                    }
                }
            },
            onPanResponderTerminationRequest: () => true,
            onPanResponderRelease: (evt, gestureState) => {
                this.pressed = false;
                const velocity = this.props.horizontal ? gestureState.vx * 1000 : gestureState.vy * 1000;
                if (velocity > 10 || velocity < -10) {
                    this.amplitude = velocity;
                    this.target = Math.round(this.position + this.amplitude);
                    this.timestamp = Date.now();
                    this.isAutoScrolling = true;
                    window.requestAnimationFrame(this.autoScroll);
                }
            },
            onPanResponderTerminate: () => {
                this.pressed = false;
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: () => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }
    getScrollPosition(position) {
        position = position > 0 ? 0 : position < -this.height ? -this.height : position;
        this.distanceMoved = position - this.position;
        return position;
    }
    isScrollable() {
        return this.position > -this.height && this.position < this.min;
    }
    getTimeConstant(decelerationRate) {
        return -16.7 / Math.log(decelerationRate);
    }
    autoScroll() {
        if (!this.isScrollable() || !this.isAutoScrolling || !this.shouldScroll) {
            if (!this.shouldScroll) {
                this.sendScrollEvent();
            }
            return;
        }
        let elapsed, delta;
        if (this.amplitude) {
            elapsed = Date.now() - this.timestamp;
            const timeConstant = this.getTimeConstant(this.props.decelerationRate || 0.95);
            delta = this.amplitude * Math.exp(-elapsed / timeConstant);
            if (delta > 0.5 || delta < -0.5) {
                this.position = this.getScrollPosition(this.target - delta);
                this.setNativeTranslation(this.position);
                window.requestAnimationFrame(this.autoScroll);
            }
            else {
                this.isAutoScrolling = false;
            }
        }
    }
    scrollTo(position) {
        position = position > 0 ? 0 : position < -this.height ? -this.height : position;
        this.distanceMoved = position - this.position;
        this.position = position;
        this.setNativeTranslation(position);
    }
    allowScroll(shouldScrollViewScroll) {
        this.shouldScroll = shouldScrollViewScroll;
    }
    sendScrollEvent() {
        const scrollObject = {
            id: this.props.id,
            distanceMoved: this.distanceMoved,
            scrollPosition: this.position,
            scrollableAreaRemaining: this.height + this.position,
            allowScroll: this.allowScroll
        };
        this.props.onScroll && this.props.onScroll(scrollObject);
    }
    render() {
        const _a = this.props, { style } = _a, rest = __rest(_a, ["style"]);
        return (React.createElement(View, { onLayout: this.onParentLayout, style: style },
            React.createElement(View, Object.assign({}, rest, { onLayout: this.onViewLayout, ref: (component) => (this.scrollViewRef = component) }, this._panResponder.panHandlers))));
    }
}
