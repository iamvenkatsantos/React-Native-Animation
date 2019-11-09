import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import SVG, { Image, Circle, ClipPath } from "react-native-svg";
import { TapGestureHandler, State } from "react-native-gesture-handler";
const {
  Clock,
  Value,
  set,
  cond,
  eq,
  event,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
  interpolate,
  Extrapolate,
  concat
} = Animated;
function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 600,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest)
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]
    ),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug("stop clock", stopClock(clock))),
    // we made the block return the updated position
    state.position
  ]);
}
export class Login extends Component {
  constructor(props) {
    super();

    this.buttonOpacity = new Value(1);
    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);

    this.onCloseChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            )
          ])
      }
    ]);
    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 2 - 50, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.zINdexText = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP
    });
    this.textOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.textY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP
    });
    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP
    });
  }

  render() {
    const { width, height } = Dimensions.get("screen");
    return (
      <View style={{ ...style.container, justifyContent: "flex-end" }}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }]
          }}
        >
          <SVG height={height + 50} width={width}>
            <ClipPath id="clipPath">
              <Circle r={height + 50} cx={width / 2} />
            </ClipPath>
            <Image
              href={require("../assets/59b799f3-496f-4fba-a509-255902bf21cc.jpeg")}
              height={height + 50}
              width={width + 30}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#clipPath)"
            />
          </SVG>
        </Animated.View>
        <View style={style.container1}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...style.button,
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}
            >
              <Text style={style.text}> SIGN IN </Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View
            style={{
              ...style.button,
              backgroundColor: "blue",
              opacity: this.buttonOpacity,
              transform: [{ translateY: this.buttonY }]
            }}
          >
            <Text style={{ ...style.text, color: "white" }}>
              SIGN IN WITH FACEBOOK
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              ...style.container2,
              zIndex: this.zINdexText,
              opacity: this.textOpacity,
              transform: [{ translateY: this.textY }]
            }}
          >
            <TapGestureHandler onHandlerStateChange={this.onCloseChange}>
              <Animated.View style={style.closeButton}>
                <Animated.Text
                  style={{
                    fontSize: 20,
                    transform: [{ rotate: concat(this.rotateCross, "deg") }]
                  }}
                >
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>
            <TextInput
              placeholder="Enter Email or Username"
              placeholderTextColor="black"
              style={style.textInput}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="black"
              style={style.textInput}
            />
            <Animated.View style={style.button}>
              <Text style={{ ...style.text, color: "black" }}> LOGIN</Text>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container1: {
    height: height / 3,
    justifyContent: "space-evenly",
    alignItems: "center",
    width: width
  },
  button: {
    width: width * 0.7,
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    elevation: 3
  },
  text: {
    fontSize: 20,
    fontWeight: "900"
  },
  container2: {
    ...StyleSheet.absoluteFill,
    height: height / 2,
    top: null,
    paddingTop: 20,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  textInput: {
    height: 50,
    width: width * 0.7,
    borderRadius: 15,
    borderWidth: 0.5,
    paddingLeft: 10
  },
  closeButton: {
    width: width / 2 - 20,
    elevation: 3,
    position: "absolute",
    top: -20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,
    width: 40,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.3
  }
});

export default Login;
