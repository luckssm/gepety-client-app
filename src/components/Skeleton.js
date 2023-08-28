import { useState, useEffect } from 'react'
import { View, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import Colors from '../themes/colors'

export default function Skeleton ({ style }) {
  const [x, setX] = useState(new Animated.Value(0))

  const skeletonAnimation = () => {
    Animated.loop(
      Animated.timing(x, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    ).start()
  }

  useEffect(() => {
    skeletonAnimation()
  }, [])

  const AnimatedGradientView = () => {
    const translateX = x.interpolate({
      inputRange: [0, 1],
      outputRange: [-300, 400]
    })

    return (
      <Animated.View
        style={{
          height: '100%',
          width: '100%',
          transform: [{ translateX }]
        }}
      >
        <LinearGradient
          style={{
            height: '100%',
            width: '60%'
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          colors={[
            Colors.graySkeleton,
            Colors.graySkeletonLighter,
            Colors.lighterGray,
            Colors.graySkeleton
          ]}
        />
      </Animated.View>
    )
  }

  return (
    <View
      style={[
        style,
        { backgroundColor: Colors.graySkeleton, overflow: 'hidden' }
      ]}
    >
      <AnimatedGradientView />
    </View>
  )
}
