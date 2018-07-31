import * as React from 'react';
import { View, PanResponder, Animated, Text } from 'react-native';
export default class App extends React.Component {
    constructor(props) {
        super(props);
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

        this.state = {
            animatedValue: new Animated.Value(0),
        };

        this.autoScroll = this.autoScroll.bind(this);
        this.getScrollPosition = this.getScrollPosition.bind(this);
        this.isScrollable = this.isScrollable.bind(this);

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
                if (this.pressed) {
                    const delta = this.prevDistanceMoved - distanceMoved;
                    if (delta < -0.5 || delta > 0.5) {
                        this.prevDistanceMoved = distanceMoved;
                        this.position = this.getScrollPosition(this.position - delta);
                        this.state.animatedValue.setValue(this.position);
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
    onViewLayout = evt => {
        const { height, width } = evt.nativeEvent.layout;
        this.viewHeight = height;
        this.viewWidth = width;
    };
    onParentLayout = evt => {
        const { width, height } = evt.nativeEvent.layout;
        if (this.props.horizontal) {
            this.height = this.viewWidth - width;
        } else {
            this.height = this.viewHeight - height;
        }
    };
    getScrollPosition(position) {
        return position > 0 ? 0 : position < -this.height ? -this.height : position;
    }
    isScrollable() {
        return this.position > -this.height && this.position < this.min;
    }
    autoScroll() {
        if (!this.isScrollable() || !this.isAutoScrolling) {
            return;
        }
        let elapsed, delta;
        if (this.amplitude) {
            elapsed = Date.now() - this.timestamp;
            delta = this.amplitude * Math.exp(-elapsed / 325);
            if (delta > 0.5 || delta < -0.5) {
                this.position = this.getScrollPosition(this.target - delta);
                this.state.animatedValue.setValue(this.position);
                window.requestAnimationFrame(this.autoScroll);
            } else {
                this.isAutoScrolling = false;
            }
        }
    }
    render() {
        let items = [];
        for (let i = 0; i < 600; i++) {
            items.push(
                <View key={i}>
                    <Text style={{ fontSize: 60 }}>{i}</Text>
                </View>
            );
        }
        let transformObject = {};
        if (this.props.horizontal) {
            transformObject = { translateX: this.state.animatedValue };
        } else {
            transformObject = { translateY: this.state.animatedValue };
        }
        return (
            <View onLayout={this.onParentLayout} style={{ height: 600 }}>
                <Animated.View
                    onLayout={this.onViewLayout}
                    style={{ transform: [transformObject] }}
                    ref={component => (this.scrollViewRef = component)}
                    {...this._panResponder.panHandlers}
                >
                    {items}
                </Animated.View>
            </View>
        );
    }
}
