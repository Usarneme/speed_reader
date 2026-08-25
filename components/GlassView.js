import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

/**
 * Cross-platform Glassmorphic Blur Container
 * Uses expo-blur BlurView on Native and CSS backdrop-filter blur on Web.
 */
export default function GlassView({ style, children, intensity = 50, tint = 'default', ...props }) {
  if (Platform.OS === 'web') {
    const webGlassStyle = {
      backdropFilter: `blur(${Math.round(intensity / 3)}px)`,
      WebkitBackdropFilter: `blur(${Math.round(intensity / 3)}px)`,
    };
    return (
      <View style={[style, webGlassStyle]} {...props}>
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} tint={tint} style={style} {...props}>
      {children}
    </BlurView>
  );
}
