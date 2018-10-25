import React from 'react';
import { View, PanResponder, Text } from 'react-native';
export default class ScrollView extends React.Component {
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
        var currPos = position > 0 ? 0 : position < -this.height ? -this.height : position;
        this.props.onScroll && this.props.onScroll(currPos);
        return currPos;
    }
    isScrollable() {
        return this.position > -this.height && this.position < this.min;
    }
    getTimeConstant(decelarationRate) {
        return -16.7 / Math.log(decelarationRate);
    }
    autoScroll() {
        if (!this.isScrollable() || !this.isAutoScrolling) {
            return;
        }
        let elapsed, delta;
        if (this.amplitude) {
            elapsed = Date.now() - this.timestamp;
            const timeConstant = this.getTimeConstant(this.props.decelarationRate);
            delta = this.amplitude * Math.exp(-elapsed / timeConstant);
            if (delta > 0.5 || delta < -0.5) {
                this.position = this.getScrollPosition(this.target - delta);
                this.setNativeTranslation(this.position);
                window.requestAnimationFrame(this.autoScroll);
            } else {
                this.isAutoScrolling = false;
            }
        }
    }
    scrollTo(position) {
        this.position = position;
        this.setNativeTranslation(position);
    }

    setNativeTranslation = translation => {
        let transformObject = {};
        if (this.props.horizontal) {
            transformObject = { translateX: translation };
        } else {
            transformObject = { translateY: translation };
        }

        this.scrollViewRef.setNativeProps({
            transform: [transformObject],
        });
    };

    render() {
        const { style, ...rest } = this.props;
        console.log()

        return (
            <View onLayout={this.onParentLayout} style={style}>
                <View {...rest} onLayout={this.onViewLayout} ref={component => (this.scrollViewRef = component)} {...this._panResponder.panHandlers} >
                </View>    
            </View>
        );
    }
}

ScrollView.defaultProps = {
    decelarationRate: 0.95,
    style: {
        height: 150
    }
};
