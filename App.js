"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.onViewLayout = function (evt) {
            var _a = evt.nativeEvent.layout, height = _a.height, width = _a.width;
            _this.viewHeight = height;
            _this.viewWidth = width;
            if (_this.props.onContentSizeChange) {
                _this.props.onContentSizeChange(width, height);
            }
        };
        _this.onParentLayout = function (evt) {
            var _a = evt.nativeEvent.layout, width = _a.width, height = _a.height;
            if (_this.props.horizontal) {
                _this.height = _this.viewWidth - width;
            }
            else {
                _this.height = _this.viewHeight - height;
            }
        };
        _this.setNativeTranslation = function (translation) {
            _this.sendScrollEvent();
            var transformObject = {};
            if (_this.props.horizontal) {
                transformObject = { translateX: translation };
            }
            else {
                transformObject = { translateY: translation };
            }
            _this.scrollViewRef.setNativeProps({
                transform: [transformObject],
            });
        };
        _this.position = 0;
        _this.min = 0;
        _this.pressed = false;
        _this.prevDistanceMoved = 0;
        _this.isAutoScrolling = false;
        _this.amplitude = 0;
        _this.target = 0;
        _this.timestamp = 0;
        _this.viewHeight = 0;
        _this.viewWidth = 0;
        _this.height = 0;
        _this.distanceMoved = 0;
        _this.shouldScroll = true;
        _this.autoScroll = _this.autoScroll.bind(_this);
        _this.getScrollPosition = _this.getScrollPosition.bind(_this);
        _this.isScrollable = _this.isScrollable.bind(_this);
        _this.allowScroll = _this.allowScroll.bind(_this);
        _this.sendScrollEvent = _this.sendScrollEvent.bind(_this);
        _this._panResponder = react_native_1.PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: function () { return true; },
            onStartShouldSetPanResponderCapture: function () { return true; },
            onMoveShouldSetPanResponder: function () { return true; },
            onMoveShouldSetPanResponderCapture: function () { return true; },
            onPanResponderGrant: function () {
                _this.prevDistanceMoved = 0;
                _this.pressed = true;
                _this.isAutoScrolling = false;
            },
            onPanResponderMove: function (evt, gestureState) {
                var distanceMoved = _this.props.horizontal ? gestureState.dx : gestureState.dy;
                if (!_this.shouldScroll) {
                    _this.sendScrollEvent();
                    return;
                }
                if (_this.pressed) {
                    var delta = _this.prevDistanceMoved - distanceMoved;
                    if (delta < -0.5 || delta > 0.5) {
                        _this.prevDistanceMoved = distanceMoved;
                        _this.position = _this.getScrollPosition(_this.position - delta);
                        _this.setNativeTranslation(_this.position);
                    }
                }
            },
            onPanResponderTerminationRequest: function () { return true; },
            onPanResponderRelease: function (evt, gestureState) {
                _this.pressed = false;
                var velocity = _this.props.horizontal ? gestureState.vx * 1000 : gestureState.vy * 1000;
                if (velocity > 10 || velocity < -10) {
                    _this.amplitude = velocity;
                    _this.target = Math.round(_this.position + _this.amplitude);
                    _this.timestamp = Date.now();
                    _this.isAutoScrolling = true;
                    window.requestAnimationFrame(_this.autoScroll);
                }
            },
            onPanResponderTerminate: function () {
                _this.pressed = false;
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: function () {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
        return _this;
    }
    App.prototype.getScrollPosition = function (position) {
        position = position > 0 ? 0 : position < -this.height ? -this.height : position;
        this.distanceMoved = position - this.position;
        return position;
    };
    App.prototype.isScrollable = function () {
        return this.position > -this.height && this.position < this.min;
    };
    App.prototype.getTimeConstant = function (decelerationRate) {
        return -16.7 / Math.log(decelerationRate);
    };
    App.prototype.autoScroll = function () {
        if (!this.isScrollable() || !this.isAutoScrolling || !this.shouldScroll) {
            if (!this.shouldScroll) {
                this.sendScrollEvent();
            }
            return;
        }
        var elapsed, delta;
        if (this.amplitude) {
            elapsed = Date.now() - this.timestamp;
            var timeConstant = this.getTimeConstant(this.props.decelerationRate || 0.95);
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
    };
    App.prototype.scrollTo = function (position) {
        position = position > 0 ? 0 : position < -this.height ? -this.height : position;
        this.distanceMoved = position - this.position;
        this.position = position;
        this.setNativeTranslation(position);
    };
    App.prototype.allowScroll = function (shouldScrollViewScroll) {
        this.shouldScroll = shouldScrollViewScroll;
    };
    App.prototype.sendScrollEvent = function () {
        var scrollObject = {
            id: this.props.id,
            distanceMoved: this.distanceMoved,
            scrollPosition: this.position,
            scrollableAreaRemaining: this.height + this.position,
            allowScroll: this.allowScroll
        };
        this.props.onScroll && this.props.onScroll(scrollObject);
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, rest = __rest(_a, ["style"]);
        return (React.createElement(react_native_1.View, { onLayout: this.onParentLayout, style: style },
            React.createElement(react_native_1.View, __assign({}, rest, { onLayout: this.onViewLayout, ref: function (component) { return (_this.scrollViewRef = component); } }, this._panResponder.panHandlers))));
    };
    return App;
}(React.Component));
exports.default = App;
