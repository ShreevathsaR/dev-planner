import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Image } from "expo-image";

const { width: screenWidth } = Dimensions.get("window");

// Abstract floating elements component
const FloatingElement = ({ delay, size, top, left, duration = 3000 }: any) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 1000 }));
    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(-20, { duration }), -1, true)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.floatingElement,
        {
          width: size,
          height: size,
          top,
          left,
        },
        animatedStyle,
      ]}
    />
  );
};

// Grid pattern background
const GridPattern = () => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(500, withTiming(1, { duration: 1500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: interpolate(scale.value, [0, 1], [0, 0.1], Extrapolate.CLAMP),
    };
  });

  return (
    <Animated.View style={[styles.gridPattern, animatedStyle]}>
      {Array.from({ length: 20 }).map((_, i) => (
        <View key={i} style={styles.gridLine} />
      ))}
    </Animated.View>
  );
};

// Animated title component
const AnimatedTitle = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 800 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.Text style={[styles.titleText, animatedStyle]}>
      {children}
    </Animated.Text>
  );
};

export default function WelcomeScreen() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      {/* Background Grid Pattern */}
      <GridPattern />

      {/* Floating Abstract Elements */}
      <FloatingElement
        delay={1000}
        size={60}
        top="15%"
        left="10%"
        duration={8000}
      />
      <FloatingElement
        delay={1200}
        size={40}
        top="25%"
        left="80%"
        duration={7500}
      />
      <FloatingElement
        delay={1400}
        size={80}
        top="60%"
        left="5%"
        duration={8500}
      />
      <FloatingElement
        delay={1600}
        size={50}
        top="70%"
        left="85%"
        duration={7800}
      />
      <FloatingElement
        delay={1800}
        size={35}
        top="40%"
        left="90%"
        duration={8200}
      />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Logo/Brand Section */}
        <Animated.View
          entering={FadeIn.delay(300).duration(1000)}
          style={styles.logoContainer}
        >
          <View style={styles.logoIcon}>
            {/* <Text style={styles.logoText}>DP</Text> */}
            <Image source={require("../../assets/images/logo.png")} tintColor={"white"} contentFit="contain" style={{ width: 80, height: 80 }} />
          </View>
        </Animated.View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <AnimatedTitle delay={600}>DevPlanner</AnimatedTitle>
          <Animated.View
            entering={FadeInUp.delay(800).duration(800)}
            style={styles.subtitleContainer}
          >
            <Text style={styles.subtitleText}>AI-Powered</Text>
            <Text style={styles.subtitleText}>Project Planning</Text>
          </Animated.View>
        </View>

        {/* Feature Pills */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(800)}
          style={styles.featuresContainer}
        >
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>Smart Planning</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>Team Collaboration</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>Progress Tracking</Text>
          </View>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View
          entering={FadeInDown.delay(1200).duration(800)}
          style={styles.buttonContainer}
        >
          <Link href="/sign-up" style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Link>
          <Link href="/sign-in" style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </Link>
        </Animated.View>

        {/* Bottom Text */}
        <Animated.View
          entering={FadeIn.delay(1400).duration(800)}
          style={styles.bottomTextContainer}
        >
          <Text style={styles.bottomText}>
            Transform your project management with AI
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  gridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridLine: {
    width: screenWidth / 10,
    height: 1,
    backgroundColor: "#333",
    marginBottom: 40,
  },
  floatingElement: {
    position: "absolute",
    backgroundColor: "#1a1a1a",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#696969",
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    // backgroundColor: "#1a1a1a",
    // borderWidth: 2,
    // borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  titleText: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  subtitleText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    fontWeight: "300",
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 50,
  },
  featurePill: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  featurePillText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
    gap: 15,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomTextContainer: {
    marginTop: 20,
  },
  bottomText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "300",
  },
});
